<template>
    <div class="mt-4">
        <b-overlay
            :show="loading"
            rounded="sm"
        >
            <codemirror
                v-model="doc"
                :options="opts"
                ref="editor"
            />
        </b-overlay>

        <span class="float-right">
            <b-button
                variant="outline-secondary"
                @click="cancel"
            >
                Cancel
            </b-button>
            <b-button
                variant="primary"
                @click="save"
                class="ml-2"
            >
                Save
            </b-button>
        </span>
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';

export default {
    name: 'DocumentEditor',
    components: {
        codemirror
    },
    props: {
        currConn: {
            type: Object,
            required: false
        }
    },
    data () {
        return {
            show: false,
            doc: '',
            opts: {
                tabSize: 2,
                mode: 'application/json',
                lineNumbers: true,
                smartIndent: true,
                lineWrapping: true,
                lineWiseCopyCut: false,
                scrollbarStyle: 'null',
                showCursorWhenSelecting: true,
                autoCloseBrackets: true,
                matchBrackets: true,
                styleActiveLine: true
            },
            loading: false
        };
    },
    computed: {
        codemirror () {
            return this.$refs.editor.codemirror;
        }
    },
    watch: {
        currConn () {
            this.load();
        }
    },
    mounted () {
        this.load();

        this.$events.$on('refresh', (e) => {
            this.load();
        });
    },
    methods: {
        cancel () {
            this.$router.go(-1);
        },

        save (e) {
            let doc = this.codemirror.getValue();
            doc = JSON.parse(doc);
            this.loading = true;

            if (this.currConn && this.currConn.url && this.$route.params.doc) {
                let url = `${this.currConn.baseUrl}/${this.$route.params.db}/${this.$route.params.doc}`;

                this.$http.put(url, this.currConn.user, this.currConn.pass, {
                    body: JSON.stringify(doc)
                }).then((res) => {
                    this.$router.go(-1);
                }).catch((err) => {
                    this.$events.$emit('alert-open', {
                        variant: 'danger',
                        msg: `${err.message} (${(err.response || {}).statusText || ''})`
                    });

                    this.$log.error(err);
                }).finally(() => {
                    this.loading = false;
                });
            }
        },

        load () {
            this.loading = true;
            this.doc = '';

            if (this.currConn && this.currConn.url && this.$route.params.doc) {
                let url = `${this.currConn.baseUrl}/${this.$route.params.db}/${this.$route.params.doc}`;

                this.$http.get(url, this.currConn.user, this.currConn.pass).then((data) => {
                    this.doc = JSON.stringify(data, null, 4);
                    this.show = true;
                }).catch((err) => {
                    this.$events.$emit('alert-open', {
                        variant: 'danger',
                        msg: `${err.message} (${(err.response || {}).statusText || ''})`
                    });

                    this.$log.error(err);
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    }
};
</script>
