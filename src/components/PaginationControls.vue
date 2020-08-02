<template>
    <div class="pagination">
        <!-- previous button -->
        <b-button
            variant="light"
            size="sm"
            :disabled="numPages <= 0 || currPage === 1"
            @click="prevPage"
            class="text-primary"
        >
            <b-icon-chevron-left
                font-scale="0.95"
                class="mr-1"
            />
            Prev
        </b-button>

        <!-- page numbers -->
        <div class="nums left">
            <b-button
                v-if="currPage - 2 > 0"
                size="sm"
                variant="light"
                @click="choosePage(currPage - 2)"
            >
                {{currPage - 2}}
            </b-button>
            <b-button
                v-if="currPage - 1 > 0"
                size="sm"
                variant="light"
                @click="choosePage(currPage - 1)"
            >
                {{currPage - 1}}
            </b-button>
        </div>

        <b-button
            size="sm"
            variant="primary"
        >
            {{currPage}}
        </b-button>

        <div class="nums right">
            <b-button
                v-if="currPage + 1 <= numPages"
                size="sm"
                variant="light"
                @click="choosePage(currPage + 1)"
            >
                {{currPage + 1}}
            </b-button>
            <b-button
                v-if="currPage + 2 <= numPages"
                size="sm"
                variant="light"
                @click="choosePage(currPage + 2)"
            >
                {{currPage + 2}}
            </b-button>
        </div>

        <!-- next button -->
        <b-button
            variant="light"
            size="sm"
            :disabled="numPages <= 0 || currPage === numPages"
            @click="nextPage"
            class="text-primary"
        >
            Next
            <b-icon-chevron-right
                font-scale="0.95"
                class="ml-1"
            />
        </b-button>
    </div>
</template>

<script>
export default {
    name: 'PaginationControls',
    props: {
        currPage: {
            type: Number,
            required: true
        },

        numPages: {
            type: Number,
            required: true
        }
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

<style lang="scss" scoped>
    .pagination {
        // position: fixed;
        // bottom: 0;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
    }

    .nums {
        display: flex;
        flex-flow: row nowrap;
        width: 75px;
        margin: 0 8px;
    }

    .left {
        justify-content: flex-end;

        & > * {
            margin-right: 8px;
        }
    }

    .right {
        justify-content: flex-start;

        & > * {
            margin-left: 8px;
        }
    }
</style>
