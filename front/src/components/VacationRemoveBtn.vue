<template>
  <button class="btn" @click.stop="remove">
    <i class="fas fa-trash-alt text-danger"></i>
  </button>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    name: "VacationRemoveBtn",
    props: ['vacationId'],
    methods: {
      ...mapActions(['removeVacation']),
      remove() {
        const bool = confirm("Вы действительно хотите удалить запись?");
        if (bool) {
          // spinner.hidden = false;
          this.removeVacation(this.vacationId);
          // spinner.hidden = true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
