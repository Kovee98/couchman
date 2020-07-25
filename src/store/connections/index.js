// import Vue from 'vue';
import db from '../../js/db';

const save = db.connections.save;

export default {
    namespaced: true,
    state: {
        curr: 0,
        conns: []
    },
    getters: {
        conns: (state) => state.conns,
        curr: (state) => state.curr
    },
    mutations: {
        add (state, conn) {
            state.conns.push(conn);
        },
        remove (state, i) {
            state.conns.splice(i, 1);

            // adjust curr pointer
            if (state.curr > 0 && i <= state.curr) state.curr--;
        },
        update (state, { i, conn }) {
            state.conns.splice(i, 1, conn);
        },
        activate (state, i) {
            state.curr = i;
        }
    },
    actions: {
        add (context, { conn }) {
            context.commit('add', conn);
            save(context.state);
        },
        remove (context, data) {
            context.commit('remove', data);
            save(context.state);
        },
        update (context, data) {
            context.commit('update', data);
            save(context.state);
        },
        activate (context, data) {
            context.commit('activate', data);
            save(context.state);
        },
        save (context) {
            save(context.state);
        },
        init (context) {
            // load connections from db into memory
            db.connections.load().then((data) => {
                if (data) {
                    context.state.conns = data.conns;
                    context.state.curr = data.curr;
                    context.state.id = data.id;
                }
            });
        }
    }
};
