function toRecommendationResponse(data) {
  return {
    bookId: data.bookId,
    isbn: data.isbn,
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
  return {
    id: data.id,
    userId: data.userId,
    bookId: data.bookId,
    book: {
      id: data.bookId,
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
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export { toRecommendationResponse, toAddBookshelfRequest, toBookshelfResponse }