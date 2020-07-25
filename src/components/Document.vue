<template>
    <b-modal
        v-model="show"
        size="xl"
        title="Document"
        ok-title="Save"
        cancel-title="Cancel"
        @ok="save"
        @hidden="cancel"
        @show="refresh"
    >
        <b-overlay :show="loading" rounded="sm">
            <codemirror
                v-model="doc"
                :options="opts"
                ref="editor"
            />
        </b-overlay>
    </b-modal>
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
            if (currConn && currConn.url && this.$route.query.doc) {
                this.$axios.put(`${currConn.url}/${this.$route.params.db}/${this.$route.query.doc}`, doc).then((res) => {
                    this.$events.$emit('refresh');
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    this.loading = false;
                });
            }
        },
        cancel () {
            this.$router.push({ name: this.$route.name, query: {} });
        },
        refresh () {
            this.loading = true;
            let currConn = this.conns[this.curr];
            if (currConn && currConn.url && this.$route.query.doc) {
                this.$axios.get(`${currConn.url}/${this.$route.params.db}/${this.$route.query.doc}`).then(({ data }) => {
                    this.doc = JSON.stringify(data, null, 4);
                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    },
    watch: {
        curr () {
            this.refresh();
        },
        conns () {
            this.refresh();
        }
    },
    computed: {
        codemirror () {
            return this.$refs.editor.codemirror;
        },
        show: {
            get () {
                return !!this.$route.query.doc;
            },
            set () {}
        }
    },
    mounted () {
        this.$events.$on('refresh', (e) => {
            this.refresh();
        });
    }
};
</script>
