import { api } from "./client.js";

function toShareRequest(data) {
  return {
    bookId: data.bookId,
    isbn: data.isbn,
    title: data.title,
    author: data.author,
    description: data.description,
    categories: data.categories,
    publisher: data.publisher,
    publishedAt: data.publishedAt,
    thumbnail: data.thumbnail,
    score: data.score,
    reason: data.reason
  };
}

function toShareResponse(data) {
  return {
    bookId: data.bookId,
    isbn: data.isbn,
    title: data.title,
    author: data.author,
    description: data.description,
    categories: data.categories,
    publisher: data.publisher,
    publishedAt: data.publishedAt,
    thumbnail: data.thumbnail,
    score: data.score,
    reason: data.reason
  };
}

async function share(book) {
  const token = crypto.randomUUID();

  const res = await api(`/api/v1/shares/book/${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toShareRequest(book))
  });

  if (!res.ok) {
    throw new Error();
  }

  return token;
}

async function getShareBook(token) {
  const res = await api(`/api/v1/shares/book/${token}`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error();
  }

  const data = res.json();

  return toShareResponse(data);
}

export { share, getShareBook }