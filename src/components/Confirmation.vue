<template>
    <div>
        <b-modal
            v-model="show"
            :title="title"
            :ok-title="confirm.text"
            :ok-variant="confirm.variant"
            :cancel-title="cancel.text"
            :cancel-variant="cancel.variant"
            @ok="confirm.action"
        >
            <p>{{body}}</p>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'Confirmation',
    data () {
        return {
            show: false,
            title: 'Are You Sure?',
            body: 'Sample body',
            cancel: {
                text: 'Cancel',
                variant: 'outline-secondary',
                action: () => {}
            },
            confirm: {
                text: 'Confirm',
                variant: 'danger',
                action: () => {}
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
            };

            this.show = true;
        });
    }
};
</script>
