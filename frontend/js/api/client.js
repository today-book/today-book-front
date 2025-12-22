import config from '../config.js';
import { refreshAccessToken } from "./auth.js";
import { logRequest, logResponse } from "../modules/logger.js";

let isRefreshing = false; // 중복 실행 방지
let retryQueue = [];        // 토큰 재발급 동안 대기할 함수 목록

async function request(url, options = {}, { auth = false } = {}) {
  logRequest(options.method, url, options.body);

  const accessToken = sessionStorage.getItem("access_token");

  const res = await fetch(new URL(url, config.API_BASE_URL), {
    ...options,
    headers: {
      ...options.headers,
      ...(auth && accessToken && {
          Authorization: `Bearer ${accessToken}`,
      }),
    },
    credentials: auth ? 'include' : 'same-origin',
  });

  if (auth && res.status === 401) {
    return handle401(url, options);
  }

  await logResponse(url, res);

  return res;
}

const api = (url, options) => request(url, options, { auth: true });
const publicApi = (url, options) => request(url, options);

// unauthorized handler
async function handle401(url, options) {
  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const accessToken = await refreshAccessToken();
      sessionStorage.setItem('access_token', accessToken);

      retryQueue.forEach(cb => cb(accessToken));
      retryQueue = [];
    } catch (e) {
      retryQueue = [];
      sessionStorage.removeItem('access_token');
      location.replace(config.BASE_PATH || '/');
    } finally {
      isRefreshing = false;
    }
  }

  // 액세스 토큰 재발급 후 실행
  return new Promise(resolve => {
    retryQueue.push(async () => {
      const retry = await request(url, options, { auth: true });
      resolve(retry);
    });
  });
}

export { api, publicApi }