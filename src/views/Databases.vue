<template>
    <div>
        <b-form-input v-model="filter" type="search" placeholder="Filter dbs..." class="my-3"></b-form-input>
        <b-table
            :items="dbs"
            :fields="fields"
            :filter="filter"
            outlined
            striped
            fixed
            tbody-tr-class="tr"
            head-variant="dark"
            table-variant="light"
            :busy="loading"
            @row-clicked="open"
        >
            <template v-slot:cell(actions)="row">
                <span class="float-right">
                    <div class="remove pl-2" @click.stop="remove(row)"><b-icon-trash font-scale="1.125"/></div>
                </span>
            </template>
        </b-table>
    </div>
</template>

<script>
import format from '../js/format';

export default {
    props: ['curr', 'conns'],
    name: 'Databases',
    data: function () {
        return {
            filter: '',
            dbs: [],
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
            loading: false
        };
    },
    watch: {
        curr: function () {
            this.refresh();
        },
        conns: function () {
            this.refresh();
        }
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
                        this.$axios.delete(`${currConn.url}/${row.item.name}`).catch((err) => {
                            console.log('err:', err);
                        }).finally(() => {
                            this.refresh();
                        });
                    }
                },
                cancel: {
                    text: 'No, keep database',
                    variant: 'outline-secondary'
                }
            });
        },
        refresh () {
            this.loading = true;
            let currConn = this.conns[this.curr];
            if (currConn && currConn.url) {
                this.$axios.get(`${currConn.url}/_all_dbs`).then(({ data }) => {
                    let queued = [];
                    data.forEach((db) => {
                        queued.push(this.$axios.get(`${currConn.url}/${db}`).then(db => db.data));
                    });

                    Promise.all(queued).then((dbs) => {
                        this.dbs = dbs.map((db) => {
                            return {
                                name: db.db_name,
                                doc_count: db.doc_count,
                                adapter: db.adapter,
                                size: db.disk_size
                            };
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    },
    mounted () {
        this.refresh();
        this.$events.$on('refresh', (e) => {
            this.refresh();
        });
    }
};
</script>
