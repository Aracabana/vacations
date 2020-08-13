import Modal from './modal';

export default {
  install(Vue, options) {
    if (Vue.prototype.$modal) {
      return
    }
    Vue.prototype.$modal = new Modal(Vue, options);
  }
}
