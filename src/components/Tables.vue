<template>
    <div>
        <p class="h2 py-2">Tables</p>
        <b-table striped hover :items="items"></b-table>
    </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields';

export default {
    data: function () {
        return {
            items: []
        };
    },
    computed: {
        ...mapFields('connections', [
            'curr'
        ])
    },
    async created () {
        if (this.curr && this.curr.url) {
            let tables = await this.$axios.get(`${this.curr.url}/_all_dbs`).then((tables) => {
                let queued = [];
                tables.data.forEach((table) => {
                    queued.push(this.$axios.get(`${this.curr.url}/${table}`).then(table => table.data));
                });
                return Promise.all(queued);
            });

            this.items = tables.map((table) => {
                return {
                    name: table.db_name,
                    doc_count: table.doc_count,
                    adapter: table.adapter,
                    size: table.disk_size
                };
            });
        }
    }
};
</script>
