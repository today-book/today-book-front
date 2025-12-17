import config from "../config";

function isLoggedIn() {
  return !!sessionStorage.getItem('access_token');
}

function handleKakaoLogin() {
  window.location.href = `${config.API_BASE_URL}/oauth2/authorization/kakao`;
}

export { isLoggedIn, handleKakaoLogin }