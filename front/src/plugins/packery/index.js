import Packery from './packery';

export default {
  install(Vue, options) {

    let packery = new Packery();

    Vue.prototype.$packery = packery;

    Vue.directive('packery', {
      bind(el, binding) {
        packery.init(el, binding.value);
      },
      unbind() {
        packery.destroy();
      }
    });

    Vue.directive('packery-item', {
      bind(el) {
        packery.addItem(el, true);
      },
      unbind(el) {
        packery.removeItem(el);
      }
    });

  }
}
