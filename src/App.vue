<template>
    <div id="app">
        <Alert/>
        <Confirmation/>
        <Document :curr="curr" :conns="conns" />
        <Navbar :curr="curr" :conns="conns" />
        <b-container>
            <div class="pt-3">
                <span v-if="this.$route.params.db">
                    <span class="h4 py-2 my-3"><b-link href="/#/dbs">Databases</b-link></span>
                </span>
                <span v-if="!this.$route.params.db">
                    <span class="h4 py-2 my-3">Databases</span>
                </span>
                <span v-if="this.$route.params.db">
                    <b-icon-chevron-left class="mx-2" font-scale="1.125"/>
                    <span class="h4 py-2 my-3">{{this.$route.params.db}}</span>
                </span>
            </div>
            <router-view :curr="curr" :conns="conns" />
        </b-container>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue';
import Confirmation from '@/components/Confirmation.vue';
import Alert from '@/components/Alert.vue';
import Document from '@/components/Document.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Confirmation,
        Alert,
        Document
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

    .actions {
        width: 100px;
    }

    .tr:hover > .td {
        cursor: pointer;
        color: #007bff !important;
    }
</style>
