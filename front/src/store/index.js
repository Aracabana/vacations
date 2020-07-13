import Vue from 'vue'
import Vuex from 'vuex'
import vacations from './modules/vacations';

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {},
  state: {
    notification: null
  },
  mutations: {
    updateNotification(state, notification) {
      state.notification = notification;
    }
  },
  getters: {
    getNotification(state) {
      return state.notification;
    }
  },
  modules: {
    vacations
  }
})
