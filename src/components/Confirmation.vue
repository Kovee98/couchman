<template>
    <div>
        <b-modal id="confirm" :title="title">
            <p>{{body}}</p>

            <template v-slot:modal-footer>
                <div>
                    <b-button
                        :variant="cancel.variant"
                        @click="cancel.action"
                    >
                        {{cancel.text}}
                    </b-button>
                    <b-button
                        :variant="confirm.variant"
                        @click="confirm.action"
                    >
                        {{confirm.text}}
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'Confirmation',
    data () {
        return {
            title: 'Sample title',
            body: 'Sample body',
            cancel: {
                text: 'Cancel',
                variant: 'secondary',
                action: () => {
                    this.$bvModal.hide('confirm');
                }
            },
            confirm: {
                text: 'Confirm',
                variant: 'danger',
                action: () => {
                    this.$bvModal.hide('confirm');
                }
            }
        };
    },
    created () {
        this.$events.$on('confirm', (data) => {
            this.title = data.title;
            this.body = data.body;

            // override if present
            this.cancel.text = (data.cancel || {}).text || this.cancel.text;
            this.cancel.variant = (data.cancel || {}).variant || this.cancel.variant;
            this.cancel.action = (data.cancel || {}).action || this.cancel.action;

            this.confirm.text = (data.confirm || {}).text || this.confirm.text;
            this.confirm.variant = (data.confirm || {}).variant || this.confirm.variant;
            this.confirm.action = () => {
                (data.confirm || {}).action ? data.confirm.action() : this.confirm.action();
                this.$bvModal.hide('confirm');
            };

            this.$bvModal.show('confirm');
        });
    }
};
</script>
