<template>
  <div class="alert" :class="getNotification.ok ? 'alert-success' : 'alert-danger'">
    {{getNotification.caption}}
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';
  export default {
    name: 'Notification',
    computed: mapGetters(['getNotification']),
    methods: mapMutations(['updateNotification']),
    mounted() {
      setTimeout(() => {
        this.updateNotification(null)
      }, 10000);
    }
  }
</script>

<style scoped>

</style>
