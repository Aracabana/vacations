export default {
  actions: {},
  state: {
    popup: null
  },
  mutations: {
    updatePopup(state, value) {
      state.popup = value;
    }
  },
  getters: {
    getPopup(state) {
      return state.popup;
    }
  },
}
