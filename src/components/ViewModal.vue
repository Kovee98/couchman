<template>
    <div>
        <b-modal
            id="views"
            ok-title="Save"
            cancel-variant="outline-secondary"
            @show="reset"
            @ok="save"
        >
            <template
                v-slot:modal-title
                class="capitalize"
            >
                <span class="capitalize">
                    Create View
                </span>
            </template>

            <b-form-group
                id="view-name-group"
                label="Name"
                label-for="view-name"
                description="Name this view"
            >
                <b-form-input
                    id="view-name"
                    v-model="name"
                    type="search"
                    placeholder="View 1"
                    required
                    trim
                />
            </b-form-group>

            <b-form @submit.prevent="addCol">
                <b-form-group
                    id="view-cols-group"
                    label="Columns"
                    label-for="view-cols"
                    description="Enter a column name and press enter"
                >
                    <b-form-input
                        id="view-cols"
                        v-model="col"
                        type="search"
                        placeholder="_id"
                        required
                        trim
                    />
                </b-form-group>
                <div>
                    <h4>
                        <b-badge
                            v-for="(col, i) in cols"
                            :key="col.id"
                            class="mr-2"
                        >
                            {{col}}
                            <span class="clickable">
                                <b-icon-trash
                                    font-scale="0.8"
                                    @click="removeCol(i)"
                                    class="ml-2"
                                />
                            </span>
                        </b-badge>
                    </h4>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'ViewModal',
    props: {
        fields: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            name: '',
            col: '',
            cols: ['age', 'name', 'animal']
        };
    },
    methods: {
        save () {
            this.$store.dispatch('views/add', {
                view: {
                    name: this.name,
                    cols: this.cols
                }
            });
        },

        addCol () {
            this.cols.push(this.col);
            this.col = '';
        },

        removeCol (i) {
            this.cols.splice(i, 1);
        },

        reset () {
            this.name = '';
            this.col = '';
            this.cols = [];
        }
    }
};
</script>

<style lang="scss" scoped>
    .clickable {
        :hover {
            color: red;
        }
    }
</style>
