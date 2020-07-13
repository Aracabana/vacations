export default async function request(url, method = 'GET', data = null) {
  const headers = {};
  const credentials = 'include';
  let body;

  if (data) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  const response = await fetch(process.env.VUE_APP_SERVER_URL + url, {method, headers, credentials, body});

  // if (response.redirected) {
  //   window.location.href = response.url;
  //   return;
  // }

  return await response.json();
}
