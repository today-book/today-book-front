function isGuestBookshelf(bookId) {
  const books = getGuestBookshelf();
  return books.some((item) => item.bookId === bookId);
}

function getGuestBookshelf() {
  return JSON.parse(localStorage.getItem('guest:bookshelf') || '[]');
}

function setGuestBookshelf(books = []) {
  localStorage.setItem('guest:bookshelf', JSON.stringify(books));
}

function toggleGuestBookshelf(book, active) {
  try {
    let books = getGuestBookshelf();

    const bookId = book.bookId;
    if (active) {
      if (!books.some((item) => item.bookId === bookId)) {
        books.push(book);
      }
    } else {
      books = books.filter((item) => item.bookId !== bookId);
    }

    setGuestBookshelf(books);
  } catch (e) {}
}

export { isGuestBookshelf, setGuestBookshelf, getGuestBookshelf, toggleGuestBookshelf }