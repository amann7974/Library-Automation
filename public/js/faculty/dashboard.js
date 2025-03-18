document.addEventListener('DOMContentLoaded', async () => {
    // Load user profile data
    const userProfilePic = document.getElementById('userProfilePic');
    const userFullName = document.getElementById('userFullName');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const currentBooksContainer = document.getElementById('currentBooks');
    const recommendedBooksContainer = document.getElementById('recommendedBooks');
    const statsContainer = document.getElementById('statsContainer');

    try {
        // Fetch user profile
        const profileResponse = await fetch('/api/loggedInUser');
        const profileData = await profileResponse.json();

        if (profileData.success) {
            userProfilePic.src = `https://ui-avatars.com/api/?name=${profileData.user.name}`;
            userFullName.textContent = profileData.user.name;
            welcomeMessage.textContent = `Welcome back, ${profileData.user.name.split(' ')[0]}!`;
        }

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/faculty/dashboard-stats');
        const statsData = await statsResponse.json();

        if (statsData.success) {
            // Update stats
            document.getElementById('totalBorrowed').textContent = statsData.stats.totalBorrowed;
            document.getElementById('dueSoon').textContent = statsData.stats.dueSoon;
            document.getElementById('reservedBooks').textContent = '0'; // If you have this feature

            // Update current books table
            updateCurrentBooks(statsData.stats.currentBooks);

            // Update recommended books
            updateRecommendedBooks(statsData.stats.recommendedBooks);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
    }

    function updateCurrentBooks(books) {
        const tbody = document.querySelector('#currentBooksTable tbody');
        tbody.innerHTML = books.map(book => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">${book.title}</td>
                <td class="px-6 py-4">${new Date(book.due_date).toLocaleDateString()}</td>
                <td class="px-6 py-4">
                    ${getDueStatus(book.due_date)}
                </td>
                <td class="px-6 py-4">
                    <button onclick="renewBook(${book.issue_id})" 
                            class="text-purple-600 hover:text-purple-800">
                        Renew
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function updateRecommendedBooks(books) {
        recommendedBooksContainer.innerHTML = books.map(book => `
            <div class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <img src="${book.cover_url || 'https://via.placeholder.com/200x300'}" 
                     alt="${book.title}" 
                     class="w-full h-48 object-cover rounded-md mb-4">
                <h3 class="font-medium text-gray-800">${book.title}</h3>
                <p class="text-sm text-gray-600">${book.author}</p>
                <button onclick="reserveBook(${book.id})"
                        class="mt-3 w-full bg-purple-600 text-white rounded-lg py-2 text-sm hover:bg-purple-700 transition-colors">
                    Reserve
                </button>
            </div>
        `).join('');
    }

    function getDueStatus(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

        if (daysUntilDue < 0) {
            return `<span class="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full">Overdue</span>`;
        } else if (daysUntilDue <= 7) {
            return `<span class="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full">Due Soon</span>`;
        }
        return `<span class="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">Active</span>`;
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
});

// Book actions
async function renewBook(issueId) {
    try {
        const response = await fetch(`/api/faculty/renew-book/${issueId}`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification('Book renewed successfully');
            location.reload();
        } else {
            showNotification(data.error || 'Failed to renew book', 'error');
        }
    } catch (error) {
        console.error('Error renewing book:', error);
        showNotification('Failed to renew book', 'error');
    }
}

async function reserveBook(bookId) {
    try {
        const response = await fetch(`/api/faculty/reserve-book/${bookId}`, {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            showNotification('Book reserved successfully');
            location.reload();
        } else {
            showNotification(data.error || 'Failed to reserve book', 'error');
        }
    } catch (error) {
        console.error('Error reserving book:', error);
        showNotification('Failed to reserve book', 'error');
    }
}
