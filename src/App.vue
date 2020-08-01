<template>
    <div id="app">
        <Alert/>
        <Confirmation/>
        <Navbar :curr="curr" :conns="conns" />
        <b-container>
            <b-breadcrumb class="px-0 my-4 h5">
                <b-breadcrumb-item href="/#/dbs">Databases</b-breadcrumb-item>
                <b-breadcrumb-item
                    v-if="$route.params.db"
                    :href="`/#/dbs/${$route.params.db}`"
                    :active="!!$route.params.db && !$route.params.doc"
                >
                    {{$route.params.db}}
                </b-breadcrumb-item>
                <b-breadcrumb-item
                    v-if="$route.params.doc"
                    :href="`/#/dbs/${$route.params.db}/${$route.params.doc}`"
                    :active="!!$route.params.doc"
                >
                    {{$route.params.doc}}
                </b-breadcrumb-item>
            </b-breadcrumb>
            <router-view :curr="curr" :conns="conns" />
        </b-container>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue';
import Confirmation from '@/components/Confirmation.vue';
import Alert from '@/components/Alert.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Confirmation,
        Alert
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
