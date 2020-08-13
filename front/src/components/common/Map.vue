<template>
  <div class="map-wrapper">
    <l-map
      v-if="geoJson"
      style="height: 100%; width: 100%"
      :zoom="zoom"
      :center="country.latlng"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      ref="map"
    >
      <l-tile-layer :url="url"/>
      <l-geo-json v-if="geoJson" :geojson="geoJson" :optionsStyle="boundsStyle" ref="geoJson"/>
    </l-map>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {LMap, LTileLayer, LMarker, LGeoJson} from 'vue2-leaflet';
  import request from '../../utils/request';

  export default {
    name: "Map",
    components: {LMap, LTileLayer, LMarker, LGeoJson},
    data () {
      return {
        country: {},
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 3,
        bounds: null,
        geoJson: null,
        boundsStyle: () => ({
          fillColor: '#FD8D3C',
          weight: 1,
          opacity: 1,
          color: 'black',
          dashArray: '4',
          fillOpacity: 0.6
        })
      };
    },
    computed: mapGetters(['getSelectedCountry']),
    methods: {
      zoomUpdated (zoom) {
        this.zoom = zoom;
      },
      zoomByBounds () {
        const map = this.$refs.map;
        const geoJsonLayer = this.$refs.geoJson;
        const bounds = geoJsonLayer.getBounds();
        map.fitBounds(bounds);
      },
      centerUpdated (center) {
        this.center = center;
      },
      boundsUpdated (bounds) {
        this.bounds = bounds;
      },
      async updateCountry(selectedCountry) {
        this.country = selectedCountry;
        const countryPolygon = await request(`/api/getGeoJSON?countryCode=${selectedCountry.isoAlpha3.toUpperCase()}`);
        if (countryPolygon) {
          this.geoJson = countryPolygon;
          setTimeout(() => this.zoomByBounds());
        }
      }
    },
    async created() {
      await this.updateCountry(this.getSelectedCountry);
    },
    watch: {
      getSelectedCountry(newVal) {
        this.updateCountry(newVal);
      }
    }
  }
</script>

<style scoped>
  @import '../../../node_modules/leaflet/dist/leaflet.css';
  .map-wrapper {
    margin-top: 32px;
    height: 300px;
  }
</style>
