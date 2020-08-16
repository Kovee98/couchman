<template>
    <div class="editor">
        <b-overlay
            :show="loading"
            rounded="sm"
            class="h-100"
        >
            <codemirror
                v-model="doc"
                :options="opts"
                ref="editor"
                class="h-100"
            />
        </b-overlay>

        <span class="py-3 float-right">
            <b-button
                variant="outline-secondary"
                @click="cancel"
            >
                Cancel
            </b-button>
            <b-button
                variant="success"
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
                tabSize: 4,
                indentUnit: 4,
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
    },
    methods: {
        cancel () {
            this.$router.go(-1);
        },

        save (e) {
            const doc = JSON.parse(this.codemirror.getValue());
            this.loading = true;

            if (this.currConn && this.currConn.url && this.$route.params.doc) {
                const url = `${this.currConn.baseUrl}/${this.$route.params.db}/${this.$route.params.doc}`;

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
                const url = `${this.currConn.baseUrl}/${this.$route.params.db}/${this.$route.params.doc}`;

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

<style lang="scss">
    $height: 45rem;
    $background: rgb(32, 32, 32);
    $text: #eeeeee;
    $color: transparentize($text, 0.25);
    $lineNumbers: transparentize($text, 0.75);

    .editor {
        height: $height;
        font-size: 0.9rem;
        background: $background;
        cursor: text;
    }
    .CodeMirror {
        height: $height !important;
        color: $color !important;
        background: transparent !important;
    }
    div.CodeMirror-selected {
        background: lighten($background, 5%) !important;
    }
    .CodeMirror-guttermarker, .CodeMirror-guttermarker-subtle {
        color: transparent !important;
    }
    .CodeMirror-gutters {
        background: transparent !important;
        border-right: none !important;
    }
    .CodeMirror-cursor {
        border-left: 1px solid $color !important;
    }
    .CodeMirror-linenumber {
        color: $lineNumbers !important;
    }
    .CodeMirror-matchingbracket, .CodeMirror-nonmatchingbracket {
        color: lighten($color, 50%) !important;
        background: lighten($background, 10%) !important;
        outline: 1px solid $color;
    }
    .CodeMirror-activeline-background {
        background: lighten($background, 2%) !important;
    }

    // syntax colors
    $key: #80ff00;
    $string: #e7db74;
    $number: #ac80ff;
    $atom: #ac80ff;

    span.cm-string { color: $string !important }
    span.cm-keyword, span.cm-variable, span.cm-property { color: $key !important }
    span.cm-number { color: $number !important }
    span.cm-atom { color: $atom !important }
</style>
