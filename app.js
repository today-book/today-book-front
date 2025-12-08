// Snowfall Effect
function createSnowflakes() {
  const snowflakesContainer = document.getElementById('snowflakes');
  const snowflakeCount = 50;

  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    snowflakesContainer.appendChild(snowflake);
  }
}

// State
let selectedKeywords = [];
let currentMood = '';

// DOM Elements
const mainPage = document.getElementById('mainPage');
const resultPage = document.getElementById('resultPage');
const moodInput = document.getElementById('moodInput');
const keywordsGrid = document.getElementById('keywordsGrid');
const recommendBtn = document.getElementById('recommendBtn');
const backBtn = document.getElementById('backBtn');
const kakaoLoginMain = document.getElementById('kakaoLoginMain');
const kakaoLoginResult = document.getElementById('kakaoLoginResult');
const saveBtn = document.getElementById('saveBtn');
const wishlistBtn = document.getElementById('wishlistBtn');

// Login
const isLoggedIn = !!localStorage.getItem('accessToken');

// Keyword Selection - Now supports multiple selections
keywordsGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('keyword-btn')) {
    const keyword = e.target.dataset.keyword;

    // Toggle selection - Multiple selections allowed
    if (e.target.classList.contains('active')) {
      e.target.classList.remove('active');
      selectedKeywords = selectedKeywords.filter(k => k !== keyword);
    } else {
      selectedKeywords.push(keyword);
      e.target.classList.add('active');
    }

    // Add haptic feedback on mobile
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  }
});

