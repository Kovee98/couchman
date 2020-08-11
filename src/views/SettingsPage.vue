<template>
    <div class="px-5">
        <!-- danger zone section -->
        <div class="px-5 mt-5">
            <h4>Danger Zone</h4>
            <b-card
                border-variant="danger"
                no-body
            >
                <b-list-group flush>
                    <b-list-group-item>
                        <b-row>
                            <b-col>
                                <p class="mb-0"><strong>Clear Application Data</strong></p>
                                <p class="mb-0">Need a fresh start?</p>
                            </b-col>
                            <b-col
                                cols="3"
                                class="flex-middle flex-end"
                            >
                                <b-button
                                    variant="outline-danger"
                                    @click="clearData"
                                    class=""
                                >
                                    Clear Data
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-list-group-item>
                </b-list-group>
            </b-card>
        </div>
    </div>
</template>

<script>
import db from '@/js/db.js';

export default {
    name: 'SettingsPage',
    methods: {
        clearData () {
            this.$events.$emit('confirm', {
                title: 'Clear Data?',
                body: 'Clearing will return everything back to a blank slate. This is permanent and cannot be undone.',
                confirm: {
                    text: 'Yes, clear data',
                    variant: 'danger',
                    action: () => {
                        Promise.allSettled([
                            db.connections.clear(),
                            db.views.clear()
                        ]).then(() => {
                            this.$events.$emit('alert-open', {
                                variant: 'success',
                                msg: 'Data cleared'
                            });
                        }).catch((err) => {
                            this.$events.$emit('alert-open', {
                                variant: 'danger',
                                msg: `Data not cleared. ${err}`
                            });
                        });
                    }
                },
                cancel: {
                    text: 'No, keep data',
                    variant: 'outline-secondary'
                }
            });
        }
    }
};
</script>
