<template>
    <div>
        <div>
            <b-nav-item v-b-toggle.conns>Connections</b-nav-item>

            <b-sidebar
                id="conns"
                title="Connections"
                backdrop
                shadow
            >
                <div class="px-3 py-2">
                    <b-list-group>
                        <b-list-group-item
                            href="#"
                            v-for="conn in conns"
                            :key="conn.id"
                            :active="conn.active"
                            @click="activate(conn.name)"
                        >
                            {{conn.name}}
                            <span class="float-right">
                                <b-icon-pencil class="mx-1" font-scale="1.125"/>
                                <b-icon-trash class="ml-1" font-scale="1.125"/>
                            </span>
                        </b-list-group-item>
                    </b-list-group>
                </div>
                <template v-slot:footer>
                    <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
                        <Connect/>
                    </div>
                </template>
            </b-sidebar>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Connect from '@/components/Connect.vue';
import { mapFields } from 'vuex-map-fields';

export default {
    name: 'Connections',
    components: {
        Connect
    },
    methods: {
        activate (name) {
            this.$store.dispatch('connections/activate', name);
        }
    },
    computed: {
        ...mapFields('connections', [
            'conns'
        ])
    }
};
</script>
