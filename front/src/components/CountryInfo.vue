<template>
  <div class="card country-info">
    <div class="card-body">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <p>
            <strong>Столица: </strong>
            <span>{{getSelectedCountry.capital}}</span>
          </p>
          <p>
            <strong>Площадь: </strong>
            <span>{{getSelectedCountry.areaInSqKm}} км<sup>2</sup></span>
          </p>
          <p>
            <strong>Население: </strong>
            <span>{{getSelectedCountry.population}} чел.</span>
          </p>
        </div>
        <div class="col-md-6 col-sm-12">
          <p>
            <strong>Языки: </strong>
            <span>
              <span v-for="(language, index) in getSelectedCountry.languages" :key="index">{{language}}</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import VacationsTable from '../components/VacationsTable'

  export default {
    name: 'CountryInfo',
    props: ['widgetType'],
    components: {VacationsTable},
    data() {
      return {
        country: {}
      }
    },
    computed: mapGetters(['getSelectedCountry'])
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';

  .country-info {
    height: 100%;
  }

  p {
    .flex();
    .flex-start();
    > strong {
      margin-right: 8px;
    }
  }

  span span {
    display: block;
  }
</style>
