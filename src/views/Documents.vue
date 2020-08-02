<template>
    <div class="mt-4">
        <div class="pt-3">
            <b-dropdown id="view-dropdown" variant="primary">
                <template v-slot:button-content>
                    <b-icon-eye font-scale="0.99" class="mr-1" />
                    {{viewName}}
                </template>
                <b-dropdown-item :active="currView === -1" @click="activate(-1)">
                    None
                </b-dropdown-item>
                <b-dropdown-item
                    v-for="(view, i) in views"
                    :key="view.id"
                    :value="view"
                    :active="currView === i"
                    @click="activate(i)"
                >
                    {{view.name}}
                    <span class="float-right">
                        <div class="remove" @click.stop="removeView(i)">
                            <b-icon-trash font-scale="0.99" />
                        </div>
                    </span>
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item v-b-modal.views>
                    Create View
                    <b-icon-plus-circle font-scale="0.95" class="ml-2" />
                </b-dropdown-item>
            </b-dropdown>
            <b-button
                variant="primary"
                v-b-toggle.filter-collapse
                class="ml-2"
            >
                Filter
                <b-icon-funnel font-scale="0.95" class="ml-1" />
            </b-button>
        </div>
        <b-collapse id="filter-collapse">
            <b-card>
                <b-form-input
                    v-model="filter"
                    type="search"
                    placeholder="Filter docs..."
                />
            </b-card>
        </b-collapse>

        <b-table
            :items="docs"
            :fields="filteredFields"
            :filter="filter"
            :per-page="perPage"
            :current-page="currPage"
            tbody-tr-class="tr"
            head-variant="dark"
            table-variant="light"
            :busy="loading"
            @row-clicked="edit"
            @filtered="updateNumPages"
            class="mt-3"
            outlined
            striped
            fixed
        >
            <template v-slot:cell(actions)="row">
                <span class="float-right">
                    <div @click.stop="remove(row)" class="remove pl-2">
                        <b-icon-trash font-scale="1.125" />
                    </div>
                </span>
            </template>
        </b-table>

        <Pagination :currPage="currPage" :numPages="numPages" />

        <Views />
    </div>
</template>

<script>
import Views from '@/components/Views';
import Pagination from '@/components/Pagination';

export default {
    name: 'Databases',
    components: {
        Views,
        Pagination
    },
    props: ['curr', 'conns'],
    data () {
        return {
            filter: '',
            perPage: 5,
            currPage: 1,
            numPages: 0,
            docs: [],
            fields: [],
            filteredFields: [],
            cols: [],
            loading: false
        };
    },
    computed: {
        views () {
            return this.$store.getters['views/views'];
        },
        currView () {
            return this.$store.getters['views/curr'];
        },
        viewName () {
            if (this.views && this.currView >= 0) {
                let view = this.views[this.currView];
                return view ? view.name : 'None';
            }

            return 'None';
        }
    },
    watch: {
        curr: function () {
            this.load();
        },
        conns: function () {
            this.load();
        },
        currView: function () {
            this.filterFields();
        }
    },
    methods: {
        updateNumPages (items = [], count = 0) {
            let rem = count % this.perPage;
            let numPages = Math.floor(count / this.perPage);
            this.numPages = rem > 0 ? numPages + 1 : numPages;

            if (this.currPage > this.numPages) {
                this.currPage = this.numPages;
            } else if (this.currPage === 0) {
                this.currPage = 1;
            }
        },
        filterFields () {
            if (this.currView >= 0 && this.views.length > 0) {
                let cols = this.views[this.currView].cols;
                var filteredFields = this.fields.filter(field => cols.includes(field.key));
            } else {
                filteredFields = this.fields;
            }

            if (filteredFields.length > 0) {
                filteredFields.push({
                    key: 'actions',
                    label: '',
                    class: 'actions'
                });
            }

            this.filteredFields = filteredFields;
        },
        activate (i, view) {
            this.$store.dispatch('views/activate', i);
        },
        edit (doc) {
            this.$router.push(`${this.$route.fullPath}/${doc._id}`);
        },
        remove (row) {
            let currConn = this.conns[this.curr];
            if (currConn && currConn.url) {
                this.$events.$emit('confirm', {
                    title: 'Delete Document?',
                    body: `Deleting "${row.item._id}" will be permanent and cannot be undone.`,
                    confirm: {
                        text: 'Yes, delete document',
                        variant: 'danger',
                        action: () => {
                            let url = `${currConn.baseUrl}/${this.$route.params.db}/${row.item._id}`;
                            this.$http.delete(url, currConn.user, currConn.pass).catch((err) => {
                                this.$events.$emit('alert-open', {
                                    variant: 'danger',
                                    msg: `${err.message} (${(err.response || {}).statusText || ''})`
                                });
                                console.log('err:', err);
                            }).finally(() => {
                                this.load();
                            });
                        }
                    },
                    cancel: {
                        text: 'No, keep document',
                        variant: 'outline-secondary'
                    }
                });
            }
        },
        removeView (i) {
            this.$store.dispatch('views/remove', i);
        },
        load () {
            this.loading = true;
            let currConn = this.conns[this.curr];

            if (currConn && currConn.url && this.$route.params.db) {
                let url = `${currConn.baseUrl}/${this.$route.params.db}/_all_docs?include_docs=true`;

                this.$http.get(url, currConn.user, currConn.pass).then((data) => {
                    this.docs = data.rows.map(row => row.doc);

                    // update pagination
                    this.updateNumPages(null, this.docs.length);

                    let fields = Object.keys(this.docs[0]);
                    fields = fields.map((field) => {
                        return {
                            key: field,
                            sortable: true,
                            class: 'truncate td'
                        };
                    });

                    this.fields = fields;
                    this.filterFields();
                }).catch((err) => {
                    this.$events.$emit('alert-open', {
                        variant: 'danger',
                        msg: `${err.message} (${(err.response || {}).statusText || ''})`
                    });

                    console.log(err);
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    },
    mounted () {
        this.load();

        this.$events.$on('refresh', (e) => {
            this.load();
        });

        this.$events.$on('set-curr-page', (currPage) => {
            this.currPage = currPage;
        });
    }
};
</script>
