<template>
  <button class="btn" @click.stop="openModal()">
    <i class="fas fa-pen text-warning"></i>
  </button>
</template>

<script>
  import VacationEditPopup from './VacationEditPopup';
  export default {
    name: "VacationEditBtn",
    props: ['vacation'],
    methods: {
      openModal() {
        this.$modal.show(
          VacationEditPopup,
          {vacation: this.vacation},
          {header: this.vacation.countryName}
          );
      }
    }
  }
</script>

<style scoped>

</style>
