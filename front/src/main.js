import Vue from 'vue'
import App from './App.vue'
import Store from './store'
import Router from './router'
import Vuelidate from 'vuelidate'
import DateFormatter from './plugins/dateFormatter'
import Modal from './plugins/modal';
import Packery from './plugins/packery';

export const eventBus = new Vue();

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(Modal);
Vue.use(Packery);
Vue.use(DateFormatter, {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});

new Vue({
  store: Store,
  router: Router,
  render: h => h(App)
}).$mount('#app')

