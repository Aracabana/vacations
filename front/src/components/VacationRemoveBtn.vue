<template>
  <button class="btn" @click.stop="remove">
    <i class="fas fa-trash-alt text-danger"></i>
  </button>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex';
  export default {
    name: "VacationRemoveBtn",
    props: ['vacationId'],
    methods: {
      ...mapActions(['removeVacation']),
      ...mapMutations(['updateSpinner']),
      async remove() {
        const bool = confirm("Вы действительно хотите удалить отпуск?");
        if (bool) {
          this.updateSpinner(true);
          await this.removeVacation(this.vacationId);
          this.updateSpinner(false);
        }
      }
    }
  }
</script>

<style scoped>

</style>
