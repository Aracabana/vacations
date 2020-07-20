import router from '../router/index';
import store from '../store';

export default async function request(url, method = 'GET', data = null, notificationPage = 'Home') {

  // if (spinner) {
  //   store.commit('updateSpinner', true);
  // }

  const headers = {};
  const credentials = 'include';
  let body;

  if (data) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  try {
    const response = await fetch(process.env.VUE_APP_SERVER_URL + url, {method, headers, credentials, body});
    const result = await response.json();

    if (response.status === 401) {
      await router.push('/login');
      throw new Error(result.caption);
    }
    if (result.hasOwnProperty('ok') && !result.ok) {
      throw new Error(result.caption);
    }

    return result;

  } catch (err) {
    store.commit('updateNotification', {ok: false, caption: err.message, page: notificationPage});
    return false;
  } finally {
    // if (spinner) {
    //   store.commit('updateSpinner', false);
    // }
  }
}
