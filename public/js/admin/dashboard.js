// Add this after existing script
const addBookModal = document.getElementById("addBookModal");
const addBookBtn = document.getElementById("addBookBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const addBookForm = document.getElementById("addBookForm");

function toggleModal() {
  addBookModal.classList.toggle("hidden");
  addBookModal.classList.toggle("flex");
  if (!addBookModal.classList.contains("hidden")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

addBookBtn.addEventListener("click", toggleModal);
closeModal.addEventListener("click", toggleModal);
cancelBtn.addEventListener("click", toggleModal);

addBookModal.addEventListener("click", (e) => {
  if (e.target === addBookModal) {
    toggleModal();
  }
});

addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Handle form submission here
  const formData = new FormData(addBookForm);

  let data = {
    title: formData.get("title"),
    totalCopies: formData.get("totalCopies"),
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch("/api/admin/addBooks", options)
    .then((response) => response.json())
    .then((response) => {
      if (response.error) {
        alert(response.error);
      }

      if (response.success) {
        alert("Book added successfully");
      }
    })
    .catch((err) => console.error(err));

  addBookForm.reset();
  toggleModal();
});

// Edit Modal Elements
const editBookModal = document.getElementById("editBookModal");
const closeEditModal = document.getElementById("closeEditModal");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editBookForm = document.getElementById("editBookForm");
const editBookId = document.getElementById("editBookId");
const editBookTitle = document.getElementById("editBookTitle");
const editTotalCopies = document.getElementById("editTotalCopies");

function toggleEditModal() {
  editBookModal.classList.toggle("hidden");
  editBookModal.classList.toggle("flex");
  if (!editBookModal.classList.contains("hidden")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

async function editBook(bookId) {
  try {
    const response = await fetch(`/api/admin/singleBook/${bookId}`);
    const data = await response.json();

    if (data.success) {
      // Populate form with book data
      editBookId.value = bookId;
      editBookTitle.value = data.book.title;
      editTotalCopies.value = data.book.totalCopies;

      // Show modal
      toggleEditModal();
    } else {
      alert("Failed to fetch book details");
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    alert("Failed to fetch book details");
  }
}

// Event Listeners for Edit Modal
closeEditModal.addEventListener("click", toggleEditModal);
cancelEditBtn.addEventListener("click", toggleEditModal);
editBookModal.addEventListener("click", (e) => {
  if (e.target === editBookModal) {
    toggleEditModal();
  }
});

editBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const bookId = editBookId.value;

  try {
    const response = await fetch(`/api/admin/updateBook/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editBookTitle.value,
        totalCopies: editTotalCopies.value,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Book updated successfully");
      toggleEditModal();
      fetchAndDisplayBooks(); // Refresh the books list
    } else {
      alert(data.error || "Failed to update book");
    }
  } catch (error) {
    console.error("Error updating book:", error);
    alert("Failed to update book");
  }
});

// Function to fetch and display books

let books = []; // Store all books
let users = []; // Store all users

// Search functionality
const searchInput = document.getElementById('searchBook');

searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // If search is empty, show recent data
        displayRecentBooks(books);
        displayRecentUsers(users);
        return;
    }

    // Filter books
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm)
    );
    
    // Filter users
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(filteredBooks, filteredUsers);
});

async function fetchAndDisplayBooks() {
  try {
    const response = await fetch("/api/admin/allBooks");
    const data = await response.json();

    if (data.success) {
      books = data.books; // Store all books
      displayRecentBooks(books);
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function displayRecentBooks(booksToShow) {
  const tableBody = document.getElementById("booksTableBody");
  tableBody.innerHTML = "";

  // Display last 5 books
  const recentBooks = booksToShow.slice(-5).reverse();
  
  recentBooks.forEach((book) => {
      const row = `
          <tr class="hover:bg-gray-50">
              <td class="px-6 py-4">${book.title}</td>
              <td class="px-6 py-4">${book.totalCopies}</td>
              <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium ${
                      book.availableCopies > 0
                          ? "text-green-600 bg-green-100"
                          : "text-red-600 bg-red-100"
                  } rounded-full">
                      ${book.availableCopies}
                  </span>
              </td>
              <td class="px-6 py-4 space-x-3">
                  <button class="text-blue-600 hover:text-blue-800" onclick="editBook('${book.sno}')">
                      <i class="fas fa-edit"></i>
                  </button>
                  <button class="text-red-600 hover:text-red-800" onclick="deleteBook('${book.sno}')">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </td>
          </tr>
      `;
      tableBody.innerHTML += row;
  });
}

function displaySearchResults(filteredBooks, filteredUsers) {
  displayRecentBooks(filteredBooks);
  displayRecentUsers(filteredUsers);

  // Update counts in stats
  document.getElementById("totalBooksCount").textContent = filteredBooks.length;
  document.getElementById("totalUsersCount").textContent = filteredUsers.length;
}

// Fetch books when page loads
document.addEventListener("DOMContentLoaded", fetchAndDisplayBooks);

// Refresh books after adding a new book
addBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(addBookForm);

  try {
    const response = await fetch("/api/admin/addBooks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.get("title"),
        totalCopies: formData.get("totalCopies"),
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Book added successfully");
      addBookForm.reset();
      toggleModal();
      fetchAndDisplayBooks(); // Refresh the books list
    } else {
      alert(data.error || "Failed to add book");
    }
  } catch (error) {
    console.error("Error adding book:", error);
    alert("Failed to add book");
  }
});

function deleteBook(id) {
  fetch(`/api/admin/deleteBook/${id}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Book deleted successfully");
        fetchAndDisplayBooks();
      } else {
        alert(data.error || "Failed to delete book");
      }
    })
    .catch((error) => {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    });
}

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

// Fetch dashboard statistics
async function fetchDashboardStats() {
  try {
    const response = await fetch("/api/admin/stats");
    const data = await response.json();

    console.log(data);

    if (data.success) {
      document.getElementById("totalBooksCount").textContent =
        data.stats.totalBooks;
      document.getElementById("totalUsersCount").textContent =
        data.stats.totalUsers;
      document.getElementById("issuedBooksCount").textContent =
        data.stats.booksIssued;
      document.getElementById("overdueCount").textContent = data.stats.overdue;
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
}

// Fetch recent users
async function fetchRecentUsers() {
  try {
    const response = await fetch("/api/admin/allusers");
    const data = await response.json();

    if (data.success) {
      users = data.users; // Store all users
      displayRecentUsers(users);
    }
  } catch (error) {
    console.error("Error fetching recent users:", error);
  }
}

function displayRecentUsers(usersToShow) {
  const tbody = document.getElementById("recentUsersTable");
  const recentUsers = usersToShow.slice(0, 5); // Show only 5 most recent users

  tbody.innerHTML = recentUsers
      .map((user, index) => `
          <tr class="hover:bg-gray-50">
              <td class="px-6 py-4">${index + 1}</td>
              <td class="px-6 py-4">${user.name}</td>
              <td class="px-6 py-4">${user.email}</td>
              <td class="px-6 py-4">${user.username}</td>
              <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium ${
                      user.role === "admin"
                          ? "text-purple-600 bg-purple-100"
                          : "text-blue-600 bg-blue-100"
                  } rounded-full">
                      ${user.role}
                  </span>
              </td>
          </tr>
      `).join("");
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  fetchDashboardStats();
  fetchRecentUsers();
});
