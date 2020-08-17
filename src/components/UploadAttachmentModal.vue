<template>
    <div>
        <b-modal
            id="upload-attachment-modal"
            title="Upload Attachment"
            ok-title="Upload"
            ok-variant="success"
            cancel-variant="outline-secondary"
            @ok="upload"
        >
            <div class="p-3">
                <b-form-file
                    v-model="att"
                    placeholder="Choose or drop a file here..."
                    drop-placeholder="Drop file here..."
                />
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'UploadAttachmentModal',
    props: {
        currConn: {
            type: Object,
            required: false
        }
    },
    data () {
        return {
            att: null
        };
    },
    methods: {
        upload () {
            const att = this.att;
            const url = `${this.currConn.baseUrl}/${this.$route.params.db}/${this.$route.params.doc}`;

            this.$http.get(url, this.currConn.user, this.currConn.pass).then((doc) => {
                return this.$http.put(`${url}/${att.name}?rev=${doc._rev}`, this.currConn.user, this.currConn.pass, {
                    headers: {
                        'Content-Type': att.type
                    },
                    body: att
                }).then(() => {
                    this.$events.$emit('alert-open', {
                        variant: 'success',
                        msg: 'Attachment uploaded'
                    });
                    this.$events.$emit('refresh');
                });
            }).catch((err) => {
                this.$events.$emit('alert-open', {
                    variant: 'danger',
                    msg: `${err.message} (${(err.response || {}).statusText || ''})`
                });

                this.$log.error(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
    .b-form-file > input.custom-file-input {
        cursor: pointer !important;
    }
</style>
