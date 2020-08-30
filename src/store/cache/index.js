import db from '../../js/db';
import DbWorker from '../../js/workers/db.worker.js';
import DocWorker from '../../js/workers/doc.worker.js';

const dbWorker = new DbWorker();
const docWorker = new DocWorker();
const save = db.cache.save;

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
            for (let i = 0; i < data.payload.length; i++) {
                const db = data.payload[i];
                state.caches[data.conn.id][db.db_name] = {
                    ...state.caches[data.conn.id][db.db_name],
                    ...db
                };
            }
        },
        setDocs (state, data) {
            for (let i = 0; i < data.payload.length; i++) {
                const docs = data.payload[i];
                state.caches[data.conn.id][docs.db] = {
                    ...state.caches[data.conn.id][docs.db],
                    docs: docs
                };
            }
        },
        removeDb (state, data) {
            delete state.caches[data.conn.id][data.db];
            state.caches[data.conn.id] = Object.assign({}, state.caches[data.conn.id]);
        }
    },
    actions: {
        buildDbs (context, data) {
            dbWorker.postMessage(data);
        },
        buildDocs (context, data) {
            docWorker.postMessage(data);
        },
        setDbs (context, data) {
            context.commit('setDbs', data);
            save(context.state);
        },
        setDocs (context, data) {
            context.commit('setDocs', data);
            save(context.state);
        },
        removeDb (context, data) {
            context.commit('removeDb', data);
            save(context.state);
        },
        init (context) {
            // load connections from db into memory
            db.cache.load().then((data) => {
                if (data) {
                    context.state.caches = data.caches || {};
                    context.state.isReady = true;
                }
            });

            dbWorker.onmessage = function (e) {
                context.dispatch(e.data.type, e.data);
            };

            docWorker.onmessage = function (e) {
                context.dispatch(e.data.type, e.data);
            };
        }
    }
};
