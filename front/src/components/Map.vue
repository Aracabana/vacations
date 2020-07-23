<template>
  <div class="map-wrapper">
    <l-map
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="getSelectedCountry.latlng"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
<!--      <l-geo-json :geojson="geojson"></l-geo-json>-->
    </l-map>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
  import request from '../utils/request';

  export default {
    name: "Map",
    components: {
      LMap,
      LTileLayer,
      LMarker,
    },
    data () {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 3,
        bounds: null
      };
    },
    computed: mapGetters(['getSelectedCountry']),
    methods: {
      zoomUpdated (zoom) {
        this.zoom = zoom;
      },
      centerUpdated (center) {
        this.center = center;
      },
      boundsUpdated (bounds) {
        this.bounds = bounds;
      }
    },
    async created() {
      console.log(this.getSelectedCountry.isoAlpha3);
      const countryPolygon = await request(`/api/getGeoJSON?countryCode=${this.getSelectedCountry.isoAplha3.toUpperCase()}`);
      console.log(countryPolygon)
    },
    watch: {

    }
  }
</script>

<style scoped>
  @import '~leaflet/dist/leaflet.css';
  .map-wrapper {
    margin-top: 32px;
    height: 300px;
  }
</style>
