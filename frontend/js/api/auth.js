import config from '../config.js';

async function logout() {
  await fetch(
      new URL('/auth/v1/logout', config.API_BASE_URL),
      {
        method: 'POST',
        credentials: 'include'
      }
  );

  sessionStorage.removeItem('access_token');

  location.replace(`${config.BASE_PATH}`);
}

async function refreshAccessToken() {
  const res = await fetch(
      new URL('/auth/v1/refresh', config.API_BASE_URL),
      {
        method: 'POST',
        credentials: 'include'
      }
  );

  if (!res.ok) {
    throw new Error('refresh failed');
  }

  const data = await res.json();
  return data.accessToken;
}

export { logout, refreshAccessToken }