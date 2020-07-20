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
    layout () {
      return (this.$route.meta.layout || 'auth') + '-layout'
    }
  }
}
</script>

<style lang="less">
  @import 'assets/css/bootstrap.min.css';
  @import 'assets/css/all.min.css';
  @import 'assets/css/leaflet.css';
  @import 'assets/less/variables';
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
  .spinner-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99;
    .flex();
    .flex-center();
    .align-items-center();
    background-color: #f6f6f669;
  }
  .form-control {
    &:focus {
      .box-shadow-none();
    }
  }
</style>
