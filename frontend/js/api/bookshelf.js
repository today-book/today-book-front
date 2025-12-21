import { api } from "./client.js";
import { getGuestBookshelf } from "../modules/bookshelf-guest.js";
import { toAddBookshelfRequest, toBookshelfResponse } from "./dto.js";

async function addBookshelf(book) {
  const res = await api(`/api/v1/users/bookshelf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toAddBookshelfRequest(book))
  });

  if (!res.ok) {
    throw new Error();
  }
}

async function addBookshelfAll(books = []) {
  if (books.length === 0) return;

  const body = books.map(book => toAddBookshelfRequest(book));

  const res = await api(`/api/v1/users/bookshelf/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error();
  }
}

async function deleteBookshelfById(id) {
  const res = await api(`/api/v1/users/bookshelf/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error();
  }
}

async function deleteBookshelfByBookId(bookId) {
  const res = await api(`/api/v1/users/bookshelf/book/${bookId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error();
  }
}

async function getBookshelfById(id) {
  const res = await api(`/api/v1/users/bookshelf/${id}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error();
  }

  const data = await res.json();
  return toBookshelfResponse(data);
}

async function getBookshelfAll() {
  const res = await api(`/api/v1/users/bookshelf`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error();
  }

  const data = await res.json();
  return data.map((item) => toBookshelfResponse(item));
}

async function isBookshelf(bookId) {
  const res = await api(`/api/v1/users/bookshelf/saved/${bookId}`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error();
  }

  const data = await res.json();
  return Boolean(data);
}

async function toggleBookshelf(book, active) {
  try {
    if (active) {
      await addBookshelf(book);
    } else {
      await deleteBookshelfByBookId(book.bookId);
    }
  } catch (e) {}
}

async function syncGuestBookshelf() {
  const books = getGuestBookshelf();
  if (books.length === 0) return;

  await addBookshelfAll(books);

  localStorage.removeItem('guest:bookshelf');
}

export { addBookshelf, addBookshelfAll, deleteBookshelfById, deleteBookshelfByBookId, getBookshelfById, getBookshelfAll, toggleBookshelf, isBookshelf }