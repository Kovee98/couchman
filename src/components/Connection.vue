<template>
    <div>
        <b-modal id="connection">
            <template v-slot:modal-title class="capitalize">
                <span class="capitalize">{{action}} Connection</span>
            </template>
            <div class="d-block">
                <b-form>
                    <b-form-group
                        id="conn-name-group"
                        label="Name"
                        label-for="conn-name"
                        description="Name this connection"
                    >
                        <b-form-input
                            id="conn-name"
                            v-model="form.name"
                            placeholder="Connection 1"
                            required
                            trim
                        />
                    </b-form-group>

                    <b-form-group
                        id="conn-url-group"
                        label="URL"
                        label-for="conn-url"
                        description="The url for the server"
                    >
                        <b-form-input
                            id="conn-url"
                            v-model="form.url"
                            type="url"
                            placeholder="http://localhost:5984"
                            required
                            trim
                        />
                    </b-form-group>

                    <b-form-group
                        id="conn-user-group"
                        label="Username"
                        label-for="conn-user"
                    >
                        <b-form-input
                            id="conn-user"
                            v-model="form.user"
                            trim
                        />
                    </b-form-group>

                    <b-form-group
                        id="conn-pass-group"
                        label="Password"
                        label-for="conn-pass"
                    >
                        <b-form-input
                            id="conn-pass"
                            v-model="form.pass"
                            type="password"
                            trim
                        />
                    </b-form-group>
                </b-form>
            </div>

            <template v-slot:modal-footer>
                <div>
                    <b-overlay :show="isTesting" rounded="sm">
                        <b-button
                            :variant="testResult"
                            @click="test"
                            class="capitalize"
                        >
                            Test
                            <span v-if="isValid !== null">
                                <span v-if="isValid" class="text-success">
                                    <b-icon-check />
                                </span>
                                <span v-if="!isValid" class="text-danger">
                                    <b-icon-exclamation />
                                </span>
                            </span>
                        </b-button>
                    </b-overlay>
                </div>
                <div>
                    <b-button
                        variant="success"
                        @click="submit"
                        class="capitalize"
                    >
                        {{action}}
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'Connection',
    data () {
        return {
            action: '',
            conn: {},
            index: -1,
            form: {
                name: '',
                url: '',
                user: '',
                pass: ''
            },
            isTesting: false,
            isValid: null
        };
    },
    computed: {
        testResult () {
            if (this.isValid === null) {
                return 'outline-info';
            } else if (this.isValid) {
                return 'outline-success';
            } else {
                return 'outline-danger';
            }
        }
    },
    methods: {
        submit () {
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
        getConn () {
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
        },
        test () {
            let conn = this.getConn();
            this.isValid = null;
            this.isTesting = true;

            this.$http.get(conn.baseUrl, conn.user, conn.pass).then(() => {
                this.isValid = true;
            }).catch(() => {
                this.isValid = false;
            }).finally(() => {
                this.isTesting = false;
            });
        }
    },
    created () {
        this.$events.$on('connection-add', () => {
            this.action = 'add';
            this.conn = {};
            this.index = -1;
            this.isValid = null;

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
            this.isValid = null;

            this.form.name = conn.name || '';
            this.form.url = conn.baseUrl || '';
            this.form.user = conn.user || '';
            this.form.pass = conn.pass || '';

            this.$bvModal.show('connection');
        });
    }
};
</script>
