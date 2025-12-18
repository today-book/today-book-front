import { createSnowflakes, preventDoubleTapZoom } from "../modules/common.js";
import config from "../config.js";
import { isLoggedIn } from "../modules/login.js";
import { deleteBookshelf, getBookshelf } from "../api/bookshelf.js";
import { getGuestBookshelf, toggleGuestBookshelf } from "../modules/bookshelf-guest.js";

document.addEventListener('DOMContentLoaded', async () => {
    createSnowflakes();
    preventDoubleTapZoom();

    const bookshelfGrid = document.getElementById('bookshelfGrid');
    const emptyState = document.getElementById('emptyState');
    const backArrowBtn = document.getElementById('backArrowBtn');
    const goHomeBtn = document.getElementById('goHomeBtn');
    const guestWarning = document.getElementById('guestWarning');

    if (guestWarning) {
        guestWarning.classList.toggle('hidden', isLoggedIn());
    }

    if (backArrowBtn) {
        backArrowBtn.addEventListener('click', () => {
            history.back();
        });
    }

    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', () => {
            location.href = `${config.BASE_PATH}/`;
        });
    }

    async function loadBooks() {
        let books = [];

        try {
            if (isLoggedIn()) {
                books = await getBookshelf();
            } else {
                const guestData = getGuestBookshelf();
                books = Array.isArray(guestData) ? guestData : [];
            }
        } catch (e) {
            console.error('Failed to load bookshelf', e);
        }

        // Add example books for UI demonstration if empty
        if (books.length === 0) {
            books = [
                {
                    bookId: 'ex-1',
                    title: '사랑의 기술',
                    author: '에리히 프롬',
                    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F4905140%3Fparams%3Dservice%3Dkakaosearch',
                    description: '사랑은 우연한 감정이 아니라 길러야 하는 능력임을 역설하는 인문 고전.',
                    recommendationReason: '성숙한 사랑과 삶의 태도에 대해 깊이 있게 고민하고 싶은 당신에게 추천해요.'
                },
                {
                    bookId: 'ex-2',
                    title: '우리가 빛의 속도로 갈 수 없다면',
                    author: '김초엽',
                    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5113437%3Fparams%3Dservice%3Dkakaosearch',
                    description: 'SF적인 상상력을 통해 소외된 존재들과 인간의 본질을 탐구하는 단편 소설집.',
                    recommendationReason: '서정적이고 따뜻한 SF를 통해 새로운 세계를 만나고 싶을 때 읽어보세요.'
                },
                {
                    bookId: 'ex-3',
                    title: '미움받을 용기',
                    author: '기시미 이치로',
                    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1467193%3Fparams%3Dservice%3Dkakaosearch',
                    description: '아들러 심리학을 통해 본 자유로운 삶의 태도.',
                    recommendationReason: '타인의 시선에서 벗어나 나답게 살고 싶은 당신을 위해 선택했어요. 자유로운 삶에 대한 통찰을 얻을 수 있습니다.'
                },
                {
                    bookId: 'ex-4',
                    title: '데미안',
                    author: '헤르만 헤세',
                    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F1122683%3Fparams%3Dservice%3Dkakaosearch',
                    description: '내 안의 나를 찾아가는 치열한 성장 기록.',
                    recommendationReason: '자신의 본모습을 고민하는 깊은 밤, 이 책이 길잡이가 되어줄 거예요. 정체성에 대한 깊은 사유가 담겨 있습니다.'
                },
                {
                    bookId: 'ex-5',
                    title: '달러구트 꿈 백화점',
                    author: '이미예',
                    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5433541%3Fparams%3Dservice%3Dkakaosearch',
                    description: '잠들어야만 입장 가능한 상점, 그곳에서 파는 꿈의 기록.',
                    recommendationReason: '포근하고 신비로운 분위기에서 기분 전환을 하고 싶은 날 추천해요. 따뜻한 위로를 받을 수 있는 판타지 소설입니다.'
                },
                {
                    bookId: 'ex-6',
                    title: '연금술사',
                    author: '파울로 코엘료',
                    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F549045%3Fparams%3Dservice%3Dkakaosearch',
                    description: '자신의 꿈을 찾아 떠나는 양치기 소년의 여정을 다룬 세계적 베스트셀러.',
                    recommendationReason: '삶의 진정한 의미와 자아의 신화를 찾아가고 싶은 순간, 이 책이 큰 용기를 줄 거예요.'
                },
                {
                    bookId: 'ex-7',
                    title: '어린 왕자',
                    author: '앙투안 드 생텍쥐페리',
                    thumbnail: 'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F596130%3Fparams%3Dservice%3Dkakaosearch',
                    description: '순수한 어린 왕자의 시선을 통해 삶의 본질을 꿰뚫어 보는 영원한 고전.',
                    recommendationReason: '마음이 지치고 세상이 차갑게 느껴질 때, 가장 소중한 것은 눈에 보이지 않는다는 사실을 다시금 일깨워줍니다.'
                }
            ];
        }

        renderBooks(books);
    }

    function renderBooks(books) {
        // Clear existing (except emptyState)
        const items = bookshelfGrid.querySelectorAll('.bookshelf-item');
        items.forEach(item => item.remove());

        if (!books || books.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        books.forEach(book => {
            const bookObj = typeof book.book === 'string' ? JSON.parse(book.book) : book;
            const card = document.createElement('div');
            card.className = 'bookshelf-item';

            card.innerHTML = `
                <div class="book-image-container">
                    <img src="${bookObj.thumbnail || ''}" alt="${bookObj.title}" class="book-image" style="width: 70px; border-radius: 12px;" />
                </div>
                <div class="book-info" style="flex: 1;">
                    <h3 style="font-size: 16px; margin-bottom: 4px; color: var(--text-primary); font-weight: 700;">${bookObj.title}</h3>
                    <p class="author" style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">${bookObj.author}</p>
                    <div class="reason-preview line-clamp-3" style="font-size: 12px; color: var(--text-tertiary); line-height: 1.5;">
                        ${bookObj.recommendationReason || bookObj.reason || '추천 이유가 없습니다.'}
                    </div>
                </div>
                <button class="delete-btn" data-id="${bookObj.bookId || bookObj.id}" style="position: static; margin-left: 8px;">✕</button>
            `;

            card.querySelector('.delete-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = card.querySelector('.delete-btn').dataset.id;
                if (confirm('이 책을 책장에서 삭제할까요?')) {
                    try {
                        if (isLoggedIn()) {
                            await deleteBookshelf(id);
                        } else {
                            toggleGuestBookshelf(bookObj, false);
                        }
                        loadBooks();
                    } catch (err) {
                        alert('삭제에 실패했습니다.');
                    }
                }
            });

            card.addEventListener('click', () => {
                // Prepare data for result page
                const resultData = {
                    title: bookObj.title,
                    author: bookObj.author,
                    publisher: bookObj.publisher || '',
                    thumbnail: bookObj.thumbnail,
                    description: bookObj.description,
                    recommendationReason: bookObj.recommendationReason || bookObj.reason
                };
                sessionStorage.setItem('recommendation:primary', JSON.stringify(resultData));
                sessionStorage.setItem('recommendation:others', JSON.stringify([]));
                location.href = `${config.BASE_PATH}/result`;
            });

            bookshelfGrid.appendChild(card);
        });
    }

    await loadBooks();
});
