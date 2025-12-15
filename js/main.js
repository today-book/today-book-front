// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  createSnowflakes();
  preventDoubleTapZoom();

  const moodInput = document.getElementById('moodInput');
  const keywordsGrid = document.getElementById('keywordsGrid');
  const recommendBtn = document.getElementById('recommendBtn');
  const kakaoLoginMain = document.getElementById('kakaoLoginMain');

  let selectedKeywords = [];

  // 로그인 UI
  kakaoLoginMain.classList.toggle('hidden', isLoggedIn());

  // 키워드 멀티 선택
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
    const input = moodInput.value.trim();

    if (selectedKeywords.length === 0) {
      alert('기분 키워드를 선택해 주세요 😊');
      return;
    }

    const params = new URLSearchParams();
    if (input) params.append('query', input);
    selectedKeywords.forEach((emotion) => params.append('emotions', emotion));

    recommendBtn.innerHTML = '<span class="loading"></span> 추천 중...';
    recommendBtn.disabled = true;

    try {
      const res = await fetch(`https://dev-api.todaybook.life/api/v1/search/books?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Search API 호출 실패');

      const data = await res.json();
      const books = Array.isArray(data) ? data : [data];

      sessionStorage.setItem('recommendation:primary', JSON.stringify(books[0] ?? null));
      sessionStorage.setItem('recommendation:others', JSON.stringify(books.slice(1)));

      // ✅ result 폴더로 이동
      location.href = `${BASE_PATH}/result`;
    } catch (err) {
      console.error(err);
      alert('추천 중 문제가 발생했습니다 😢');
    } finally {
      recommendBtn.innerHTML = '🎁 책 추천받기';
      recommendBtn.disabled = false;
    }
  });

  // 엔터로 추천
  moodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') recommendBtn.click();
  });

  // 카카오 로그인
  kakaoLoginMain.addEventListener('click', handleKakaoLogin);

  // 로그인 실패 알림
  const loginResult = new URLSearchParams(location.search).get('login');
  if (loginResult === 'failed') alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
});
