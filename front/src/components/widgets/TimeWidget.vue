<template>
  <div class="time-widget-wrapper">
    <Spinner v-if="loading"></Spinner>
    <div v-else class="time-widget">
      <p class="time text-center">{{time | formatTime}}</p>
    </div>
  </div>
</template>

<script>
  import Spinner from '../common/Spinner';

  export default {
    name: "TimeWidget",
    components: {Spinner},
    data() {
      return {
        loading: true,
        interval: null,
        time: new Date()
      }
    },
    methods: {
      startTime() {
        const time = new Date();
        this.interval = setInterval(() => {
          this.time = time.setSeconds(time.getSeconds() + 1);
        }, 1000)
      }
    },
    filters: {
      formatTime(time) {
        const formatter = new Intl.DateTimeFormat(undefined, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        });
        return formatter.format(time);
      }
    },
    async mounted() {
      this.loading = false;
      this.startTime();
    },
    beforeDestroy() {
      clearInterval(this.interval);
    }
  }
</script>

<style scoped>

  .time {
    font-size: 40px;
  }

</style>
