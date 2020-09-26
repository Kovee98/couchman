<template>
    <div id="app">
        <TitleBar/>

        <AlertMessage/>

        <ConfirmationModal/>

        <ConnectionSidebar
            :curr="curr"
            :conns="conns"
        />

        <b-container>
            <BreadcrumbNavigation/>

            <router-view :currConn="currConn"/>
        </b-container>
    </div>
</template>

<script>
// @ is an alias to /src
import TitleBar from '@/components/TitleBar.vue';
import AlertMessage from '@/components/AlertMessage.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import ConnectionSidebar from '@/components/ConnectionSidebar.vue';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.vue';

export default {
    name: 'App',
    components: {
        TitleBar,
        AlertMessage,
        ConfirmationModal,
        ConnectionSidebar,
        BreadcrumbNavigation
    },
    computed: {
        curr () {
            return this.$store.getters['connections/curr'];
        },

        conns () {
            return this.$store.getters['connections/conns'];
        },

        currConn () {
            return this.$store.getters['connections/currConn'];
        }
    },
    created () {
        const conns = this.$store.getters['connections/conns'];

        this.$store.dispatch('connections/init');
        this.$store.dispatch('views/init');
        this.$store.dispatch('cache/init', { conns });
    }
};
</script>
