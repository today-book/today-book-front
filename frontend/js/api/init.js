import { refreshAccessToken } from "./auth.js";

async function init() {
  try {
    if(!sessionStorage.getItem('access_token')) {
      const accessToken = await refreshAccessToken();
      sessionStorage.setItem('access_token', accessToken);
    }
  } catch {
    sessionStorage.removeItem('access_token');
    return false;
  }
}

export { init }