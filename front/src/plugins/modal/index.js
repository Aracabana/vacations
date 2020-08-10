import Modal from './modal';

export default {
  install(Vue, options) {
    if (Vue.prototype.$modal) {
      return
    }

    const modal = new Modal(Vue, options);

    Object.defineProperty(Vue.prototype, '$modal', {
      get() {
        const caller = this;
        if (!modal.root) {
          // modal.setContainer(caller.$root, Vue);
        }
        return modal;
      }
    });

  }
}
