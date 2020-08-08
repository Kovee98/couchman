<template>
    <div>
        <b-form-input
            v-model="filter"
            type="search"
            placeholder="Filter dbs..."
            class="my-3"
        />
        <div
            class="mb-3"
            style="height: 550px"
        >
            <b-table
                :items="dbs"
                :fields="fields"
                :filter="filter"
                :per-page="perPage"
                :current-page="currPage"
                tbody-tr-class="tr"
                head-variant="dark"
                table-variant="light"
                :busy="isBusy"
                @row-clicked="open"
                outlined
                striped
                fixed
            >
                <template v-slot:cell(actions)="row">
                    <span class="float-right">
                        <div
                            class="remove pl-2"
                            @click.stop="remove(row)"
                        >
                            <b-icon-trash font-scale="1.125"/>
                        </div>
                    </span>
                </template>
            </b-table>
        </div>

        <b-pagination
            v-model="currPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="center"
        />

    </div>
</template>

<script>
import format from '../js/format';

export default {
    name: 'DatabaseTable',
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
    data () {
        return {
            filter: '',
            dbs: [],
            perPage: 10,
            currPage: 1,
            fields: [
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true,
                    class: 'truncate td'
                },
                {
                    key: 'doc_count',
                    label: 'Count',
                    sortable: true,
                    class: 'truncate td'
                },
                {
                    key: 'adapter',
                    label: 'Adapter',
                    sortable: true,
                    class: 'truncate td'
                },
                {
                    key: 'size',
                    label: 'Size',
                    formatter: format.bytes,
                    sortable: true,
                    class: 'truncate td'
                },
                {
                    key: 'actions',
                    label: '',
                    class: 'actions'
                }
            ],
            isBusy: false
        };
    },
    computed: {
        totalRows () {
            return this.dbs.length;
        }
    },
    watch: {
        curr: function () {
            this.load();
        },

        conns: function () {
            this.load();
        }
    },
    mounted () {
        this.load();

        this.$events.$on('refresh', (e) => {
            this.load();
        });
    },
    methods: {
        open (db) {
            this.$router.push(`/dbs/${db.name}`);
        },

        remove (row) {
            let currConn = this.conns[this.curr];
            this.$events.$emit('confirm', {
                title: 'Delete Database?',
                body: `Deleting "${row.item.name}" will be permanent and cannot be undone.`,
                confirm: {
                    text: 'Yes, delete database',
                    variant: 'danger',
                    action: () => {
                        let url = `${currConn.baseUrl}/${row.item.name}`;
                        this.$http.delete(url, currConn.user, currConn.pass).catch((err) => {
                            this.$events.$emit('alert-open', {
                                variant: 'danger',
                                msg: `${err.message} (${(err.response || {}).statusText || ''})`
                            });
                            this.$log.error(err);
                        }).finally(() => {
                            this.load();
                        });
                    }
                },
                cancel: {
                    text: 'No, keep database',
                    variant: 'outline-secondary'
                }
            });
        },

        load () {
            this.isBusy = true;
            let currConn = this.conns[this.curr];

            if (currConn && currConn.url) {
                this.$http.get(`${currConn.baseUrl}/_all_dbs`, currConn.user, currConn.pass).then((dbs) => {
                    let queued = [];
                    dbs.forEach((db) => {
                        queued.push(this.$http.get(`${currConn.baseUrl}/${db}`, currConn.user, currConn.pass));
                    });

                    Promise.all(queued).then((dbs) => {
                        this.dbs = dbs.map((db) => {
                            return {
                                name: db.db_name,
                                // TODO: which size to use for couchdb servers?
                                size: db.disk_size || db.sizes.file,
                                doc_count: db.doc_count
                            };
                        });
                    }).catch((err) => {
                        this.$events.$emit('alert-open', {
                            variant: 'danger',
                            msg: `${err.message} (${(err.response || {}).statusText || ''})`
                        });

                        this.$log.error(err);
                    });
                }).catch((err) => {
                    this.$events.$emit('alert-open', {
                        variant: 'danger',
                        msg: `${err.message} (${(err.response || {}).statusText || ''})`
                    });

                    this.$log.error(err);
                }).finally(() => {
                    this.isBusy = false;
                });
            }
        }
    }
};
</script>
