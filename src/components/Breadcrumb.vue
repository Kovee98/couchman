<template>
    <div>
        <b-breadcrumb class="px-0 my-4 h5">
            <b-breadcrumb-item href="/#/dbs">Databases</b-breadcrumb-item>
            <b-breadcrumb-item
                v-if="$route.params.db"
                :href="`/#/dbs/${$route.params.db}`"
                :active="!!$route.params.db && !$route.params.doc"
            >
                {{$route.params.db}}
            </b-breadcrumb-item>
            <b-breadcrumb-item
                v-if="$route.params.doc"
                :href="`/#/dbs/${$route.params.db}/${$route.params.doc}`"
                :active="!!$route.params.doc"
            >
                {{$route.params.doc}}
            </b-breadcrumb-item>
        </b-breadcrumb>
    </div>
</template>

<script>
export default {

};
</script>
