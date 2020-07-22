<template>
  <div class="continent-item">
    <p><strong>{{continent.continentName}}</strong></p>
    <ul class="list-unstyled">
      <li
        v-for="(country, index) in continent.countries"
        :key="index"
        @click="chooseCountry(country.countryName)"
      >
        <v-lazy-image
          :src="getFlag(country.isoAlpha3)"
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
    import {eventBus} from "../main";

    export default {
      name: "LazyContinentItem",
      props: ['continent', 'continentIndex'],
      components: {VLazyImage},
      data() {
        return {
          observer: null,
          intersectionOptions: {}
        }
      },
      methods: {
        ...mapActions(['increaseContinentsToShow']),
        chooseCountry(value) {
          eventBus.$emit('chooseCountry', value)
        },
        getFlag(countryCode) {
          return require(`@/assets/img/${countryCode.toLowerCase()}.svg`);
        }
      },
      // mounted() {
      //   if ("IntersectionObserver" in window) {
      //     this.observer = new IntersectionObserver((entries) => {
      //       const continentItem = entries[0];
      //       if (continentItem.isIntersecting) {
      //         this.increaseContinentsToShow(this.continentIndex + 1);
      //       }
      //     }, this.intersectionOptions);
      //     this.observer.observe(this.$el);
      //   }
      // },
      // beforeDestroy() {
      //   if ("IntersectionObserver" in window) {
      //     this.observer.disconnect();
      //   }
      // }
    }
</script>

<style scoped>
  .v-lazy-image {
    filter: blur(2px);
    transition: filter 0.3s;
  }
  .v-lazy-image-loaded {
    filter: blur(0);
  }
</style>
