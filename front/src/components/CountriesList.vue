<template>
  <div class="countries-list-wrapper">
    <Spinner v-if="!countriesIsExist"></Spinner>
    <p v-if="!getContinentsForSelect.length" class="countries-empty"><i class="far fa-sad-tear"></i> Страна не найдена</p>
    <ul v-else class="countries-list list-unstyled">
      <li v-for="(continent, index) in getContinentsForSelect" :key="index">
        <LazyContinentItem :continent="continent"></LazyContinentItem>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Spinner from "./Spinner";
  import LazyContinentItem from "./LazyContinentItem";

  export default {
    name: "CountriesList",
    components: {Spinner, LazyContinentItem},
    computed: mapGetters(['getContinentsForSelect', 'countriesIsExist'])
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
  }
  .countries-list {
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 0;
    max-height: 200px;
  }
  .countries-empty {
    margin-bottom: 0;
    padding: 13px .75rem;
    text-align: center;
    background-color: #eaeaea;
  }
</style>
