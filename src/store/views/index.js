// import Vue from 'vue';
import db from '../../js/db';

const save = db.views.save;

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
        clear (context) {
            context.state.curr = -1;
            context.state.views = [];
            db.views.clear();
        },
        init (context) {
            // load views from db into memory
            db.views.load().then((data) => {
                if (data) {
                    context.state.views = data.views;
                    context.state.curr = data.curr;
                }
            });
        }
    }
};
