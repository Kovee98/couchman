<template>
    <div class="mt-4">
        <div class="pt-3">
            <b-button
                variant="primary"
                v-b-toggle.docs-filter-collapse
            >
                Filter
                <b-icon-funnel
                    font-scale="0.95"
                    class="ml-1"
                />
            </b-button>

            <b-dropdown
                id="view-dropdown"
                variant="primary"
                class="ml-2"
            >
                <template v-slot:button-content>
                    <b-icon-eye
                        font-scale="0.99"
                        class="mr-1"
                    />
                    {{viewName}}
                </template>
                <b-dropdown-item
                    :active="currView === -1"
                    @click="activate(-1)"
                >
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
                        <div
                            class="remove"
                            @click.stop="removeView(i)"
                        >
                            <b-icon-trash font-scale="0.99"/>
                        </div>
                    </span>
                </b-dropdown-item>

                <b-dropdown-divider/>

                <b-dropdown-item v-b-modal.view-modal>
                    Create View
                    <b-icon-plus-circle
                        font-scale="0.95"
                        class="ml-2"
                    />
                </b-dropdown-item>
            </b-dropdown>
        </div>

        <b-collapse id="docs-filter-collapse">
            <b-card>
                <b-form-input
                    v-model="filter"
                    type="search"
                    placeholder="Filter docs..."
                />
            </b-card>
        </b-collapse>

        <div
            class="mb-3"
            style="height: 550px"
        >
            <b-table
                :items="docs"
                :fields="filteredFields"
                :filter="filter"
                :per-page="perPage"
                :current-page="currPage"
                tbody-tr-class="tr"
                head-variant="dark"
                table-variant="light"
                :busy="isBusy"
                @row-clicked="edit"
                class="mt-3"
                outlined
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
                            @click.stop="remove(row)"
                            class="remove pl-2"
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

        <ViewModal :fields="fields"/>
    </div>
</template>

<script>
import ViewModal from '@/components/ViewModal';

export default {
    name: 'DocumentTable',
    components: {
        ViewModal
    },
    props: {
        currConn: {
            type: Object,
            required: false
        }
    },
    data () {
        return {
            filter: '',
            perPage: 10,
            currPage: 1,
            docs: [],
            fields: [],
            filteredFields: [],
            cols: [],
            isBusy: false
        };
    },
    computed: {
        totalRows () {
            return this.docs.length;
        },

        views () {
            return this.$store.getters['views/views'];
        },

        currView () {
            return this.$store.getters['views/curr'];
        },

        viewName () {
            if (this.views && this.currView >= 0) {
                const view = this.views[this.currView];
                return view ? view.name : 'None';
            }

            return 'None';
        }
    },
    watch: {
        currView () {
            this.filterFields();
        },

        currConn: function () {
            this.load();
        }
    },
    mounted () {
        this.load();
    },
    methods: {
        filterFields () {
            let filteredFields = [];
            if (this.currView >= 0 && this.views.length > 0) {
                const cols = this.views[this.currView].cols;
                filteredFields = this.fields.filter(field => cols.includes(field.key));
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

        removeView (i) {
            this.$store.dispatch('views/remove', i);
        },

        activate (i, view) {
            this.$store.dispatch('views/activate', i);
        },

        edit (doc) {
            this.$router.push(`${this.$route.fullPath}/${doc._id}`);
        },

        remove (row) {
            if (this.currConn && this.currConn.url) {
                this.$events.$emit('confirm', {
                    title: 'Delete Document?',
                    body: `Deleting "${row.item._id}" will be permanent and cannot be undone.`,
                    confirm: {
                        text: 'Yes, delete document',
                        variant: 'danger',
                        action: () => {
                            const url = `${this.currConn.baseUrl}/${this.$route.params.db}/${row.item._id}`;
                            this.$http.delete(url, this.currConn.user, this.currConn.pass).catch((err) => {
                                this.$events.$emit('alert-open', {
                                    variant: 'danger',
                                    msg: `${err.message} (${(err.response || {}).statusText || ''})`
                                });
                                this.$log.error('err:', err);
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

        load () {
            this.isBusy = true;

            if (this.currConn && this.currConn.url && this.$route.params.db) {
                const url = `${this.currConn.baseUrl}/${this.$route.params.db}/_all_docs?include_docs=true`;

                this.$http.get(url, this.currConn.user, this.currConn.pass).then(({ rows = [] }) => {
                    this.docs = rows.map(row => row.doc) || [];

                    if (this.docs.length > 0) {
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
                    }
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
