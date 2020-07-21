import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App.vue'
import Router from './router'
import Store from './store'
export const eventBus = new Vue();

Vue.config.productionTip = false
Vue.use(Vuelidate);

new Vue({
  store: Store,
  router: Router,
  render: h => h(App)
}).$mount('#app')
