import Vue from 'vue';
import Vuex from 'vuex';
import connections from './connections';
import views from './views';

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
        views
    }
});
