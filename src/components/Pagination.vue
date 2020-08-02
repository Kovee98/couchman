<template>
    <div style="display: flex; justify-content: center">
        <div class="p-2">
            <!-- previous button -->
            <b-button
                variant="light text-primary"
                size="sm"
                :disabled="numPages <= 0 || currPage === 1"
                @click="prevPage"
            >
                <b-icon-chevron-left font-scale="0.95" class="mr-1" />
                Prev
            </b-button>

            <!-- dynamic page numbers -->
            <b-button
                v-for="i in numPages"
                :key="i"
                size="sm"
                :variant="i === currPage ? 'primary' : 'light'"
                @click="choosePage(i)"
                class="ml-2 px-2"
            >
                {{i}}
            </b-button>

            <!-- next button -->
            <b-button
                variant="light"
                size="sm"
                :disabled="numPages <= 0 || currPage === numPages"
                @click="nextPage"
                class="ml-2 text-primary"
            >
                Next
                <b-icon-chevron-right font-scale="0.95" class="ml-1" />
            </b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: ['currPage', 'numPages'],
    data () {
        return {
            // how many page numbers to display on each side of currPage
            numCount: 2
        };
    },
    methods: {
        choosePage (i) {
            this.$events.$emit('set-curr-page', i);
        },
        nextPage () {
            if (this.currPage < this.numPages) {
                this.$events.$emit('set-curr-page', this.currPage + 1);
            }
        },
        prevPage () {
            if (this.currPage > 1) {
                this.$events.$emit('set-curr-page', this.currPage - 1);
            }
        }
    }
};
</script>
