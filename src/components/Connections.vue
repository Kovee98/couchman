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
                width="400px"
            >
                <div class="px-3 py-2">
                    <b-list-group>
                        <b-list-group-item
                            href="#"
                            v-for="(conn, i) in conns"
                            :key="conn.id"
                            :variant="i === curr ? 'secondary' : ''"
                            @click="activate(i)"
                        >
                            <div class="row">
                                <span class="text-truncate col-4">{{conn.name}}</span>
                                <span class="text-muted text-truncate col-5 px-0">{{conn.url}}</span>
                                <span class="col-2 px-0 ml-3">
                                    <div class="update pl-2" @click.stop="update(i, conn)"><b-icon-pencil font-scale="1.125"/></div>
                                    <div class="remove pl-2" @click.stop="remove(i, conn)"><b-icon-trash font-scale="1.125"/></div>
                                </span>
                            </div>
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

export default {
    props: ['curr', 'conns'],
    name: 'Connections',
    components: {
        Connection
    },
    methods: {
        add () {
            this.$events.$emit('connection-add');
        },
        activate (i) {
            this.$store.dispatch('connections/activate', i);
            this.$events.$emit('refresh');
        },
        update (i, conn) {
            this.$events.$emit('connection-update', i, conn);
        },
        remove (i, conn) {
            this.$events.$emit('confirm', {
                title: 'Delete Connection?',
                body: `Deleting "${conn.name}" will be permanent and cannot be undone.`,
                confirm: {
                    text: 'Yes, delete connection',
                    variant: 'danger',
                    action: () => {
                        this.$store.dispatch('connections/remove', i);
                    }
                },
                cancel: {
                    text: 'No, keep connection',
                    variant: 'outline-secondary'
                }
            });
        }
    }
};
</script>
