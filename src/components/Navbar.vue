<template>
    <div>
        <b-navbar type="dark" variant="dark">
            <b-navbar-brand href="#">Couchman</b-navbar-brand>
            <b-navbar-nav>
                <b-nav-item href="#">Home</b-nav-item>
                <Connections/>

                <!-- dropdown -->
                <b-nav-item-dropdown text="Settings" right>
                    <b-dropdown-item href="#">Account</b-dropdown-item>
                    <b-dropdown-item href="#">Settings</b-dropdown-item>
                </b-nav-item-dropdown>
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
