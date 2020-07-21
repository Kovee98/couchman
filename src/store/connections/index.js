import db from '../../js/db';

export default {
    namespaced: true,
    state: {
        id: 0,
        curr: null,
        conns: []
    },
    getters: {
        conns: (state) => state.conns,
        curr: (state) => state.curr
    },
    mutations: {
        add (state, conn) {
            conn.id = state.id;
            state.conns.push(conn);
            state.id++;
        },
        remove (state, i) {
            state.conns.splice(i, 1);
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
        remove (context, i) {
            context.commit('remove', i);
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
                    context.state.id = data.id;
                }
            });
        }
    }
};
