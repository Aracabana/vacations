<template>
    <div id="app" class="app">
        <component :is="layout">
            <router-view></router-view>
        </component>
    </div>
</template>

<script>
    import AuthLayout from './layouts/AuthLayout.vue'
    import MainLayout from './layouts/MainLayout.vue'
    
    export default {
        name: 'App',
        components: {
            AuthLayout, MainLayout
        },
        computed: {
            layout() {
                return (this.$route.meta.layout || 'main') + '-layout'
            }
        }
    }
</script>

<style>
    @import 'assets/css/bootstrap.min.css';
    @import 'assets/css/all.min.css';
    @import 'assets/css/leaflet.css';
    html {
        min-height: 100%;
    }
    body {
        min-height: 100vh;
    }
    .app {
        min-height: 100vh;
    }
    .form-check-input {
        margin-top: 0.4rem;
    }
    .btn .fas {
        position: relative;
        bottom: -1px;
    }
</style>
