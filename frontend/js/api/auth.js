import config from '../config';

async function logout() {
  await fetch(
      new URL('/api/v1/auth/logout', config.API_BASE_URL),
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
      new URL('/api/v1/auth/refresh', config.API_BASE_URL),
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

export { refreshAccessToken }