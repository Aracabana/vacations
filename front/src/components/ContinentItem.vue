<template>
  <div class="continent-item">
    <p><strong>{{continent.continentName}}</strong></p>
    <ul class="list-unstyled">
      <li
        v-for="(country, index) in continent.countries"
        :key="index"
        @click="chooseCountry(country.countryId)"
      >
        <v-lazy-image
          :src="country.getFlag()"
          :src-placeholder="require('@/assets/img/img-placeholder.png')"
          class="flag"
        />
        <span>{{country.countryName}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
    import VLazyImage from "v-lazy-image";
    import {mapActions} from "vuex";

    export default {
      name: "ContinentItem",
      props: ['continent'],
      components: {VLazyImage},
      data() {
        return {
          observer: null,
          intersectionOptions: {}
        }
      },
      methods: {
        ...mapActions(['selectCountry']),
        chooseCountry(id) {
          this.selectCountry(id);
        }
      }
    }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables';
  .v-lazy-image {
    filter: blur(2px);
    transition: filter 0.3s;
  }
  .v-lazy-image-loaded {
    filter: blur(0);
  }

  .continent-item {
    > p {
      margin-bottom: 0;
      padding: 5px .75rem;
      font-size: 12px;
      background-color: #eaeaea;
    }
  }
  li {
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
        background-color: rgba(0, 123, 255, .25);
      }
    }
  }
  .flag {
    position: static;
    max-width: 35px;
  }
</style>
