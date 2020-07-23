<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand href="/#/dbs">Couchman</b-navbar-brand>
            <b-navbar-nav>
                <Connections/>
            </b-navbar-nav>
        </b-navbar>
    </div>
</template>

<script>
import Connections from '@/components/Connections.vue';

export default {
    name: 'Navbar',
    components: {
        Connections
    }
};
</script>
