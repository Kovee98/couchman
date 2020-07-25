<template>
    <div>
        <b-form-input v-model="filter" placeholder="Filter dbs..." class="my-3"></b-form-input>
        <b-table
            :items="dbs"
            :fields="fields"
            :filter="filter"
            outlined
            striped
            fixed
            head-variant="dark"
            table-variant="light"
            :busy="loading"
        >
            <template v-slot:cell(name)="data">
                <b-link :href="`/#/dbs/${data.value}`">{{data.value}}</b-link>
            </template>

            <template v-slot:cell(actions)="row">
                <span class="float-right">
                    <div class="remove pl-2" @click="remove(row.item.name)"><b-icon-trash font-scale="1.125"/></div>
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
                    class: 'truncate'
                },
                {
                    key: 'doc_count',
                    label: 'Count',
                    sortable: true,
                    class: 'truncate'
                },
                {
                    key: 'adapter',
                    label: 'Adapter',
                    sortable: true,
                    class: 'truncate'
                },
                {
                    key: 'size',
                    label: 'Size',
                    formatter: format.size,
                    sortable: true,
                    class: 'truncate'
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
        remove (db) {
            this.$events.$emit('confirm', {
                title: 'Delete DB',
                body: `Are you sure you want to delete the ${db} database? This can't be undone.`,
                confirm: {
                    text: 'Delete',
                    action: () => {
                        this.$axios.delete(`${this.curr.url}/${db}`).catch((err) => {
                            console.log('err:', err);
                        }).finally(() => {
                            this.refresh();
                        });
                    }
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
