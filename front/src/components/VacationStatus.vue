<template>
  <span
    class="badge"
    :class="'badge-' + status.class"
  >
    {{status.text}}
  </span>
</template>

<script>
  export default {
    name: "VacationStatus",
    props: ['status']
  }
</script>

<style scoped>

</style>
