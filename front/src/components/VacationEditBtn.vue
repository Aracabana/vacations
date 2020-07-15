<template>
  <button class="btn" @click.stop="showEditPopup">
    <i class="fas fa-pen text-warning"></i>
  </button>
</template>

<script>
  import { mapMutations } from 'vuex';
  export default {
    name: "VacationEditBtn",
    props: ['vacation'],
    methods: {
      ...mapMutations(['updatePopup']),
      showEditPopup() {
        this.updatePopup(this.vacation)
      }
    }
  }
</script>

<style scoped>

</style>
