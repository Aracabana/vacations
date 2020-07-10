<template>
  <div class="alert" :class="serverFeedback.ok ? 'alert-success' : 'alert-danger'">
    {{serverFeedback.caption}}
  </div>
</template>

<script>
  export default {
    name: 'ServerFeedback',
    props: ['serverFeedback'],
    methods: {
      hide() {
        setTimeout(() => {
          this.$emit('hide', undefined);
        }, 1000);
      },
    },
    mounted() {
      this.hide();
    }
  }
</script>

<style scoped>

</style>
