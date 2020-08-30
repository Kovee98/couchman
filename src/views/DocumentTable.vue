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
                    :active="curr === -1"
                    @click="activate(-1)"
                >
                    None
                </b-dropdown-item>
                <b-dropdown-item
                    v-for="(view, i) in views"
                    :key="view.id"
                    :value="view"
                    :active="curr === i"
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

        <div class="mb-3 table-wrapper">
            <b-table
                :items="filteredDocs"
                :fields="filteredFields"
                :filter="filter"
                :per-page="perPage"
                :current-page="currPage"
                tbody-tr-class="tr"
                head-variant="dark"
                table-variant="light"
                :empty-text="emptyText"
                empty-filtered-text="There are no records that match the search"
                @row-clicked="edit"
                class="mt-3"
                outlined
                show-empty
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
            currPage: 1
        };
    },
    computed: {
        totalRows () {
            return this.docs.length;
        },

        views () {
            return this.$store.getters['views/views'];
        },

        curr () {
            return this.$store.getters['views/curr'];
        },

        currView () {
            return this.views[this.curr];
        },

        viewName () {
            return this.currView ? this.currView.name : 'None';
        },

        filteredDocs () {
            return this.filteredFields.length > 1 ? this.docs : [];
        },

        filteredFields () {
            let filteredFields = [];

            if (this.currView) {
                const cols = this.currView.cols;
                filteredFields = this.fields.filter(field => cols.includes(field.key));
            } else {
                filteredFields = Array.from(this.fields);
            }

            filteredFields.push({
                key: 'actions',
                label: '',
                class: 'actions'
            });

            return filteredFields;
        },

        emptyText () {
            return `${this.filteredFields.length > 1 ?
                'There are no documents' :
                'There are no fields that match the view'}`;
        },

        caches () {
            return this.$store.getters['cache/caches'];
        },

        docs () {
            const isCacheReady = this.$store.getters['cache/isReady'];
            if (!this.currConn.id || !isCacheReady) return [];

            const db = this.$route.params.db;
            const cache = this.caches[this.currConn.id][db];

            if (!cache) {
                this.$store.dispatch('cache/buildDbs', { currConn: this.currConn });
                return [];
            } else {
                return cache.docs.rows.map(record => record.doc);
            }
        },

        fields () {
            if (!this.docs || this.docs.length <= 0) return [];

            let fields = Object.keys(this.docs[0]);
            fields = fields.map((field) => {
                return {
                    key: field,
                    sortable: true,
                    class: 'truncate td'
                };
            });

            return fields;
        }
    },
    methods: {
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
                            const baseUrl = this.currConn.baseUrl;
                            const db = this.$route.params.db;
                            const id = row.item._id;
                            const url = `${baseUrl}/${db}/${id}`;

                            this.$http.delete(url, this.currConn.user, this.currConn.pass).catch((err) => {
                                this.$events.$emit('alert-open', {
                                    variant: 'danger',
                                    msg: `${err.message} (${(err.response || {}).statusText || ''})`
                                });
                                this.$log.error('err:', err);
                            }).finally(() => {
                                this.$store.dispatch('cache/buildDbs', {
                                    currConn: this.currConn,
                                    dbs: [db]
                                });
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

        // triggers a re-caching of all dbs/docs
        load () {
            this.$store.dispatch('cache/buildDbs', { currConn: this.currConn });
        }
    }
};
</script>
