<template>
  <div class="alert" :class="serverFeedback.ok ? 'alert-success' : 'alert-danger'">
    {{serverFeedback.caption}}
  </div>
</template>

<script>
  export default {
    name: 'ServerFeedback',
    props: ['serverFeedback'],
    mounted() {
      setTimeout(() => {
        // this.$emit('hide');
      }, 1000);
    }
  }
</script>

<style scoped>

</style>
