<template>
    <div class="mt-4">
        <div class="pt-3">
            <b-button
                variant="primary"
                v-b-toggle.dbs-filter-collapse
            >
                Filter
                <b-icon-funnel
                    font-scale="0.95"
                    class="ml-1"
                />
            </b-button>
        </div>

        <b-collapse id="dbs-filter-collapse">
            <b-card>
                <b-form-input
                    v-model="filter"
                    type="search"
                    placeholder="Filter dbs..."
                />
            </b-card>
        </b-collapse>

        <div class="mb-3 table-wrapper">
            <b-table
                :items="dbs"
                :fields="fields"
                :filter="filter"
                :per-page="perPage"
                :current-page="currPage"
                tbody-tr-class="tr"
                head-variant="dark"
                table-variant="light"
                empty-text="There are no databases"
                empty-filtered-text="There are no records that match the search"
                :busy="isBusy"
                @row-clicked="open"
                class="mt-3"
                outlined
                show-empty
                striped
                fixed
            >
                <template v-slot:head(actions)>
                    <b-icon-arrow-clockwise
                        @click="load"
                        font-scale="1.25"
                        class="clickable float-right"
                    />
                </template>

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
        currConn: {
            type: Object,
            required: false
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
        currConn: function () {
            this.load();
        }
    },
    mounted () {
        this.load();
    },
    methods: {
        open (db) {
            this.$router.push(`/dbs/${db.name}`);
        },

        remove (row) {
            this.$events.$emit('confirm', {
                title: 'Delete Database?',
                body: `Deleting "${row.item.name}" will be permanent and cannot be undone.`,
                confirm: {
                    text: 'Yes, delete database',
                    variant: 'danger',
                    action: () => {
                        const url = `${this.currConn.baseUrl}/${row.item.name}`;
                        this.$http.delete(url, this.currConn.user, this.currConn.pass).catch((err) => {
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

            if (this.currConn && this.currConn.url) {
                this.$http.get(`${this.currConn.baseUrl}/_all_dbs`, this.currConn.user, this.currConn.pass).then((dbs) => {
                    const queued = [];
                    dbs.forEach((db) => {
                        queued.push(this.$http.get(`${this.currConn.baseUrl}/${db}`, this.currConn.user, this.currConn.pass));
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
