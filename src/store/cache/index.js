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
        setDbs (state, data) {
            const caches = state.caches;
            const connId = data.conn.id;

            for (let i = 0; i < data.payload.length; i++) {
                const db = data.payload[i];
                const dbName = db.db_name;

                caches[connId][dbName] = Object.assign(caches[connId][dbName] || {}, db);
            }

            state.caches = Object.assign({}, caches);
        },
        setDb (state, data) {
            const caches = state.caches;
            const connId = data.conn.id;
            const db = data.payload;
            const dbName = db.db_name;

            caches[connId][dbName] = Object.assign(caches[connId][dbName] || {}, db);
            state.caches = Object.assign({}, caches);
        },
        setDocs (state, data) {
            const caches = state.caches;
            const connId = data.conn.id;

            for (let i = 0; i < data.payload.length; i++) {
                const docs = data.payload[i];
                const dbName = docs.db;

                caches[connId][dbName] = Object.assign(caches[connId][dbName], { docs });
            }

            state.caches = Object.assign({}, caches);
        },
        setDoc (state, data) {
            const caches = state.caches;
            const connId = data.conn.id;
            const docs = data.payload;
            const dbName = docs.db;

            caches[connId][dbName] = Object.assign(caches[connId][dbName] || {}, { docs });
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
        },
        buildDbs (context, data) {
            workers[data.conn.id].dbWorker.postMessage(data);
        },
        buildDocs (context, data) {
            workers[data.conn.id].docWorker.postMessage(data);
        },
        setDbs (context, data) {
            context.commit('setDbs', data);
            save(context.state);
        },
        setDb (context, data) {
            context.commit('setDb', data);
            save(context.state);
        },
        setDocs (context, data) {
            context.commit('setDocs', data);
            save(context.state);
        },
        setDoc (context, data) {
            context.commit('setDoc', data);
            save(context.state);
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
