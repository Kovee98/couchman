import Vue from 'vue';
import VueRouter from 'vue-router';
import Databases from '../views/Databases.vue';
import Documents from '../views/Documents.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/dbs'
    },
    {
        path: '/dbs',
        name: 'Databases',
        component: Databases
    },
    {
        path: '/dbs/:db',
        name: 'Documents',
        component: Documents
    }
];

const router = new VueRouter({
    routes
});

export default router;