// Recommend Button Click
recommendBtn.addEventListener('click', async () => {
  const input = moodInput.value.trim();

  if (selectedKeywords.length === 0 && !input) {
    alert('상황이나 키워드를 입력해주세요 🙂');
    return;
  }

  // ✅ query 하나로 통합
  const query = [
    input,
    ...selectedKeywords
  ].filter(Boolean).join(' ');

  recommendBtn.innerHTML = '<span class="loading"></span> 추천 중...';
  recommendBtn.disabled = true;

  try {
    const response = await fetch(
        `http://localhost:8080/api/v1/search/books?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
    );

    if (!response.ok) {
      throw new Error('Search API 호출 실패');
    }

    const data = await response.json();
    console.log(data);

    // ✅ 배열 / 단일 객체 모두 대응
    const recommendedBooks = Array.isArray(data) ? data : [data];
    displayBookRecommendation(recommendedBooks[0]);
    renderBookSlider(recommendedBooks.slice(1));

    // ✅ 화면 전환
    mainPage.classList.add('hidden');
    resultPage.classList.remove('hidden');
    window.scrollTo(0, 0);

  } catch (error) {
    console.error(error);
    alert('추천 중 문제가 발생했습니다 😢');
  } finally {
    recommendBtn.innerHTML = '🎁 책 추천받기';
    recommendBtn.disabled = false;
  }
});

// Display book recommendation
async function displayBookRecommendation(book) {
  document.getElementById('bookTitle').textContent = book.title;
  document.getElementById('bookAuthor').textContent = book.author;
  document.getElementById('bookPublisher').textContent = book.score;
  document.getElementById('recommendationText').textContent = book.reason;

  // Set book image (will be generated)
  const bookImage = document.getElementById('bookImage');
  bookImage.alt = book.title;

  // Generate a placeholder image URL (in a real app, this would come from an API)
  // For now, we'll use a data URL with a colored rectangle
  bookImage.src = generateBookCoverPlaceholder(book.title);

  // Wishlist 버튼 초기화 및 상태 반영 (localStorage 기반)
  if (wishlistBtn) {
    const bookKey = book.id ?? book.title;
    wishlistBtn.dataset.bookId = bookKey;
    const active = isBookWishlisted(bookKey);
    wishlistBtn.classList.toggle('active', active);
    wishlistBtn.setAttribute('aria-pressed', active);
    wishlistBtn.title = active ? '찜 해제' : '찜하기';
  }
}

// --- Wishlist (찜) 관리 (localStorage 사용) ---
function isBookWishlisted(bookKey) {
  try {
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return list.includes(bookKey);
  } catch (e) {
    return false;
  }
}

function setWishlistState(bookKey, state) {
  try {
    const list = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let next = Array.isArray(list) ? list.slice() : [];
    if (state) {
      if (!next.includes(bookKey)) next.push(bookKey);
    } else {
      next = next.filter(k => k !== bookKey);
    }
    localStorage.setItem('wishlist', JSON.stringify(next));
  } catch (e) {
    console.error('wishlist 저장 실패', e);
  }
}

// Wishlist 버튼 클릭 핸들러
if (wishlistBtn) {
  wishlistBtn.addEventListener('click', (e) => {
    const key = wishlistBtn.dataset.bookId;
    if (!key) return;

    const willBeActive = !wishlistBtn.classList.contains('active');
    setWishlistState(key, willBeActive);
    wishlistBtn.classList.toggle('active', willBeActive);
    wishlistBtn.setAttribute('aria-pressed', willBeActive);
    wishlistBtn.title = willBeActive ? '찜 해제' : '찜하기';

    // 짧은 피드백 애니메이션
    try {
      wishlistBtn.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.08)' },
        { transform: 'scale(1)' }
      ], { duration: 220 });
    } catch (err) {
      // animation 지원 안 되면 무시
    }
  });
}

async function renderBookSlider(books) {
  const slider = document.getElementById('bookSlider');
  const section = document.getElementById('sliderSection');

  if (!slider || !section) return;

  // ✅ 새 검색 시 항상 처음 위치
  slider.scrollLeft = 0;
  slider.innerHTML = '';

  if (!books || books.length === 0) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'slider-card';

    const imageUrl = book.imageUrl
        ? book.imageUrl
        : generateBookCoverPlaceholder(book.title);

    card.innerHTML = `
      <img src="${imageUrl}" alt="${book.title}" />
      <div class="info">
        <div class="title">${book.title}</div>
        <div class="author">${book.author ?? ''}</div>
      </div>
    `;

    /* ✅ 카드 클릭 → 메인 추천 교체 */
    card.addEventListener('click', () => {
      displayBookRecommendation(book);

      // UX 보정: 위로 살짝 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    slider.appendChild(card);
  });
}



// Generate book cover placeholder
function generateBookCoverPlaceholder(title) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 300, 450);
  const colors = [
    ['#C41E3A', '#8B0000'],
    ['#165B33', '#0a3d1f'],
    ['#FFD700', '#FFA500'],
    ['#2C3E50', '#34495E'],
    ['#8E44AD', '#9B59B6']
  ];
  const colorPair = colors[Math.floor(Math.random() * colors.length)];
  gradient.addColorStop(0, colorPair[0]);
  gradient.addColorStop(1, colorPair[1]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 300, 450);

  // Add decorative elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(20, 20, 260, 410);

  // Add title text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wrap text
  const words = title.split(' ');
  let line = '';
  let y = 225;
  const maxWidth = 260;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, 150, y);
      line = words[i] + ' ';
      y += 35;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 150, y);

  return canvas.toDataURL();
}

// Back Button
backBtn.addEventListener('click', () => {
  // Reset state
  selectedKeywords = [];
  currentMood = '';
  moodInput.value = '';

  document.querySelectorAll('.keyword-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Switch back to main page
  resultPage.classList.add('hidden');
  mainPage.classList.remove('hidden');

  // Scroll to top
  window.scrollTo(0, 0);
});


function handleKakaoLogin() {
  window.location.href =
      "http://localhost:8080/oauth2/authorization/kakao";
}

kakaoLoginMain.addEventListener('click', handleKakaoLogin);
kakaoLoginResult.addEventListener('click', () => {
  handleKakaoLogin();
  // In a real app, this would also save the recommendation
  alert('✨ 추천 결과가 저장되었습니다! (데모 모드)');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createSnowflakes();

  // Add enter key support for search input
  moodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      recommendBtn.click();
    }
  });
});

// Prevent zoom on double tap (mobile)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);


const loginResult = new URLSearchParams(location.search).get('login');

if (loginResult === 'failed') {
  alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
}

kakaoLoginMain
.classList.toggle('hidden', isLoggedIn);

kakaoLoginResult
.classList.toggle('hidden', isLoggedIn);

saveBtn
.classList.toggle('hidden', !isLoggedIn);


