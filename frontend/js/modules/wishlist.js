function isWishlisted(bookId) {
  try {
    const list = JSON.parse(sessionStorage.getItem('wishlist') || '[]');
    return list.includes(bookId);
  } catch {
    return false;
  }
}

function setWishlist(bookId, state) {
  try {
    const json = JSON.parse(sessionStorage.getItem('wishlist') || '[]');
    let wishlist = Array.isArray(json) ? [...json] : [];

    if (state) {
      // 찜 추가 : 이미 존재하면 중복 추가하지 않음
      if (!wishlist.includes(bookId)) {
        wishlist.push(bookId);
      }
    } else {
      // 찜 해제
      wishlist = wishlist.filter((item) => item !== bookId);
    }

    sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (e) {
    console.error('wishlist(session) 저장 실패', e);
  }
}

export { isWishlisted, setWishlist }