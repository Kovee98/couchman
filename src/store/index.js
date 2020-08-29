import Vue from 'vue';
import Vuex from 'vuex';
import connections from './connections';
import views from './views';
import cache from './cache';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        connections,
        views,
        cache
    }
});
