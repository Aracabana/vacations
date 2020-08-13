<template>
  <div class="main-modal-overlay" v-if="isOpen" @click="closeHandler($event)">

    <transition name="modal-fade" @after-leave="isOpen = false">
      <div class="main-modal-container" v-if="component">
        <div class="main-modal-header">
          <span v-if="modalProps">{{modalProps.header}}</span>
          <i class="fas fa-times main-modal-close"></i>
        </div>
        <div class="main-modal-body">
          <component :is="component" :props="componentProps"></component>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>

  export default {
    name: "ModalContainer",
    data() {
      return {
        component: null,
        componentProps: null,
        modalProps: null,
        isOpen: false
      }
    },
    created() {
      this.$modal.container = this;
    },
    methods: {
      show(component, componentProps, modalProps) {
        this.isOpen = true;
        this.$nextTick(() => {
          this.componentProps = componentProps;
          this.component = component;
          this.modalProps = modalProps;
        });
      },
      closeHandler(event) {
        const target = event.target;
        const closeBtn = target.classList.contains('main-modal-close');
        const modalContainer = target.closest('.main-modal-container');
        if (closeBtn || !modalContainer) {
          this.destroyModal();
        }
      },
      destroyModal() {
        this.component = null;
      }
    }
  }
</script>

<style scoped>

  .modal-fade-enter,
  .modal-fade-leave-active {
    transform: translateX(150px);
    opacity: 0;
  }

  .modal-fade-enter-active {
    transition: all .3s ease;
  }
  .modal-fade-leave-active {
    transition: all .1s ease;
  }

  .main-modal-container {
    border-radius: 4px;
    overflow: hidden;
    background-color: white;
  }

  .main-modal-overlay {
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

  .main-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #ebebeb;
  }

  .main-modal-body {
    padding: 20px;
  }

  .main-modal-header i {
    cursor: pointer;
  }
</style>
