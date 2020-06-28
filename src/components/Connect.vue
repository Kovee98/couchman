<template>
    <div>
        <b-button v-b-modal.connect variant="success" size="sm" class="float-left">
            <b-icon-plus/>
            Add Connection
        </b-button>
        <b-modal id="connect" ref="connect">
            <template v-slot:modal-title>
                Add Connection
            </template>
            <div class="d-block">
                <b-form>
                    <b-form-group
                        id="input-group-1"
                        label="Name"
                        label-for="input-1"
                        description="Give this connection a meaningful name"
                    >
                        <b-form-input
                            id="input-1"
                            v-model="form.name"
                            required
                            placeholder="Connection 1"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="input-group-2"
                        label="URL"
                        label-for="input-2"
                        description="The url for the running db instance"
                    >
                        <b-form-input
                            id="input-2"
                            v-model="form.url"
                            required
                            placeholder="http://localhost:5984"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-3" label="Username" label-for="input-2">
                        <b-form-input
                            id="input-3"
                            v-model="form.user"
                            required
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-4" label="Password" label-for="input-3">
                        <b-form-input
                            id="input-4"
                            v-model="form.pass"
                            required
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </div>

            <template v-slot:modal-footer>
                <div>
                    <b-button
                        variant="success"
                        @click="add"
                    >
                        Add
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            form: {
                name: '',
                url: '',
                user: '',
                pass: ''
            }
        };
    },
    methods: {
        add: function (e) {
            e.preventDefault();

            let url = this.form.url;
            if (this.form.user && this.form.pass) {
                url = url.split('//');
                url = `${url[0]}//${this.form.user}:${this.form.pass}@${url[1]}`;
            }

            let conn = {
                name: this.form.name,
                url: url,
                user: this.form.user,
                pass: this.form.pass,
                active: false
            };

            this.$store.dispatch('connections/add', conn);

            this.$refs.connect.hide();
        }
    }
};
</script>
