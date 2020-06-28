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
        activate (state, name) {
            state.conns[state.curr.name].active = false;
            state.conns[name].active = true;
            state.curr = state.conns[name];
            state.conns = Object.values(state.conns);
        }
    },
    actions: {
        add (context, conn) {
            context.commit('add', conn);
        },
        activate (context, name) {
            context.commit('activate', name);
        },
        save (context) {
            db.connections.save(context.state);
        },
        init (context) {
            // load connections from db into memory
            db.connections.load().then((data) => {
                if (data) {
                    context.state = data;
                }
            });
        }
    },
    modules: {
    }
};
