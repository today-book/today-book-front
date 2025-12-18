import { api } from "./client";
import {getGuestBookshelf} from "../modules/bookshelf-guest";

function toAddBookshelfRequest(book) {
  return {
    id: book.bookId,
    isbn: book.isbn,
    title: book.title,
    author: book.author,
    description: book.description,
    categories: book.categories,
    publisher: book.publisher,
    publishedAt: book.publishedAt,
    thumbnail: book.thumbnail,
    score: book.score,
    reason: book.reason
  };
}

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

async function addAllBookshelf(books = []) {
  if (books.length === 0) return;

  const body = books.map(book => toAddBookshelfRequest(book));

  const res = await api(`/api/v1/users/bookself/all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error();
  }
}

async function deleteBookshelf(id) {
  const res = await api(`/api/v1/users/bookshelf/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error();
  }
}

async function getBookshelf() {
  const res = await api(`/api/v1/users/bookshelf`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error();
  }

  return await res.json();
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

async function syncGuestBookshelf() {
  const books = getGuestBookshelf();
  if (books.length === 0) return;

  await addAllBookshelf(books);

  localStorage.removeItem('guest:bookshelf');
}

export { addBookshelf, addAllBookshelf, deleteBookshelf, getBookshelf, isBookshelf }