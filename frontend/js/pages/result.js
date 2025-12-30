import config from "../config.js";
import { createSnowflakes, preventDoubleTapZoom } from "../modules/common.js";
import { isLoggedIn } from "../modules/login.js";
import { initNavigation } from "../modules/menu.js";
import { isBookshelf, toggleBookshelf } from "../api/bookshelf.js";
import {
  isGuestBookshelf,
  toggleGuestBookshelf,
} from "../modules/bookshelf-guest.js";
import { getShareBook, share } from "../api/share.js";
import { debug } from "../modules/logger.js";

document.addEventListener("DOMContentLoaded", async () => {
  createSnowflakes();
  preventDoubleTapZoom();
  initNavigation();

  const backBtn = document.getElementById("backBtn");
  const shareBtn = document.getElementById("kakaoShareResult");
  const wishlistBtn = document.getElementById("wishlistBtn");

  // Kakao SDK 설정
  if (window.Kakao && !Kakao.isInitialized()) {
    Kakao.init(config.KAKAO_SDK_KEY);
  }

  // 추천 결과 설정
  let primary;
  let others = [];

  const token = new URLSearchParams(location.search).get("token");
  debug("token: ", token);

  try {
    if (token) {
      primary = await getShareBook(token);
      debug("shared book: ", primary);
    } else {
      primary = JSON.parse(
          sessionStorage.getItem("recommendation:primary") || "null"
      );
      others = JSON.parse(
          sessionStorage.getItem("recommendation:others") || "[]"
      );
    }
  } catch (e) {
    console.error(e);
  }

  if (!primary) {
    location.href = `${config.BASE_PATH}/`;
    return;
  }

  await renderRecommendation(primary);
  renderBookSlider(others);

  // 홈으로 이동
  backBtn.addEventListener("click", () => {
    location.href = `${config.BASE_PATH}/`;
  });

  // 카카오톡 공유하기
  shareBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = crypto.randomUUID();
      await share(token, primary);

      const shareLink = `${window.location.origin}${config.BASE_PATH}/result?token=${token}`;

      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "오늘 뭐 읽지?",
          description:
            "지금 읽을 책을 고민 중이라면, 오늘 뭐 읽지?에서 추천 결과를 확인해보세요.",
          imageUrl: primary.thumbnail,
          link: {
            webUrl: shareLink,
            mobileWebUrl: shareLink,
          },
        },
        buttons: [
          {
            title: "추천 결과 보기",
            link: {
              webUrl: shareLink,
              mobileWebUrl: shareLink,
            },
          },
        ],
      });
    } catch (e) {
      console.error(e);
      alert("공유 중 오류가 발생했습니다.");
    }
  });

  wishlistBtn.addEventListener("click", async () => {
    wishlistBtn.disabled = true;

    try {
      const willBeActive = !wishlistBtn.classList.contains("active");

      // UI 즉시 반영
      wishlistBtn.classList.toggle("active", willBeActive);
      wishlistBtn.setAttribute("aria-pressed", willBeActive);
      wishlistBtn.title = willBeActive ? "찜 해제" : "찜하기";

      try {
        wishlistBtn.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.08)" },
            { transform: "scale(1)" },
          ],
          { duration: 220 }
        );
      } catch { }

      try {
        if (isLoggedIn()) {
          await toggleBookshelf(primary, willBeActive);
        } else {
          toggleGuestBookshelf(primary, willBeActive);
        }
      } catch (e) {
        wishlistBtn.classList.toggle("active", !willBeActive);
        wishlistBtn.setAttribute("aria-pressed", !willBeActive);
        wishlistBtn.title = !willBeActive ? "찜 해제" : "찜하기";

        alert("내 책장 저장 중 오류가 발생했습니다.");
      }
    } finally {
      wishlistBtn.disabled = false;
    }
  });

  // 추천 결과 렌더링
  async function renderRecommendation(book) {
    debug("recommendation book: ", book);

    document.getElementById("bookTitle").textContent = book.title;
    document.getElementById("bookAuthor").textContent = book.author;
    document.getElementById("bookPublisher").textContent = book.publisher;
    document.getElementById("recommendationText").textContent = book.reason;
    document.getElementById("bookDescriptionText").textContent =
      book.description;

    const bookImage = document.getElementById("bookImage");
    bookImage.alt = book.title;
    bookImage.src = book.thumbnail;

    const bookId = book.bookId;
    wishlistBtn.dataset.bookId = bookId;

    const active = await isWishlisted(bookId);

    wishlistBtn.classList.toggle("active", active);
    wishlistBtn.setAttribute("aria-pressed", active);
    wishlistBtn.title = active ? "찜 해제" : "찜하기";

    renderDescriptionToggle();
  }

  // 찜 상태 확인
  async function isWishlisted(bookId) {
    if (isLoggedIn()) {
      try {
        return await isBookshelf(bookId);
      } catch (e) {
        return false;
      }
    } else {
      return isGuestBookshelf(bookId);
    }
  }

  // 도서 소개 더보기 버튼 렌더링
  function renderDescriptionToggle() {
    const wrapper = document.getElementById("descriptionWrapper");
    const btn = document.getElementById("descriptionToggleBtn");
    const text = document.getElementById("bookDescriptionText");

    if (!wrapper || !btn || !text) return;

    // 책 바뀔 때마다 초기 상태로
    wrapper.classList.add("collapsed");
    wrapper.classList.remove("expanded");
    btn.textContent = "더보기";
    btn.setAttribute("aria-expanded", "false");

    // 리스너는 한 번만 바인딩
    if (!btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const expanded = wrapper.classList.toggle("expanded");
        wrapper.classList.toggle("collapsed", !expanded);

        btn.textContent = expanded ? "접기" : "더보기";
        btn.setAttribute("aria-expanded", String(expanded));
      });
    }

    // 렌더 이후 길이 측정 → 길 때만 버튼 노출
    requestAnimationFrame(() => {
      const isOverflowing = text.scrollHeight > wrapper.clientHeight + 4;
      btn.style.display = isOverflowing ? "inline-block" : "none";
    });
  }

  // 추천 도서 리스트 렌더링
  function renderBookSlider(books) {
    const slider = document.getElementById("bookSlider");
    const section = document.getElementById("sliderSection");
    if (!slider || !section) return;

    slider.scrollLeft = 0;
    slider.innerHTML = "";

    if (!books || books.length === 0) {
      section.classList.add("hidden");
      return;
    }
    section.classList.remove("hidden");

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "slider-card";

      const imageUrl = book.thumbnail
        ? book.thumbnail
        : generateBookCoverPlaceholder(book.title);

      card.innerHTML = `
        <img src="${imageUrl}" alt="${book.title}" />
        <div class="info">
          <div class="title">${book.title}</div>
          <div class="author">${book.author ?? ""}</div>
        </div>
      `;

      card.addEventListener("click", async () => {
        // 1️⃣ 기존 primary -> others
        others = [ primary, ...others.filter(b => b.bookId !== book.bookId && b.bookId !== primary.bookId) ];

        // 2️⃣ primary = book
        primary = book;

        // 3️⃣ 새로고침 대비용 저장
        sessionStorage.setItem("recommendation:primary", JSON.stringify(primary));
        sessionStorage.setItem("recommendation:others", JSON.stringify(others));

        // UI 갱신
        await renderRecommendation(primary);
        renderBookSlider(others);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      slider.appendChild(card);
    });
  }

  function generateBookCoverPlaceholder(title) {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 450;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 300, 450);
    const colors = [
      ["#C41E3A", "#8B0000"],
      ["#165B33", "#0a3d1f"],
      ["#FFD700", "#FFA500"],
      ["#2C3E50", "#34495E"],
      ["#8E44AD", "#9B59B6"],
    ];
    const pair = colors[Math.floor(Math.random() * colors.length)];
    gradient.addColorStop(0, pair[0]);
    gradient.addColorStop(1, pair[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 450);

    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(20, 20, 260, 410);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const words = (title || "").split(" ");
    let line = "";
    let y = 225;
    const maxWidth = 260;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        ctx.fillText(line, 150, y);
        line = words[i] + " ";
        y += 35;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 150, y);

    return canvas.toDataURL();
  }
});
