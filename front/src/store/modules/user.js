export default {
  actions: {},
  state: {
    user: {},
  },
  mutations: {
    updateUser(state, value) {
      state.user = value;
    }
  },
  getters: {
    getUserLogin(state) {
      return state.user.login;
    }
  },
}
