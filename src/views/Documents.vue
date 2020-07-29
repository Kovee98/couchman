<template>
    <div class="mt-4">
        <b-button-group class="my-3">
            <b-dropdown
                id="view-dropdown"
                variant="primary"
            >
                <template v-slot:button-content>
                    <b-icon-eye />
                    {{buttonName}}
                </template>
                <b-dropdown-item
                    @click="activate(-1)"
                    :active="currView === -1"
                >
                    None
                </b-dropdown-item>
                <b-dropdown-item
                    v-for="(view, i) in views"
                    :key="view.id"
                    :value="view"
                    @click="activate(i)"
                    :active="currView === i"
                >
                    {{view.name}}
                    <span class="float-right">
                        <div class="remove" @click.stop="removeView(i)"><b-icon-trash font-scale="0.99"/></div>
                    </span>
                </b-dropdown-item>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-item v-b-modal.views>
                    Create View
                    <b-icon-plus-circle class="ml-2" font-scale="0.99"/>
                </b-dropdown-item>
            </b-dropdown>
            <b-button v-b-toggle.filter-collapse variant="primary">
                <b-icon-funnel />
                Filter
            </b-button>
        </b-button-group>
        <b-collapse id="filter-collapse" class="mb-3">
            <b-card>
                <b-form-input v-model="filter" type="search" placeholder="Filter docs..."></b-form-input>
            </b-card>
        </b-collapse>

        <b-table
            :items="docs"
            :fields="filteredFields"
            :filter="filter"
            outlined
            striped
            fixed
            tbody-tr-class="tr"
            head-variant="dark"
            table-variant="light"
            :busy="loading"
            @row-clicked="edit"
        >
            <template v-slot:cell(actions)="row">
                <span class="float-right">
                    <div class="remove pl-2" @click.stop="remove(row)"><b-icon-trash font-scale="1.125"/></div>
                </span>
            </template>
        </b-table>
        <Views/>
    </div>
</template>

<script>
import Views from '../components/Views';

export default {
    props: ['curr', 'conns'],
    name: 'Databases',
    components: {
        Views
    },
    data: function () {
        return {
            filter: '',
            docs: [],
            fields: [],
            filteredFields: [],
            cols: [],
            loading: false
        };
    },
    watch: {
        curr: function () {
            this.refresh();
        },
        conns: function () {
            this.refresh();
        },
        currView: function () {
            this.filterFields();
        }
    },
    computed: {
        views () {
            return this.$store.getters['views/views'];
        },
        currView () {
            return this.$store.getters['views/curr'];
        },
        buttonName () {
            if (this.views && this.currView >= 0) {
                let view = this.views[this.currView];
                return view ? view.name : 'None';
            }
            return 'None';
        }
    },
    methods: {
        filterFields () {
            if (this.currView >= 0 && this.views.length > 0) {
                let cols = this.views[this.currView].cols;
                this.filteredFields = this.fields.filter(field => cols.includes(field.key));
            } else {
                this.filteredFields = this.fields;
            }
        },
        activate (i, view) {
            this.$store.dispatch('views/activate', i);
        },
        edit (doc) {
            this.$router.push({ name: this.$route.name, query: { doc: doc._id } });
        },
        remove (row) {
            this.$events.$emit('confirm', {
                title: 'Delete Document?',
                body: `Deleting "${row.item._id}" will be permanent and cannot be undone.`,
                confirm: {
                    text: 'Yes, delete document',
                    variant: 'danger',
                    action: () => {
                        this.$axios.delete(`${this.curr.url}/${row.item._id}`).catch((err) => {
                            console.log('err:', err);
                        }).finally(() => {
                            this.refresh();
                        });
                    }
                },
                cancel: {
                    text: 'No, keep document',
                    variant: 'outline-secondary'
                }
            });
        },
        removeView (i) {
            this.$store.dispatch('views/remove', i);
        },
        refresh () {
            this.loading = true;
            let currConn = this.conns[this.curr];
            if (currConn && currConn.url) {
                this.$axios.get(`${currConn.url}/${this.$route.params.db}/_all_docs?include_docs=true`).then(({ data }) => {
                    this.docs = data.rows.map(row => row.doc);

                    let fields = Object.keys(this.docs[0]);
                    this.keys = fields;
                    fields = fields.map((field) => {
                        return {
                            key: field,
                            sortable: true,
                            class: 'truncate td'
                        };
                    });
                    fields.push({
                        key: 'actions',
                        label: '',
                        class: 'actions'
                    });
                    this.fields = fields;
                    this.filterFields();
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
