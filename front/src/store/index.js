import Vue from 'vue'
import Vuex from 'vuex'
import vacations from './modules/vacations';
import notification from './modules/notification';
import spinner from './modules/spinner';
import user from './modules/user';
import vacationEditPopup from './modules/vacationEditPopup';

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {},
  state: {},
  mutations: {},
  getters: {},
  modules: {
    notification, spinner, vacations, vacationEditPopup, user
  }
})
