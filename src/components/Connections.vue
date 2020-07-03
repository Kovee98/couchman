<template>
    <div>
        <Connection/>
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
                            v-for="(conn, i) in conns"
                            :key="conn.id"
                            :variant="conn.active ? 'secondary' : ''"
                            @click="activate(conn)"
                        >
                            {{conn.name}}
                            <span class="float-right">
                                <div class="edit pl-2" @click="edit(conn)"><b-icon-pencil font-scale="1.125"/></div>
                                <div class="remove pl-2" @click="remove(conn, i)"><b-icon-trash font-scale="1.125"/></div>
                            </span>
                        </b-list-group-item>
                    </b-list-group>
                </div>
                <template v-slot:footer>
                    <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
                        <b-button @click.prevent="add" variant="success" size="sm" class="float-left">
                            <b-icon-plus/>
                            Add Connection
                        </b-button>
                    </div>
                </template>
            </b-sidebar>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Connection from '@/components/Connection.vue';
import { mapFields } from 'vuex-map-fields';

export default {
    name: 'Connections',
    components: {
        Connection
    },
    computed: {
        ...mapFields('connections', [
            'conns'
        ])
    },
    methods: {
        add () {
            this.$events.$emit('connection-add');
        },
        activate (conn) {
            this.$store.dispatch('connections/activate', conn);
            this.$events.$emit('refresh');
        },
        edit (conn) {
            this.$events.$emit('connection-edit', conn);
        },
        remove (conn, i) {
            this.$events.$emit('confirm', {
                title: 'Delete Connection',
                body: `Are you sure you want to delete the ${conn.name} connection? This can't be undone.`,
                confirm: {
                    text: 'Delete',
                    action: () => {
                        this.$store.dispatch('connections/remove', i);
                    }
                }
            });
        }
    }
};
</script>
