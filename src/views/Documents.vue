<template>
    <div>
        <b-form-input v-model="filter" placeholder="Filter docs..." class="my-3"></b-form-input>
        <b-table
            :items="docs"
            :fields="fields"
            :filter="filter"
            outlined
            striped
            fixed
            responsive
            head-variant="dark"
            table-variant="light"
            :busy="loading"
        >
            <template v-slot:cell(actions)="row" style="width:">
                <span class="float-right">
                    <div class="edit pl-2" @click="edit(conn)"><b-icon-pencil font-scale="1.125"/></div>
                    <div class="remove pl-2" @click="remove(row)"><b-icon-trash font-scale="1.125"/></div>
                </span>
            </template>
        </b-table>
    </div>
</template>

<script>
export default {
    props: ['curr'],
    name: 'Databases',
    data: function () {
        return {
            filter: '',
            db: this.$route.params.db,
            docs: [],
            fields: [],
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
        remove (row) {
            this.$events.$emit('confirm', {
                title: 'Delete Document',
                body: 'Are you sure you want to delete this document? This can\'t be undone.',
                confirm: {
                    text: 'Delete',
                    action: () => {
                        this.$axios.delete(`${this.curr.url}/${row.item.name}`).catch((err) => {
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
                this.$axios.get(`${this.curr.url}/${this.db}/_all_docs?include_docs=true`).then(({ data }) => {
                    this.docs = data.rows.map(row => row.doc);

                    let fields = Object.keys(this.docs[0]);
                    fields = fields.map((field) => {
                        return {
                            key: field,
                            sortable: true,
                            class: 'truncate'
                        };
                    });
                    fields.push({
                        key: 'actions',
                        label: '',
                        class: 'actions'
                    });
                    this.fields = fields;
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
