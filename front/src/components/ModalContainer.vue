<template>
  <div class="modal-wrapper">
    <div class="modal-container">
      <div class="modal-header"></div>
      <div class="modal-body">
        <component :is="component"></component>
      </div>
      <div class="modal-footer"></div>
    </div>
  </div>
</template>

<script>
  import popup from "./popup";
  export default {
    name: "ModalContainer",
    components: {popup},
    data() {
      return {
        component: null
      }
    },
    created() {
      this.$modal.container = this;
    },
    methods: {
      show(component) {
        this.component = component;
      }
    }
  }
</script>

<style scoped>
  .modal-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #676767a8;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
