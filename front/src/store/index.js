import Vue from 'vue'
import Vuex from 'vuex'
import vacations from './modules/vacations';
import notification from './modules/notification';
import user from './modules/user';
import countries from './modules/countries';
import widgets from './modules/widgets';

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {},
  state: {},
  mutations: {},
  getters: {},
  modules: {
    notification,
    vacations,
    user,
    countries,
    widgets
  }
})
