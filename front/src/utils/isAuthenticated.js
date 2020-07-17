import request from './request';

export default async function () {
  const response = await request('/auth/checkAuth');
  return response.status;
}
