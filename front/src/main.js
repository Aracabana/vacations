import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Modal from './plugins/modal'
import App from './App.vue'
import Router from './router'
import Store from './store'
export const eventBus = new Vue();

Vue.config.productionTip = false
Vue.use(Vuelidate);
Vue.use(Modal);

new Vue({
  store: Store,
  router: Router,
  render: h => h(App)
}).$mount('#app')
