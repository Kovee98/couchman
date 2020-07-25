<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand href="/#/dbs">Couchman</b-navbar-brand>
            <b-navbar-nav>
                <Connections :curr="curr" :conns="conns" />
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import Connections from '@/components/Connections.vue';

export default {
    props: ['curr', 'conns'],
    name: 'Navbar',
    components: {
        Connections
    }
};
</script>
