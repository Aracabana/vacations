<template>
  <section class="main-body">
    <Header></Header>
    <Spinner v-if="appLoading"></Spinner>
    <router-view v-else></router-view>
<!--    <VacationEditPopup v-if="getPopup"></VacationEditPopup>-->
  </section>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import Spinner from '../components/Spinner';
  import Header from '../components/Header';
  import VacationEditPopup from '../components/VacationEditPopup';

  export default {
    components: {Spinner, Header, VacationEditPopup},
    data() {
      return {
        appLoading: true
      }
    },
    computed: mapGetters(['countriesIsExist', 'getPopup']),
    methods: {
      ...mapActions(['loadCountries', 'loadVacations']),
      async loadAppState() {
        this.appLoading = true;
        await this.loadCountries();
        await this.loadVacations();
        this.appLoading = false;
      }
    },
    async mounted() {
      await this.loadAppState();
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
