import Vue from 'vue'
import Vuex from 'vuex'
import vacations from './modules/vacations';
import notification from './modules/notification';
import spinner from './modules/spinner';

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {},
  state: {},
  mutations: {},
  getters: {},
  modules: {
    vacations, notification, spinner
  }
})
