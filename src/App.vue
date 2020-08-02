<template>
    <div id="app">
        <TitleBar
            :curr="curr"
            :conns="conns"
        />

        <AlertMessage/>

        <ConfirmationModal/>

        <ConnectionSidebar
            :curr="curr"
            :conns="conns"
        />

        <b-container>
            <BreadcrumbNavigation/>

            <router-view
                :curr="curr"
                :conns="conns"
            />
        </b-container>
    </div>
</template>

<script>
// @ is an alias to /src
import TitleBar from '@/components/TitleBar.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import AlertMessage from '@/components/AlertMessage.vue';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.vue';
import ConnectionSidebar from '@/components/ConnectionSidebar.vue';

export default {
    name: 'App',
    components: {
        TitleBar,
        ConfirmationModal,
        AlertMessage,
        BreadcrumbNavigation,
        ConnectionSidebar
    },
    computed: {
        curr () {
            return this.$store.getters['connections/curr'];
        },
        conns () {
            return this.$store.getters['connections/conns'];
        }
    },
    created () {
        this.$store.dispatch('connections/init');
        this.$store.dispatch('views/init');
    }
};
</script>

<style lang="scss">
    #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    }

    #nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
        color: #42b983;
        }
    }
    }

    .capitalize {
        text-transform: capitalize;
    }

    .clickable {
        cursor: pointer;
    }

    .update {
        cursor: pointer;
        display: inline;
        :hover {
            color: black;
        }
    }

    .remove {
        cursor: pointer;
        display: inline;
        :hover {
            color: red;
        }
    }

    .truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    td {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .actions {
        width: 100px;
    }

    .tr:hover > .td {
        cursor: pointer;
        color: #007bff !important;
    }

    .breadcrumb {
        background: transparent !important;
    }
</style>
