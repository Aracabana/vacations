import request from "../../utils/request";
import router from '../../router';

export default {
  actions: {
    async logout({commit}) {
      await request('/auth/logout', 'GET');
      commit('updateUser', {});
      await router.push('/login');
    }
  },
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
