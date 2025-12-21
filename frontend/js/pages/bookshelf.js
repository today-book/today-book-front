import { createSnowflakes, preventDoubleTapZoom } from "../modules/common.js";
import config from "../config.js";
import { isLoggedIn } from "../modules/login.js";
import { deleteBookshelfByBookId, getBookshelfAll } from "../api/bookshelf.js";
import {
  getGuestBookshelf,
  toggleGuestBookshelf,
} from "../modules/bookshelf-guest.js";

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

    books.forEach((book) => {
      const bookObj =
        typeof book.book === "string" ? JSON.parse(book.book) : book;
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
                        ${
                          bookObj.recommendationReason ||
                          "추천: " + bookObj.reason ||
                          ""
                        }
                    </div>
                </div>
                <button class="delete-btn" data-book-id="${
                  bookObj.bookId
                }" style="position: static; margin-left: 8px;">✕</button>
            `;

      card.querySelector(".delete-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        const bookId = card.querySelector(".delete-btn").dataset.bookId;
        if (confirm("이 책을 책장에서 삭제할까요?")) {
          try {
            if (isLoggedIn()) {
              await deleteBookshelfByBookId(bookId);
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

  await loadBooks();
});
