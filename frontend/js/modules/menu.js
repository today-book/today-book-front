import config from '../config.js';
import { isLoggedIn } from './login.js';
import { logout } from "../api/auth.js";

export function initNavigation() {
    const bookshelfNavBtn = document.getElementById('bookshelfNavBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (bookshelfNavBtn) {
        bookshelfNavBtn.addEventListener('click', () => {
            location.href = `${config.BASE_PATH}/bookshelf`;
        });
    }

    if (logoutBtn) {
        const loggedIn = isLoggedIn();
        logoutBtn.classList.toggle('hidden', !loggedIn);
        logoutBtn.addEventListener('click', logout);
    }
}
