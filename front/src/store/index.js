import Vue from 'vue'
import Vuex from 'vuex'
import vacations from './modules/vacations';
import notification from './modules/notification';
import user from './modules/user';
import vacationEditPopup from './modules/vacationEditPopup';
import countries from './modules/countries';

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {},
  state: {},
  mutations: {},
  getters: {},
  modules: {
    notification, vacations, vacationEditPopup, user, countries
  }
})
