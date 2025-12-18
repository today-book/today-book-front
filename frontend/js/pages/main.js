import config from '../config.js';
import { createSnowflakes, preventDoubleTapZoom } from '../modules/common.js';
import { recommend } from "../api/recommend.js";
import { handleKakaoLogin, isLoggedIn } from "../modules/login.js";
import { init } from "../api/init.js";
import { initNavigation } from "../modules/menu.js";

document.addEventListener('DOMContentLoaded', async () => {
  await init();
  initNavigation();

  createSnowflakes();
  preventDoubleTapZoom();

  const moodInput = document.getElementById('moodInput');
  const keywordsGrid = document.getElementById('keywordsGrid');
  const recommendBtn = document.getElementById('recommendBtn');
  // 카카오 로그인
  // (initNavigation에서 처리됨)

  // 로그인 실패 알림
  const loginResult = new URLSearchParams(location.search).get('login');
  if (loginResult === 'failed') alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');

  // 키워드 멀티 선택
  let selectedKeywords = [];

  keywordsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.keyword-btn');
    if (!btn) return;

    const keyword = btn.dataset.keyword;
    const active = btn.classList.toggle('active');

    if (active) selectedKeywords.push(keyword);
    else selectedKeywords = selectedKeywords.filter((k) => k !== keyword);

    if (window.navigator?.vibrate) window.navigator.vibrate(10);
  });

  // 추천
  recommendBtn.addEventListener('click', async () => {
    const query = moodInput.value.trim();

    if (selectedKeywords.length === 0) {
      alert('기분 키워드를 선택해 주세요 😊');
      return;
    }

    recommendBtn.innerHTML = '<span class="loading"></span> 추천 중...';
    recommendBtn.disabled = true;

    try {
      const books = await recommend(query, selectedKeywords);

      sessionStorage.setItem('recommendation:primary', JSON.stringify(books[0] ?? null));
      sessionStorage.setItem('recommendation:others', JSON.stringify(books.slice(1)));

      location.href = `${config.BASE_PATH}/result`;
    } catch (err) {
      console.error(err);
      alert('추천 중 문제가 발생했습니다 😢');
    } finally {
      recommendBtn.innerHTML = '책 추천받기';
      recommendBtn.disabled = false;
    }
  });

  // 엔터로 추천
  moodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') recommendBtn.click();
  });
});