<template>
    <div class="mt-4">
        <b-overlay :show="loading" rounded="sm">
            <codemirror
                v-model="doc"
                :options="opts"
                ref="editor"
            />
        </b-overlay>

        <span class="float-right">
            <b-button variant="outline-secondary" @click="cancel">Cancel</b-button>
            <b-button variant="primary" @click="save" class="ml-2">Save</b-button>
        </span>
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';

export default {
    props: ['curr', 'conns'],
    components: {
        codemirror
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
    methods: {
        save (e) {
            let doc = this.codemirror.getValue();
            doc = JSON.parse(doc);

            this.loading = true;
            let currConn = this.conns[this.curr];
            if (currConn && currConn.url && this.$route.params.doc) {
                let url = `${currConn.baseUrl}/${this.$route.params.db}/${this.$route.params.doc}`;
                this.$http.put(url, currConn.user, currConn.pass, {
                    body: JSON.stringify(doc)
                }).then((res) => {
                    this.$router.go(-1);
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
        },
        cancel () {
            this.$router.go(-1);
        },
        load () {
            this.loading = true;
            this.doc = '';
            let currConn = this.conns[this.curr];
            if (currConn && currConn.url && this.$route.params.doc) {
                let url = `${currConn.baseUrl}/${this.$route.params.db}/${this.$route.params.doc}`;
                this.$http.get(url, currConn.user, currConn.pass).then((data) => {
                    this.doc = JSON.stringify(data, null, 4);
                    this.show = true;
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
    watch: {
        curr () {
            this.load();
        },
        conns () {
            this.load();
        }
    },
    computed: {
        codemirror () {
            return this.$refs.editor.codemirror;
        }
    },
    mounted () {
        this.load();
        this.$events.$on('refresh', (e) => {
            this.load();
        });
    }
};
</script>
