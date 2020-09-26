import dbs from '../../js/db';
// eslint-disable-next-line import/default
import ConnWorker from '../../js/workers/conn.worker.js';

const workers = {};
const db = dbs.cache;

export default {
    namespaced: true,
    state: {
        isReady: false,
        caches: {}
    },
    getters: {
        isReady: (state) => state.isReady,
        caches: (state) => state.caches
    },
    mutations: {
        addDbs (state, data) {
            const caches = state.caches;
            const connId = data.conn.id;

            for (let i = 0; i < data.payload.length; i++) {
                const db = data.payload[i];
                caches[connId][db] = {};
            }

            state.caches = Object.assign({}, caches);
        },

        addDocs (state, data) {
            const caches = state.caches;
            const connId = data.conn.id;

            caches[connId] = Object.assign(caches[connId] || {}, data.payload);
            state.caches = Object.assign({}, caches);
        },

        removeDb (state, data) {
            delete state.caches[data.conn.id][data.db];
            state.caches[data.conn.id] = Object.assign({}, state.caches[data.conn.id]);
        },

        removeConn (state, data) {
            delete state.caches[data.conn.id];
            state.caches = Object.assign({}, state.caches);
        }
    },
    actions: {
        // triggers a cache build for each connection in the array of conn workers
        buildCache (context, data) {
            const caches = context.state.caches;

            Object.values(workers).forEach((worker) => {
                const connId = worker.conn.id;
                if (!caches[connId]) {
                    caches[connId] = {};
                }

                worker.connWorker.postMessage({
                    conn: worker.conn,
                    cache: caches[connId]
                });
            });
        },

        // create worker for new connection and trigger a cache build
        createConn (context, data) {
            const conn = data.conn;
            const connWorker = new ConnWorker();

            connWorker.onmessage = function (e) {
                context.dispatch(e.data.type, e.data);
            };

            workers[conn.id] = { conn, connWorker };

            // build cache for new connection
            context.dispatch('buildCache');
        },

        removeConn (context, data) {
            context.commit('removeConn', data);
            db.save(context.state);

            delete workers[data.conn.id];
        },

        // adds a collection of dbs to a connection's cache
        addDbs (context, data) {
            context.commit('addDbs', data);
            db.save(context.state);
        },

        // adds a collection of dbs to a connection's cache
        addDocs (context, data) {
            context.commit('addDocs', data);
            db.save(context.state);
        },

        removeDb (context, data) {
            context.commit('removeDb', data);
            db.save(context.state);
        },

        clear (context) {
            context.state.caches = {};

            db.clear();
            db.save(context.state);
        },

        init (context, { conns }) {
            // load connections from db into memory
            db.load().then((data) => {
                if (data) {
                    context.state.caches = data.caches;
                }

                // create associative array of workers for each connection
                for (let i = 0; i < conns.length; i++) {
                    const conn = conns[i];
                    const connWorker = new ConnWorker();

                    connWorker.onmessage = function (e) {
                        context.dispatch(e.data.type, e.data);
                    };

                    workers[conn.id] = { conn, connWorker };
                }

                context.state.isReady = true;

                context.dispatch('buildCache');
            });
        }
    }
};
