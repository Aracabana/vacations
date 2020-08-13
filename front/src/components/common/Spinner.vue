<template>
  <div id="spinner" class="spinner-wrapper">
    <div class="spinner-border text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Spinner'
  }
</script>

<style lang="less" scoped>
  @import '../../assets/less/variables';
  .spinner-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 99;
    .flex();
    .flex-center();
    .align-items-center();
    background-color: #f6f6f669;
  }
</style>
