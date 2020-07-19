<template>
    <div>
        <p class="h2 py-2 my-3">Databases <b-icon-arrow-counterclockwise @click="refresh" class="clickable" font-scale="0.75"/></p>

        <b-table
            :items="dbs"
            :fields="fields"
            outlined
            striped
            head-variant="dark"
            table-variant="light"
            :busy="loading"
        >
            <template v-slot:cell(name)="data">
                <b-link :href="`/#/dbs/${data.value}`">{{data.value}}</b-link>
            </template>

            <template v-slot:cell(actions)="row">
                <span class="float-right">
                    <!-- <div class="edit pl-2" @click="edit(conn)"><b-icon-pencil font-scale="1.125"/></div> -->
                    <div class="remove pl-2" @click="remove(row.item.name)"><b-icon-trash font-scale="1.125"/></div>
                </span>
            </template>
        </b-table>
    </div>
</template>

<script>
import format from '../js/format';

export default {
    props: ['curr'],
    name: 'Databases',
    data: function () {
        return {
            dbs: [],
            fields: [
                { key: 'name', label: 'Name' },
                { key: 'doc_count', label: 'Count' },
                { key: 'adapter', label: 'Adapter' },
                { key: 'size', label: 'Size', formatter: format.size },
                { key: 'actions', label: '' }
            ],
            loading: false
        };
    },
    watch: {
        curr: function () {
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
            if (this.curr && this.curr.url) {
                this.$axios.get(`${this.curr.url}/_all_dbs`).then(({ data }) => {
                    let queued = [];
                    data.forEach((db) => {
                        queued.push(this.$axios.get(`${this.curr.url}/${db}`).then(db => db.data));
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
