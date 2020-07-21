<template>
  <div class="countries-list-wrapper">
    <Spinner v-if="!countriesIsExist"></Spinner>
    <p v-if="!getCountriesForSelect.length"><i class="far fa-sad-tear"></i> Страна не найдена</p>
    <ul v-else class="countries-list list-unstyled">
      <li v-for="(continent, index) in getCountriesForSelect" :key="index">
        <p><strong>{{continent.continentName}}</strong></p>
        <ul class="list-unstyled">
          <li
            v-for="(country, index) in continent.countries"
            :key="index"
            @click="$emit('chooseCountry', country.countryName)"
          >
            <img v-if="country.flag !== 'not'" :src="country.flag" alt="" class="flag">
            <span>{{country.countryName}}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Spinner from "./Spinner";

  export default {
    name: "CountriesList",
    components: {Spinner},
    computed: mapGetters(['getCountriesForSelect', 'countriesIsExist']),
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .countries-list-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    z-index: 100;
    .border-bottom-radius(.25rem);
    border: 1px solid #80bdff;
    border-top: none;
    min-height: 50px;
    background-color: #ffffff;
    > p {
      margin-bottom: 0;
      padding: 13px .75rem;
      text-align: center;
      background-color: #eaeaea;
    }
  }
  .countries-list {
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 0;
    max-height: 200px;
    > li {
      p {
        margin-bottom: 0;
        padding: 3px .75rem;
        font-size: 12px;
        background-color: #eaeaea;
      }
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
    }
    .flag {
      position: static;
      max-width: 35px;
    }
  }

</style>
