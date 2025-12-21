import config from "../config.js";
import { isLoggedIn, handleKakaoLogin } from "./login.js";
import { logout } from "../api/auth.js";

export function initNavigation() {
  const bookshelfNavBtn = document.getElementById("bookshelfNavBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const kakaoLoginMain = document.getElementById("kakaoLoginMain");
  const kakaoLoginResult = document.getElementById("kakaoLoginResult");

  const loggedIn = isLoggedIn();

  if (bookshelfNavBtn) {
    bookshelfNavBtn.addEventListener("click", () => {
      location.href = `${config.BASE_PATH}/bookshelf`;
    });
  }

  const loginBtn = kakaoLoginMain || kakaoLoginResult;
  if (loginBtn) {
    loginBtn.classList.toggle("hidden", loggedIn);
    loginBtn.addEventListener("click", handleKakaoLogin);
  }

  if (logoutBtn) {
    logoutBtn.classList.toggle("hidden", !loggedIn);
    logoutBtn.addEventListener("click", async () => {
      await logout();
      location.reload();
    });
  }
}
