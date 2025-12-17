import { refreshAccessToken } from "./auth";

async function init() {
  try {
    const accessToken = await refreshAccessToken();
    sessionStorage.setItem('access_token', accessToken);
  } catch {
    sessionStorage.removeItem('access_token');
    return false;
  }
}

export { init }