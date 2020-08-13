<template>
    <div>
        <b-modal
            id="view-modal"
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

            <div>
                <b-button
                    v-for="btn in buttons"
                    :key="btn.id"
                    :pressed.sync="btn.state"
                    size="sm"
                    variant="outline-secondary"
                    active-class="secondary"
                    class="ml-2 mt-2"
                >
                    {{btn.key}}
                </b-button>
            </div>
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
            buttons: []
        };
    },
    watch: {
        fields () {
            this.buttons = this.fields.map((field) => {
                return {
                    ...field,
                    state: false
                };
            });
        }
    },
    methods: {
        save (e) {
            if (!this.name) {
                // don't close modal
                e.preventDefault();

                this.$events.$emit('alert-open', {
                    variant: 'danger',
                    msg: 'Missing required field(s): name'
                });

                return;
            }

            const cols = this.buttons.reduce((acc, curr) => {
                if (curr.state) {
                    acc.push(curr.key);
                }
                return acc;
            }, []);

            this.$store.dispatch('views/add', {
                view: {
                    name: this.name,
                    cols: cols
                }
            });
        },

        reset () {
            this.name = '';
            this.buttons = this.fields.map((field) => {
                return {
                    ...field,
                    state: false
                };
            });
        }
    }
};
</script>
