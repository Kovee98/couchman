<template>
    <div id="app">
        <Alert/>
        <Confirmation/>
        <Navbar :curr="curr" :conns="conns" />
        <b-container>
            <Breadcrumb />

            <router-view :curr="curr" :conns="conns" />
        </b-container>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue';
import Confirmation from '@/components/Confirmation.vue';
import Alert from '@/components/Alert.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Confirmation,
        Alert,
        Breadcrumb
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
