import dbs from '../../js/db';

const db = dbs.views;

export default {
    namespaced: true,
    state: {
        curr: -1,
        views: []
    },
    getters: {
        views: (state) => state.views,
        curr: (state) => state.curr
    },
    mutations: {
        add (state, view) {
            state.views.push(view);
        },
        remove (state, i) {
            state.views.splice(i, 1);

            // adjust curr pointer
            if (state.curr > 0 && i <= state.curr) state.curr--;
        },
        update (state, { i, view }) {
            state.views.splice(i, 1, view);
        },
        activate (state, i) {
            state.curr = i;
        }
    },
    actions: {
        add (context, { view }) {
            context.commit('add', view);
            db.save(context.state);
        },
        remove (context, data) {
            context.commit('remove', data);
            db.save(context.state);
        },
        update (context, data) {
            context.commit('update', data);
            db.save(context.state);
        },
        activate (context, data) {
            context.commit('activate', data);
            db.save(context.state);
        },
        save (context) {
            db.save(context.state);
        },
        clear (context) {
            context.state.curr = -1;
            context.state.views = [];

            db.clear();
            db.save(context.state);
        },
        init (context) {
            // load views from db into memory
            db.load().then((data) => {
                if (data) {
                    context.state.views = data.views;
                    context.state.curr = data.curr;
                }
            });
        }
    }
};
