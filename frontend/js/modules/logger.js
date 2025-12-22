import config from "../config.js";

const isDev = config.PROFILE === 'dev';

function debug(prefix, message) {
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

export { debug, logResponse, logRequest }