<template>
    <div id="app">
        <Alert/>
        <Confirmation/>
        <Navbar/>
        <b-container>
            <router-view :curr="$store.getters['connections/curr']" />
        </b-container>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue';
import Confirmation from '@/components/Confirmation.vue';
import Alert from '@/components/Alert.vue';

export default {
    name: 'App',
    components: {
        Navbar,
        Confirmation,
        Alert
    },
    created () {
        this.$store.dispatch('connections/init');
    }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.capitalize {
    text-transform: capitalize;
}

.clickable {
    cursor: pointer;
}

.edit {
    cursor: pointer;
    display: inline;
    :hover {
        color: black;
    }
}

.remove {
    cursor: pointer;
    display: inline;
    :hover {
        color: red;
    }
}

.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>
