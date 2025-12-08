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

// Sample book data for recommendations
const bookDatabase = {
  '행복한': {
    title: '작은 것들의 신',
    author: '아룬다티 로이',
    publisher: '문학동네 | 2016.03.21',
    image: 'book_happy',
    reason: '따뜻하고 행복한 순간들을 아름답게 그려낸 소설입니다. 인도의 작은 마을을 배경으로 한 가족 이야기가 당신의 마음을 환하게 밝혀줄 거예요. 크리스마스에 어울리는 따뜻한 감동을 선사합니다.'
  },
  '설레는': {
    title: '노르웨이의 숲',
    author: '무라카미 하루키',
    publisher: '민음사 | 2017.12.22',
    image: 'book_exciting',
    reason: '청춘의 설렘과 사랑을 섬세하게 담아낸 작품입니다. 겨울 숲속을 배경으로 한 이야기가 당신의 가슴을 두근거리게 할 거예요. 눈 내리는 크리스마스와 완벽하게 어울리는 낭만적인 소설입니다.'
  },
  '우울한': {
    title: '달러구트 꿈 백화점',
    author: '이미예',
    publisher: '팩토리나인 | 2020.07.08',
    image: 'book_sad',
    reason: '우울한 마음을 어루만져줄 따뜻하고 환상적인 이야기입니다. 꿈을 파는 백화점이라는 독특한 설정이 당신을 위로하고, 희망의 메시지를 전해줄 거예요. 크리스마스의 마법 같은 분위기와 잘 어울립니다.'
  },
  '외로운': {
    title: '미드나잇 라이브러리',
    author: '매트 헤이그',
    publisher: '인플루엔셜 | 2021.03.31',
    image: 'book_lonely',
    reason: '외로움 속에서 자신을 찾아가는 감동적인 여정을 그립니다. 무한한 가능성의 도서관이라는 환상적인 설정이 당신에게 새로운 희망을 줄 거예요. 겨울밤 혼자 책을 읽기에 완벽한 선택입니다.'
  },
  '화난': {
    title: '죄와 벌',
    author: '표도르 도스토옙스키',
    publisher: '열린책들 | 2009.05.15',
    image: 'book_angry',
    reason: '강렬한 감정과 깊은 성찰을 담은 고전 명작입니다. 주인공의 내적 갈등과 회복의 과정이 당신의 분노를 승화시키고 카타르시스를 선사할 거예요. 묵직한 울림이 있는 겨울 독서에 적합합니다.'
  },
  '평온한': {
    title: '채식주의자',
    author: '한강',
    publisher: '창비 | 2007.10.31',
    image: 'book_peaceful',
    reason: '고요하면서도 강렬한 문학적 아름다움을 지닌 작품입니다. 평온한 당신의 마음에 깊은 사색의 시간을 선물할 거예요. 조용한 크리스마스 저녁, 차 한 잔과 함께 읽기 좋습니다.'
  },
  '지친': {
    title: '코스모스',
    author: '칼 세이건',
    publisher: '사이언스북스 | 2006.12.20',
    image: 'book_tired',
    reason: '광활한 우주의 이야기가 일상의 피로를 잊게 해줍니다. 별들의 이야기를 통해 새로운 관점과 영감을 얻을 수 있어요. 크리스마스 밤하늘의 별을 보며 읽으면 더욱 특별한 경험이 됩니다.'
  },
  '호기심': {
    title: '사피엔스',
    author: '유발 하라리',
    publisher: '김영사 | 2015.11.10',
    image: 'book_curious',
    reason: '인류의 역사를 새로운 시각으로 탐험하는 지적 모험입니다. 호기심 가득한 당신의 갈증을 해소하고 세상을 보는 눈을 넓혀줄 거예요. 연말에 한 해를 돌아보며 읽기 좋은 책입니다.'
  },
  '로맨틱한': {
    title: '오만과 편견',
    author: '제인 오스틴',
    publisher: '민음사 | 2003.02.20',
    image: 'book_romantic',
    reason: '역사상 가장 로맨틱한 사랑 이야기 중 하나입니다. 겨울 영국의 저택에서 펼쳐지는 설렘 가득한 로맨스가 크리스마스 분위기와 완벽하게 어울려요. 따뜻한 담요를 덮고 읽으면 더욱 좋습니다.'
  },
  '모험적인': {
    title: '반지의 제왕',
    author: 'J.R.R. 톨킨',
    publisher: '황금가지 | 2001.10.08',
    image: 'book_adventure',
    reason: '장대한 판타지 모험이 당신을 기다립니다. 눈 덮인 산맥과 마법의 숲을 여행하는 이야기가 겨울의 모험심을 자극할 거예요. 크리스마스 연휴에 푹 빠져들기 완벽한 대작입니다.'
  },
  '따뜻한': {
    title: '빨강머리 앤',
    author: '루시 모드 몽고메리',
    publisher: '시공주니어 | 2002.08.25',
    image: 'book_warm',
    reason: '따뜻한 마음과 순수한 감성이 가득한 고전입니다. 앤의 밝고 긍정적인 이야기가 크리스마스의 온기를 더해줄 거예요. 온 가족이 함께 읽으며 행복을 나누기 좋은 책입니다.'
  },
  '긴장된': {
    title: '살인자의 기억법',
    author: '김영하',
    publisher: '문학동네 | 2013.07.05',
    image: 'book_tense',
    reason: '긴장감 넘치는 스릴러가 당신의 심장을 두근거리게 합니다. 치밀한 구성과 반전이 가득한 이야기로 긴장감을 해소할 수 있어요. 긴 겨울밤 단숨에 읽어내려가게 되는 흡입력이 있습니다.'
  }
};

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

    // ✅ 배열 / 단일 객체 모두 대응
    const book = Array.isArray(data) ? data[0] : data;

    displayBookRecommendation(book, selectedKeywords.length ? selectedKeywords : [input]);

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
async function displayBookRecommendation(book, selectedMoods = []) {
  document.getElementById('bookTitle').textContent = book.title;
  document.getElementById('bookAuthor').textContent = book.author;
  document.getElementById('bookPublisher').textContent = book.publisher;
  document.getElementById('recommendationText').textContent = book.reason;

  // Set book image (will be generated)
  const bookImage = document.getElementById('bookImage');
  bookImage.alt = book.title;

  // Generate a placeholder image URL (in a real app, this would come from an API)
  // For now, we'll use a data URL with a colored rectangle
  bookImage.src = generateBookCoverPlaceholder(book.title);
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


