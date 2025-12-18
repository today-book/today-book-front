import { createSnowflakes, preventDoubleTapZoom } from "../modules/common.js";
import config from "../config.js";
import { isLoggedIn } from "../modules/login.js";
import {
  deleteBookshelfById,
  getBookshelfAll,
  syncGuestBookshelf
} from "../api/bookshelf.js";
import {
  getGuestBookshelf,
  toggleGuestBookshelf,
} from "../modules/bookshelf-guest.js";
import { log } from "../api/client.js";

document.addEventListener("DOMContentLoaded", async () => {
  createSnowflakes();
  preventDoubleTapZoom();

  const bookshelfGrid = document.getElementById("bookshelfGrid");
  const emptyState = document.getElementById("emptyState");
  const backArrowBtn = document.getElementById("backArrowBtn");
  const goHomeBtn = document.getElementById("goHomeBtn");
  const guestWarning = document.getElementById("guestWarning");

  if (guestWarning) {
    guestWarning.classList.toggle("hidden", isLoggedIn());
  }

  if (backArrowBtn) {
    backArrowBtn.addEventListener("click", () => {
      history.back();
    });
  }

  if (goHomeBtn) {
    goHomeBtn.addEventListener("click", () => {
      location.href = `${config.BASE_PATH}`;
    });
  }

  const guestBooks = getGuestBookshelf();

  if (isLoggedIn() && Array.isArray(guestBooks) && guestBooks.length > 0) {
    if (confirm('임시 저장된 도서를 내 책장에 저장하시겠습니까?')) {
      try {
        await syncGuestBookshelf();
      } catch (e) {
        alert('동기화에 실패하였습니다.');
      }
    }
  }

  await loadBooks();

  async function loadBooks() {
    let books = [];

    try {
      if (isLoggedIn()) {
        books = await getBookshelfAll();
      } else {
        const guestData = getGuestBookshelf();
        books = Array.isArray(guestData) ? guestData : [];
      }
    } catch (e) {
      console.error("Failed to load bookshelf", e);
    }

    log("books: ", books);
    renderBooks(books);
  }

  function renderBooks(books) {
    // Clear existing (except emptyState)
    const items = bookshelfGrid.querySelectorAll(".bookshelf-item");
    items.forEach((item) => item.remove());

    if (!books || books.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    const loggedIn = isLoggedIn();
    books.forEach((book) => {
      const bookObj = loggedIn ? book.snapshot : book;

      if (!bookObj) {
        console.warn('[Bookshelf] invalid book', book);
        return;
      }

      const card = document.createElement("div");
      card.className = "bookshelf-item";

      card.innerHTML = `
                <div class="book-image-container">
                    <img src="${bookObj.thumbnail || ""}" alt="${
        bookObj.title
      }" class="book-image" style="width: 70px; border-radius: 12px;" />
                </div>
                <div class="book-info" style="flex: 1;">
                    <h3 style="font-size: 16px; margin-bottom: 4px; color: var(--text-primary); font-weight: 700;">${
                      bookObj.title
                    }</h3>
                    <p class="author" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">${
                      bookObj.author
                    }</p>
                    <div class="reason-preview line-clamp-3" style="font-size: 12px; color: var(--text-tertiary); line-height: 1.5;">
                        ${bookObj.reason ? `추천: ${bookObj.reason}` : ""}
                    </div>
                </div>
                <button class="delete-btn" data-id="${
                  loggedIn ? book.id : null
                }" style="position: static; margin-left: 8px;">✕</button>
            `;

      card.querySelector(".delete-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        if (confirm("이 책을 책장에서 삭제할까요?")) {
          try {
            if (isLoggedIn()) {
              const id = card.querySelector(".delete-btn").dataset.id;
              await deleteBookshelfById(id);
            } else {
              toggleGuestBookshelf(bookObj, false);
            }
            await loadBooks();
          } catch (err) {
            alert("삭제에 실패했습니다.");
          }
        }
      });

      card.addEventListener("click", () => {
        // Prepare data for result page
        const resultData = {
          title: bookObj.title,
          author: bookObj.author,
          publisher: bookObj.publisher,
          thumbnail: bookObj.thumbnail,
          description: bookObj.description,
          reason: bookObj.reason,
        };
        sessionStorage.setItem(
          "recommendation:primary",
          JSON.stringify(resultData)
        );
        sessionStorage.setItem("recommendation:others", JSON.stringify([]));
        location.href = `${config.BASE_PATH}/result`;
      });

      bookshelfGrid.appendChild(card);
    });
  }
});
