function isGuestBookshelf(bookId) {
  const books = getGuestBookshelf();
  return books.includes(bookId);
}

function getGuestBookshelf() {
  return JSON.parse(localStorage.getItem('guest:bookshelf') || '[]');
}

function setGuestBookshelf(book) {
  const userbook = {
    userId: null,
    bookId: book.bookId,
    book: JSON.stringify(book),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  localStorage.setItem('guest:bookshelf', JSON.stringify(userbook));
}

function toggleGuestBookshelf(bookId, active) {
  try {
    let books = getGuestBookshelf();

    if (active) {
      if (!books.includes(bookId)) {
        books.push(bookId);
      }
    } else {
      books = books.filter((item) => item !== bookId);
    }

    setGuestBookshelf(books);
  } catch (e) {
    console.error('wishlist(session) 저장 실패', e);
  }
}

export { isGuestBookshelf, setGuestBookshelf, getGuestBookshelf, toggleGuestBookshelf }