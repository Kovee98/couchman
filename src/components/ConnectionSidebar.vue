<template>
    <div>
        <ConnectionModal/>

        <div>
            <b-sidebar
                id="conns-sidebar"
                title="Connections"
                width="25rem"
                backdrop
                shadow
            >
                <div class="px-3 py-2">
                    <b-list-group>
                        <b-list-group-item
                            v-for="(conn, i) in conns"
                            :key="conn.id"
                            :variant="i === curr ? 'secondary' : ''"
                            href="#"
                            @click="activate(i)"
                        >
                            <div class="row">
                                <span class="text-truncate col-4">
                                    {{conn.name}}
                                </span>
                                <span class="text-muted text-truncate col-5 px-0">
                                    {{conn.baseUrl}}
                                </span>
                                <span class="col-2 px-0 ml-3">
                                    <div
                                        @click.stop="update(i, conn)"
                                        class="update pl-2"
                                    >
                                        <b-icon-pencil font-scale="1.125"/>
                                    </div>
                                    <div
                                        @click.stop="remove(i, conn)"
                                        class="remove pl-2"
                                    >
                                        <b-icon-trash font-scale="1.125"/>
                                    </div>
                                </span>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                </div>

                <template v-slot:footer>
                    <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
                        <b-button
                            variant="success"
                            size="sm"
                            @click.prevent="add"
                            class="float-left"
                        >
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
import ConnectionModal from '@/components/ConnectionModal.vue';

export default {
    name: 'ConnectionSidebar',
    components: {
        ConnectionModal
    },
    props: {
        curr: {
            type: Number,
            required: true
        },

        conns: {
            type: Array,
            required: true
        }
    },
    methods: {
        add () {
            this.$events.$emit('connection-add');
        },

        activate (i) {
            if (i !== this.curr) {
                this.$store.dispatch('connections/activate', i);
            }
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
