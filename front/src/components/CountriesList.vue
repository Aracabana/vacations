<template>
  <ul class="countries-list list-unstyled">
    <li v-for="(country, index) in getCountriesForSelect" :key="index" @click="">
<!--      <img :src="country.flag" alt="" class="flag">-->
      <span>{{country.name}}</span>
      {{loadCountryAdditionalData({countryCode: country.code, fields: ['flag']})}}
    </li>
  </ul>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: "CountriesList",
    data() {
      return {
        countries: []
      }
    },
    computed: mapGetters(['getCountriesForSelect']),
    methods: mapActions(['loadCountryAdditionalData']),
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .countries-list {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    z-index: 100;
    overflow-y: auto;
    overflow-x: hidden;
    .border-bottom-radius(.25rem);
    border: 1px solid #80bdff;
    border-top: none;
    padding: .375rem 0;
    max-height: 200px;
    background-color: #ffffff;
    /*box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);*/
    li {
      .flex();
      .flex-start();
      .align-items-center();
      padding: 3px .75rem;
      cursor: pointer;
      &:hover {
        background-color: rgba(0,123,255,.25);
      }
    }
    .flag {
      position: static;
      max-width: 35px;
    }
  }

</style>
