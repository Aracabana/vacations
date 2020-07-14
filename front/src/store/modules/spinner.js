export default {
  actions: {},
  state: {
    spinner: false
  },
  mutations: {
    updateSpinner(state, value) {
      state.spinner = value;
    }
  },
  getters: {
    getSpinner(state) {
      return state.spinner;
    }
  },
}
