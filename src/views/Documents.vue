<template>
    <div>
        <p class="h2 py-2 my-3 capitalize">{{db}} <b-icon-arrow-counterclockwise @click="refresh" class="clickable" font-scale="0.75"/></p>

        <b-table
            :items="docs"
            outlined
            striped
            responsive
            head-variant="dark"
            table-variant="light"
            :busy="loading"
        >
            <template v-slot:cell(actions)="row">
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
            db: this.$route.params.db,
            docs: [],
            fields: [
                {}
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
        remove (row) {
            this.$events.$emit('confirm', {
                title: 'Delete DB',
                body: `Are you sure you want to delete the ${row.item.name} database? This can't be undone.`,
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
    },
    created () {
        this.$events.$on('refresh', (e) => {
            this.refresh();
        });
    }
};
</script>

<style lang="scss">
    .clickable {
        cursor: pointer;
    }
</style>
