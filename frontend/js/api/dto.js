function toRecommendationResponse(data) {
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

function toAddBookshelfRequest(data) {
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

function toBookshelfResponse(data) {
  const snapshot = data.snapshot;

  return {
    id: data.id,
    userId: data.userId,
    bookId: data.bookId,
    book: {
      bookId: snapshot.bookId,
      isbn: snapshot.isbn,
      title: snapshot.title,
      author: snapshot.author,
      description: snapshot.description,
      categories: snapshot.categories,
      publisher: snapshot.publisher,
      publishedAt: snapshot.publishedAt,
      thumbnail: snapshot.thumbnail,
      score: snapshot.score,
      reason: snapshot.reason
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export { toRecommendationResponse, toAddBookshelfRequest, toBookshelfResponse }