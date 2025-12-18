import config from '../config.js';
import { refreshAccessToken } from "./auth.js";

let isRefreshing = false; // 중복 실행 방지
let retryQueue = [];      // 토큰 재발급 동안 대기할 함수 목록

function buildUrl(path) {
  return new URL(path, config.API_BASE_URL).toString();
}

function log(prefix, message) {
  if (config.PROFILE !== 'dev') return;

  console.log('[DEV] ', prefix, message);
}

function logRequest(method, url, body) {
  if (config.PROFILE !== 'dev') return;

  console.log('[REQUEST]', method, url, body);
}

async function logResponse(url, res) {
  if (config.PROFILE !== 'dev') return;

  try {
    const contentType = res.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const data = await res.clone().json();
      console.log('[RESPONSE][JSON]', url, data);
    } else {
      const text = await res.clone().text();
      console.log('[RESPONSE][TEXT]', url, text);
    }
  } catch (e) {
    console.warn('[RESPONSE][FAILED]', url);
  }
}

async function logError(url, res) {
  if (config.PROFILE !== 'dev') return;

  let data = null;

  try {
    data = await res.clone().json();
  } catch {
    data = await res.clone().text();
  }

  console.error('[ERROR]', {
    url,
    status: res.status,
    data,
  });
}

async function api(url, options = {}) {
  const accessToken = sessionStorage.getItem("access_token");

  logRequest(options.method, url, options.body);

  const res = await fetch(buildUrl(url), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  if (res.status === 401) {
    return handle401(url, options);
  }

  if (!res.ok) {
    await logError(url, res);
  }

  logResponse(url, res);
  return res;
}

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

export { api, log }