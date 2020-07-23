<template>
    <div>
        <b-modal id="connection" :title="`${isNew ? 'Add' : 'Update'} Connection`">
            <div class="d-block">
                <b-form>
                    <b-form-group
                        id="input-group-1"
                        label="Name"
                        label-for="input-1"
                        description="Name this connection. Must be unique."
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
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-4" label="Password" label-for="input-3">
                        <b-form-input
                            id="input-4"
                            v-model="form.pass"
                            type="password"
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </div>

            <template v-slot:modal-footer>
                <div>
                    <b-button variant="success" @click="submit">
                        {{isNew ? 'Add' : 'Update'}}
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
            isNew: true,
            form: {
                name: '',
                url: '',
                user: '',
                pass: ''
            }
        };
    },
    methods: {
        submit: function () {
            let conn = this.getConn();

            let invalid = [];
            if (!conn.name) invalid.push('name');
            if (!conn.url) invalid.push('url');
            if (conn.user && !conn.pass) invalid.push('password');
            if (!conn.user && conn.pass) invalid.push('user');

            if (invalid.length > 0) {
                let fields = invalid.join(', ');
                this.$events.$emit('alert-open', {
                    variant: 'danger',
                    msg: `Missing required field(s): ${fields}`
                });
                return;
            }

            this.$events.$emit('alert-close');
            this.$store.dispatch(`connections/${this.isNew ? 'add' : 'update'}`, conn);
            this.$bvModal.hide('connection');
        },
        getConn: function (form) {
            let url = this.form.url;
            if (url && this.form.user && this.form.pass) {
                url = url.split('//');
                url = `${url[0]}//${this.form.user}:${this.form.pass}@${url[1]}`;
            }

            return {
                name: this.form.name,
                url: url,
                user: this.form.user,
                pass: this.form.pass,
                active: false
            };
        }
    },
    created () {
        this.$events.$on('connection-add', () => {
            this.isNew = true;
            this.form.name = '';
            this.form.url = '';
            this.form.user = '';
            this.form.pass = '';

            this.$bvModal.show('connection');
        });

        this.$events.$on('connection-edit', (conn) => {
            this.isNew = false;
            this.form.name = conn.name || '';
            this.form.url = conn.url || '';
            this.form.user = conn.user || '';
            this.form.pass = conn.pass || '';

            this.$bvModal.show('connection');
        });
    }
};
</script>
