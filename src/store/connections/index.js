import db from '../../js/db';
import { getField, updateField } from 'vuex-map-fields';

export default {
    namespaced: true,
    state: {
        curr: null,
        conns: []
    },
    getters: {
        getField
    },
    mutations: {
        updateField,
        add (state, conn) {
            state.conns.push(conn);
        },
        activate (state, conn) {
            // deactivate current
            state.curr.active = false;

            // activate new
            conn.active = true;
            state.curr = conn;
        }
    },
    actions: {
        add (context, conn) {
            // auto activate if it's the first/only connection
            if (!context.state.curr) {
                conn.active = true;
                context.state.curr = conn;
            }
            context.commit('add', conn);
            db.connections.save(context.state);
        },
        activate (context, conn) {
            context.commit('activate', conn);
            db.connections.save(context.state);
        },
        save (context) {
            db.connections.save(context.state);
        },
        init (context) {
            // load connections from db into memory
            db.connections.load().then((data) => {
                if (data) {
                    context.state.conns = data.conns;
                    context.state.curr = data.curr;
                }
            });
        }
    },
    modules: {
    }
};
