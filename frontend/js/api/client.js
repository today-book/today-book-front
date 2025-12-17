import config from '../config.js';
import { refreshAccessToken } from "./auth.js";

let isRefreshing = false; // 중복 실행 방지
let retryQueue = [];        // 토큰 재발급 동안 대기할 함수 목록

function buildUrl(path) {
  return new URL(path, config.API_BASE_URL).toString();
}

async function api(url, options = {}) {
  const accessToken = sessionStorage.getItem("access_token");

  const res = await fetch(buildUrl(url), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  if (res.status !== 401) {
    return res;
  }

  return handle401(url, options);
}

// unauthorized handler
async function handle401(url, options) {
  if(!isRefreshing) {
    isRefreshing = true;

    try {
      const accessToken = await refreshAccessToken();
      sessionStorage.setItem('access_token', accessToken);

      retryQueue.forEach(cb => cb(accessToken));
      retryQueue = [];
    } catch (e) {
      sessionStorage.removeItem('access_token');
      location.replace(config.BASE_PATH || '/');
    } finally {
      isRefreshing = false;
    }
  }

  // 액세스 토큰 재발급 후 실행
  return new Promise(resolve => {
    retryQueue.push(async (accessToken) => {
      const retry = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        },

        credentials: 'include',
      });
      resolve(retry);
    });
  });
}

export { api }