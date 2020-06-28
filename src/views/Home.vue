<template>
    <div class="home">
        <!-- Show tables by default -->
        <Tables/>
    </div>
</template>

<script>
// @ is an alias to /src
import Tables from '@/components/Tables.vue';

export default {
    name: 'Home',
    components: {
        Tables
    }
};

</script>
