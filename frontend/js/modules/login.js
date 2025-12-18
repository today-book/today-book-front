import config from "../config.js";

function isLoggedIn() {
  return !!sessionStorage.getItem("access_token");
}

function handleKakaoLogin() {
  sessionStorage.setItem("redirectURL", location.pathname + location.search);
  window.location.href = `${config.API_BASE_URL}/oauth2/authorization/kakao`;
}

export { isLoggedIn, handleKakaoLogin };
