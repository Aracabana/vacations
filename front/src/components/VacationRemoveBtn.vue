<template>
  <button class="btn" @click.stop="remove">
    <i class="fas fa-trash-alt text-danger"></i>
  </button>
</template>

<script>
  import { mapActions } from 'vuex';
  import {eventBus} from "../main";

  export default {
    name: "VacationRemoveBtn",
    props: ['vacationId'],
    methods: {
      ...mapActions(['removeVacation']),
      async remove() {
        const bool = confirm("Вы действительно хотите удалить отпуск?");
        if (bool) {
          eventBus.$emit('loading', true);
          await this.removeVacation(this.vacationId);
          eventBus.$emit('loading', false);
        }
      }
    }
  }
</script>

<style scoped>

</style>
