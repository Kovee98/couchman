import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import events from './js/events';

// bootstrap dependencies
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// codemirror dependencies
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/selection/active-line.js';
Vue.use(VueCodemirror);

// globals
import http from './js/http.js';
Vue.use({
    install (Vue) {
        Vue.prototype.$http = http;
        Vue.prototype.$events = events;
    }
});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
