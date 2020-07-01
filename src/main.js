import Vue from 'vue';
import Vuelidate from 'vuelidate';
import App from './App.vue';
import Router from './router';

Vue.config.productionTip = false;
Vue.use(Vuelidate);

new Vue({
  router: Router,
  render: h => h(App),
}).$mount('#app')
