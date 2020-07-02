<template>
    <div class="alert" :class="ok ? 'alert-success' : 'alert-danger'">{{text}}</div>
</template>

<script>
    export default {
        name: "ServerFeedback",
        props: {
            ok: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                // showServerFeedback: false
            }
        },
        methods:{
            // hide() {
            //     setTimeout(() => {
            //         this.showServerFeedback = false
            //     }, 4000);
            // },
        },
        mounted() {
            // this.hide();
        }
    }
</script>

<style scoped>

</style>
