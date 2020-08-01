import Vue from 'vue';
import VueRouter from 'vue-router';
import Databases from '../views/Databases.vue';
import Documents from '../views/Documents.vue';
import Document from '../views/Document.vue';

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
    },
    {
        path: '/dbs/:db/:doc',
        name: 'Document',
        component: Document
    }
];

const router = new VueRouter({
    routes
});

export default router;
