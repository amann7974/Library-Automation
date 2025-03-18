document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const template = document.getElementById('bookCardTemplate');
    let allBooks = [];

    // Fetch all books initially
    async function fetchAllBooks() {
        try {
            searchResults.innerHTML = '<p class="text-gray-500 text-center p-4">Loading books...</p>';

            const response = await fetch('/api/faculty/searchBooks');
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch books');
            }

            allBooks = data.books;
            displayBooks(allBooks);
        } catch (error) {
            console.error('Fetch error:', error);
            searchResults.innerHTML = `<p class="text-red-500 text-center p-4">Error: ${error.message || 'Failed to load books'}</p>`;
        }
    }

    // Filter books based on search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (!searchTerm) {
            displayBooks(allBooks);
            return;
        }

        const filteredBooks = allBooks.filter(book => 
            book.title?.toLowerCase().includes(searchTerm) ||
            book.author?.toLowerCase().includes(searchTerm) ||
            book.isbn?.toLowerCase().includes(searchTerm)
        );

        if (filteredBooks.length === 0) {
            searchResults.innerHTML = '<p class="text-gray-500 text-center p-4">No matching books found</p>';
            return;
        }

        displayBooks(filteredBooks);
    });

    function displayBooks(books) {
        searchResults.innerHTML = '';
        books.forEach(book => {
            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.book-title').textContent = book.title || 'Unknown Title';
            clone.querySelector('.book-author').textContent = `Author: ${book.author || 'Unknown'}`;
            clone.querySelector('.book-isbn').textContent = `ISBN: ${book.isbn || 'N/A'}`;
            
            const statusSpan = clone.querySelector('.book-status');
            statusSpan.textContent = book.availableBooks !== 0 ? 'Available' : 'Not Available';
            
            // Fix: Add classes separately
            if (book.availableBooks !== 0) {
              statusSpan.classList.add("bg-green-100");
              statusSpan.classList.add("text-green-800");
            } else {
              statusSpan.classList.add("bg-red-100");
              statusSpan.classList.add("text-red-800");
            }
            
            const requestBtn = clone.querySelector('.request-book');
            const isAvailable = book.availableBooks !== 0;
            requestBtn.disabled = !isAvailable;
            if (!isAvailable) {
                requestBtn.classList.add('opacity-50');
                requestBtn.classList.add('cursor-not-allowed');
            }
            requestBtn.onclick = () => requestBook(book.id);

            searchResults.appendChild(clone);
        });
    }

    // Load all books when page loads
    fetchAllBooks();

    // ...existing requestBook and showAlert functions...
});
