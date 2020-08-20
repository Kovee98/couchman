<template>
    <div>
        <b-navbar
            type="dark"
            variant="dark"
        >
            <b-navbar-brand href="/#/dbs">
                <b-img v-bind="logo"/>
                Couchman
            </b-navbar-brand>

            <b-navbar-nav>
                <b-nav-item v-b-toggle.conns-sidebar>
                    Connections
                </b-nav-item>

                <b-nav-item
                    href="/#/settings"
                    right
                >
                    Settings
                </b-nav-item>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: 'TitleBar',
    data () {
        return {
            logo: {
                src: require('../assets/logo.svg'),
                width: 36,
                height: 36,
                class: 'd-inline-block'
            }
        };
    }
};
</script>
