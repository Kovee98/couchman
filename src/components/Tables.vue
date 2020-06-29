<template>
    <div>
        <p class="h2 py-2">Tables <b-icon-arrow-counterclockwise @click="refresh" class="clickable"/></p>
        <!-- <b-button @click="refresh" variant="outline-light"><b-icon-arrow-counterclockwise/></b-button> -->
        <b-table striped hover :items="tables"></b-table>
    </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
    data: function () {
        return {
            tables: []
        };
    },
    computed: {
        ...mapFields('connections', [
            'curr'
        ])
    },
    methods: {
        refresh () {
            if (this.curr && this.curr.url) {
                this.$axios.get(`${this.curr.url}/_all_dbs`).then((tables) => {
                    debugger;
                    let queued = [];
                    tables.data.forEach((table) => {
                        queued.push(this.$axios.get(`${this.curr.url}/${table}`).then(table => table.data));
                    });

                    Promise.all(queued).then((res) => {
                        debugger;
                        this.tables = tables.map((table) => {
                            return {
                                name: table.db_name,
                                doc_count: table.doc_count,
                                adapter: table.adapter,
                                size: table.disk_size
                            };
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    },
    mounted () {
        this.refresh();
    }
};
</script>

<style lang="scss">
    .clickable {
        cursor: pointer;
    }
</style>
