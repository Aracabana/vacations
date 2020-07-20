import request from './request';
import store from '../store';

export default async function () {
  const response = await request('/auth/checkAuth');
  const userLogin = store.getters.getUserLogin;
  if (!userLogin && response.status) {
    store.commit('updateUser', response.user);
  }
  return response.status;
}
