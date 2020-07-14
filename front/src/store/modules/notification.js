export default {
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
}
