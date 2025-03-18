document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('issuedBooksContainer');
    const template = document.getElementById('issuedBookTemplate');

    loadIssuedBooks();

    async function loadIssuedBooks() {
        try {
            const response = await fetch('/api/faculty/issued-books');
            const books = await response.json();
            displayIssuedBooks(books);
        } catch (error) {
            console.error('Failed to load issued books:', error);
        }
    }

    function displayIssuedBooks(books) {
        container.innerHTML = '';
        books.forEach(book => {
            const clone = template.content.cloneNode(true);
            clone.querySelector('.book-title').textContent = book.title;
            clone.querySelector('.book-author').textContent = `Author: ${book.author}`;
            clone.querySelector('.issue-date').textContent = `Issued: ${new Date(book.issueDate).toLocaleDateString()}`;
            clone.querySelector('.due-date').textContent = `Due: ${new Date(book.dueDate).toLocaleDateString()}`;
            
            const returnBtn = clone.querySelector('.return-book');
            returnBtn.onclick = () => returnBook(book._id);

            container.appendChild(clone);
        });
    }

    async function returnBook(bookId) {
        if (!confirm('Are you sure you want to return this book?')) return;

        try {
            const response = await fetch('/api/faculty/return-book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId })
            });
            
            if (response.ok) {
                alert('Book returned successfully!');
                loadIssuedBooks();
            } else {
                alert('Failed to return book');
            }
        } catch (error) {
            console.error('Return failed:', error);
        }
    }
});
