<template>
    <b-alert
        v-model="show"
        :variant="variant"
        dismissible
        fade
        class="alert"
    >
        {{msg}}
    </b-alert>
</template>

<script>
export default {
    data () {
        return {
            show: false,
            variant: 'default',
            msg: 'This is an alert'
        };
    },
    created () {
        this.$events.$on('alert-open', (data) => {
            this.msg = data.msg;
            this.variant = data.variant;
            this.show = true;
        });

        this.$events.$on('alert-close', (data) => {
            this.show = false;
        });
    }
};
</script>

<style lang="scss">
    #app .alert {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 10000;
    }
</style>
