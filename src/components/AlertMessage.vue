<template>
    <b-alert
        :show="countdown"
        :variant="variant"
        @dismiss-count-down="countdownChanged"
        class="alert"
        dismissible
        fade
    >
        {{msg}}
    </b-alert>
</template>

<script>
export default {
    name: 'AlertMessage',
    data () {
        return {
            show: false,
            countdownSec: 5,
            countdown: 0,
            variant: 'default',
            msg: 'This is an alert'
        };
    },
    created () {
        this.$events.$on('alert-open', (data) => {
            this.msg = data.msg;
            this.variant = data.variant;
            this.countdown = this.countdownSec;
        });

        this.$events.$on('alert-close', (data) => {
            this.show = false;
        });
    },
    methods: {
        countdownChanged (countdown) {
            this.countdown = countdown;
        }
    }
};
</script>

<style lang="scss" scoped>
    #app .alert {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 10000;
    }
</style>
