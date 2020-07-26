<template>
    <div>
        <b-modal id="connection">
            <template v-slot:modal-title class="capitalize">
                <span class="capitalize">{{action}} Connection</span>
            </template>
            <div class="d-block">
                <b-form>
                    <b-form-group
                        id="input-group-1"
                        label="Name"
                        label-for="input-1"
                        description="Name this connection"
                    >
                        <b-form-input
                            id="input-1"
                            v-model="form.name"
                            required
                            placeholder="Connection 1"
                            trim
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        id="input-group-2"
                        label="URL"
                        label-for="input-2"
                        description="The url for the server"
                    >
                        <b-form-input
                            id="input-2"
                            v-model="form.url"
                            type="url"
                            required
                            placeholder="http://localhost:5984"
                            trim
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-3" label="Username" label-for="input-2">
                        <b-form-input
                            id="input-3"
                            v-model="form.user"
                            trim
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-4" label="Password" label-for="input-3">
                        <b-form-input
                            id="input-4"
                            v-model="form.pass"
                            type="password"
                            trim
                        ></b-form-input>
                    </b-form-group>
                </b-form>
            </div>

            <template v-slot:modal-footer>
                <div>
                    <b-button class="capitalize" variant="success" @click="submit">
                        {{action}}
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
            action: '',
            conn: {},
            index: -1,
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

            let invalid = this.validate(conn);

            if (invalid.length > 0) {
                let fields = invalid.join(', ');
                this.$events.$emit('alert-open', {
                    variant: 'danger',
                    msg: `Missing required field(s): ${fields}`
                });
                return;
            }

            this.$events.$emit('alert-close');

            let action = `connections/${this.action}`;
            this.$store.dispatch(action, {
                i: this.index,
                conn: conn
            });

            this.$bvModal.hide('connection');
        },
        validate (conn) {
            let invalid = [];

            if (!conn.name) invalid.push('name');
            if (!conn.url) invalid.push('url');
            if (conn.user && !conn.pass) invalid.push('password');
            if (!conn.user && conn.pass) invalid.push('user');

            return invalid;
        },
        getConn (form) {
            let baseUrl = this.form.url;
            let url = baseUrl;
            if (baseUrl && this.form.user && this.form.pass) {
                url = baseUrl.split('//');
                url = `${url[0]}//${this.form.user}:${this.form.pass}@${url[1]}`;
            }

            return Object.assign(this.conn || {}, {
                name: this.form.name,
                baseUrl: baseUrl,
                url: url,
                user: this.form.user,
                pass: this.form.pass
            });
        }
    },
    created () {
        this.$events.$on('connection-add', () => {
            this.action = 'add';
            this.conn = {};
            this.index = -1;

            this.form.name = '';
            this.form.url = '';
            this.form.user = '';
            this.form.pass = '';

            this.$bvModal.show('connection');
        });

        this.$events.$on('connection-update', (i, conn) => {
            this.action = 'update';
            this.conn = conn || {};
            this.index = i;

            this.form.name = conn.name || '';
            this.form.url = conn.url || '';
            this.form.user = conn.user || '';
            this.form.pass = conn.pass || '';

            this.$bvModal.show('connection');
        });
    }
};
</script>
