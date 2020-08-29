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
                state.caches[data.currConn.id][db.db_name] = {
                    ...state.caches[data.currConn.id][db.db_name],
                    ...db
                };
            }
        },
        setDocs (state, data) {
            for (let i = 0; i < data.payload.length; i++) {
                const docs = data.payload[i];
                state.caches[data.currConn.id][docs.db] = {
                    ...state.caches[data.currConn.id][docs.db],
                    docs: docs
                };
            }
        }
    },
    actions: {
        load (context, currConn) {
            if (currConn.baseUrl) {
                if (!context.state.caches[currConn.id]) {
                    context.state.caches[currConn.id] = {};
                }
                dbWorker.postMessage(currConn);
            }
        },
        loadDocs (context, data) {
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
