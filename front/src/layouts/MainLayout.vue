<template>
  <router-view></router-view>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
    computed: mapGetters(['checkIfCountriesExist']),
    methods: mapActions(['loadCountries']),
    async mounted() {
      if (!this.checkIfCountriesExist) {
        console.log('123')
        await this.loadCountries();
      }
    }
  }
</script>

<style lang="less">
  @import '../assets/less/variables';
  .main-body {
    min-height: 100vh;
    background-color: #f2f2f2;
  }
  .header + .page-wrapper {
    padding-top: 80px;
  }
  .page-wrapper {
    padding: 24px 0;
  }
  .content {
    padding-top: 56px;
  }
  .flag {
    position: relative;
    top: -2px;
    margin-right: 16px;
    max-width: 40px;
  }
</style>
