// Elementos DOM
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const categoryButtons = document.querySelectorAll('.category-btn');
const modal = document.getElementById('book-modal');
const closeModal = document.querySelector('.close');

// Navegação
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Atualiza classes ativas
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
    });
});

// Renderiza livros
function renderBooks(books, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <div class="book-rating">
                ${renderStars(book.rating)}
            </div>
        `;
        
        bookCard.addEventListener('click', () => showBookDetails(book));
        container.appendChild(bookCard);
    });
}

// Renderiza estrelas de avaliação
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = '';

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }

    return starsHTML;
}

// Mostra detalhes do livro
function showBookDetails(book) {
    const modalCover = modal.querySelector('.modal-book-cover');
    const modalTitle = modal.querySelector('.modal-book-title');
    const modalAuthor = modal.querySelector('.modal-book-author');
    const modalRating = modal.querySelector('.modal-book-rating');
    const modalCategory = modal.querySelector('.modal-book-category');
    const reviewsList = modal.querySelector('.reviews-list');

    modalCover.src = book.cover;
    modalCover.alt = book.title;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalRating.innerHTML = renderStars(book.rating);
    modalCategory.textContent = book.category;

    // Renderiza avaliações
    reviewsList.innerHTML = '';
    if (book.reviews && book.reviews.length > 0) {
        book.reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="review-user">${review.user}</span>
                    <div class="review-rating">${renderStars(review.rating)}</div>
                </div>
                <p class="review-comment">${review.comment}</p>
            `;
            reviewsList.appendChild(reviewElement);
        });
    } else {
        reviewsList.innerHTML = '<p>Nenhuma avaliação ainda.</p>';
    }

    modal.style.display = 'block';
}

// Fecha o modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Busca de livros
function searchBooks(query) {
    const filteredBooks = booksData.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    renderBooks(filteredBooks, 'library-books');
}

searchButton.addEventListener('click', () => {
    searchBooks(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBooks(searchInput.value);
    }
});

// Filtro por categorias
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        const category = button.textContent;
        const filteredBooks = category === 'Todos' 
            ? booksData 
            : booksData.filter(book => book.category === category);
        
        renderBooks(filteredBooks, 'library-books');
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderBooks(booksData, 'featured-books');
    renderBooks(booksData, 'library-books');
});
