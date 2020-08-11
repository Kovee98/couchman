import Vue from 'vue';
import VueRouter from 'vue-router';
import DatabaseTable from '../views/DatabaseTable.vue';
import DocumentTable from '../views/DocumentTable.vue';
import DocumentEditor from '../views/DocumentEditor.vue';
import SettingsPage from '../views/SettingsPage.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/dbs'
    },
    {
        path: '/dbs',
        name: 'DatabaseTable',
        component: DatabaseTable
    },
    {
        path: '/dbs/:db',
        name: 'DocumentTable',
        component: DocumentTable
    },
    {
        path: '/dbs/:db/:doc',
        name: 'DocumentEditor',
        component: DocumentEditor
    },
    {
        path: '/settings',
        name: 'SettingsPage',
        component: SettingsPage
    }
];

const router = new VueRouter({
    routes
});

export default router;
