let currentPage = 1;
const itemsPerPage = 10;
let books = [];
let filteredBooks = [];

// Fetch and display books
async function fetchBooks() {
  try {
    const response = await fetch("/api/admin/allBooks");
    const data = await response.json();
    if (data.success) {
      books = data.books;
      filteredBooks = [...books];
      updateTable();
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Update table with data
function updateTable() {
  const tbody = document.getElementById("booksTableBody");
  tbody.innerHTML = filteredBooks
    .map(
      (book, index) => `
            <tr>
                <td class="px-6 py-4">${index + 1}</td>
                <td class="px-6 py-4">${book.sno}</td>
                <td class="px-6 py-4">${book.title}</td>
                <td class="px-6 py-4">${book.totalCopies}</td>
                <td class="px-6 py-4">${book.availableCopies}</td>
                <td class="px-6 py-4">
                    <button onclick="editBook(${
                      book.sno
                    })" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteBook(${
                      book.sno
                    })" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `
    )
    .join("");
}

// Add new book
async function addBook(formData) {
  try {
    const response = await fetch("/api/admin/addBooks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    const data = await response.json();
    if (data.success) {
      await fetchBooks();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error adding book:", error);
    return false;
  }
}

// Delete book with confirmation
async function deleteBook(bookId) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  try {
    const response = await fetch(`/api/admin/deleteBook/${bookId}`, {
      method: "POST",
    });
    const data = await response.json();
    if (data.success) {
      await fetchBooks();
    } else {
      alert("Failed to delete book");
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    alert("Failed to delete book");
  }
}

// Edit book
async function editBook(bookId) {
  try {
    const response = await fetch(`/api/admin/singleBook/${bookId}`);
    const data = await response.json();
    if (data.success) {
      showEditModal(data.book);
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
}

// Update book
async function updateBook(bookId, formData) {
  try {
    const response = await fetch(`/api/admin/updateBook/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    const data = await response.json();
    if (data.success) {
      await fetchBooks();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating book:", error);
    return false;
  }
}

// Modal handling for both Add and Edit
const addBookModal = document.getElementById("addBookModal");
const addBookBtn = document.getElementById("addBookBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const addBookForm = document.getElementById("addBookForm");

const editBookModal = document.getElementById("editBookModal");
const closeEditModal = document.getElementById("closeEditModal");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editBookForm = document.getElementById("editBookForm");

// Show modal
addBookBtn.addEventListener("click", () => {
  addBookModal.classList.remove("hidden");
  addBookModal.classList.add("flex");
});

// Show edit modal
function showEditModal(book) {
  document.getElementById("editBookId").value = book.sno;
  document.getElementById("editBookTitle").value = book.title;
  document.getElementById("editTotalCopies").value = book.totalCopies;
  editBookModal.classList.remove("hidden");
  editBookModal.classList.add("flex");
}

// Hide modal
function hideModal() {
  addBookModal.classList.remove("flex");
  addBookModal.classList.add("hidden");
  addBookForm.reset();
}

// Hide edit modal
function hideEditModal() {
  editBookModal.classList.remove("flex");
  editBookModal.classList.add("hidden");
  editBookForm.reset();
}

closeModal.addEventListener("click", hideModal);
cancelBtn.addEventListener("click", hideModal);

closeEditModal.addEventListener("click", hideEditModal);
cancelEditBtn.addEventListener("click", hideEditModal);

// Close modal when clicking outside
addBookModal.addEventListener("click", (e) => {
  if (e.target === addBookModal) {
    hideModal();
  }
});

// Close edit modal when clicking outside
editBookModal.addEventListener("click", (e) => {
  if (e.target === editBookModal) {
    hideEditModal();
  }
});

// Handle form submission
addBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addBookForm);
  const success = await addBook(formData);

  if (success) {
    hideModal();
    await fetchBooks();
  } else {
    alert("Failed to add book");
  }
});

// Handle edit form submission
editBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const bookId = document.getElementById("editBookId").value;
  const formData = new FormData(editBookForm);

  try {
    const response = await fetch(`/api/admin/updateBook/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    const data = await response.json();

    if (data.success) {
      hideEditModal();
      await fetchBooks();
    } else {
      alert("Failed to update book");
    }
  } catch (error) {
    console.error("Error updating book:", error);
    alert("Failed to update book");
  }
});

// Search functionality
document.querySelectorAll(".searchBook").forEach((e) => {    
  e.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm === "") {
      filteredBooks = [...books];
    } else {
      filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm)
      );
    }
    updateTable();
  });
});



const isLoggedInOptions = {
  method: "POST",
};

fetch("/api/loggedInUser", isLoggedInOptions)
  .then((response) => response.json())
  .then((response) => {
    let userProfilePic = document.querySelector("#userProfilePic");
    let userFullName = document.querySelector("#userFullName");

    console.log(response);

    if (response.success) {
      userProfilePic.src = `https://ui-avatars.com/api/?name=${response.user.name}`;
      userFullName.innerHTML = response.user.name;
    }
  })
  .catch((err) => console.error(err));



// Initial load
fetchBooks();
