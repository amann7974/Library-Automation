// State Management
let users = [];
let filteredUsers = [];

// DOM Elements
const userModal = document.getElementById('userModal');
const addUserBtn = document.getElementById('addUserBtn');
const closeUserModal = document.getElementById('closeUserModal');
const cancelUserBtn = document.getElementById('cancelUserBtn');
const userForm = document.getElementById('userForm');

// CRUD Operations
const crudOperations = {
    create: async (formData) => {
        try {
            const response = await fetch('/api/admin/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            const data = await response.json();
            if (data.message) {
              alert("User created successfully!");
                fetchUsers();
                uiHandlers.hideModal();
              return true;
            }
            if (data.error) {
              alert(data.error || "Failed to create user");
              return false;
            }
            
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again.');
            return false;
        }
    },

    read: async () => {
        try {
            const response = await fetch('/api/admin/allusers');
            const data = await response.json();
            if (data.success) {
                users = data.users;
                filteredUsers = [...users];
                return true;
            }
            console.error('Failed to fetch users:', data.message);
            return false;
        } catch (error) {
            console.error('Error fetching users:', error);
            return false;
        }
    },

    update: async (userId, formData) => {
        try {
            const response = await fetch(`/api/admin/updateUser/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            const data = await response.json();
            if (data.message) {
                alert('User updated successfully!');
                fetchUsers();
                return true;
            }
            if (data.error) {
                alert(data.error || "Failed to update user");
                return false;
            }
            
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user. Please try again.');
            return false;
        }
    },

    delete: async (userId) => {
        try {
            const response = await fetch(`/api/admin/deleteUser/${userId}`, {
                method: 'GET'
            });
            const data = await response.json();            
            if (data.message) {
              alert("User deleted successfully!");
              fetchUsers();
              return true;
            }
            if (data.error) {
                alert(data.message || "Failed to delete user");
                return false;
            }
            
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
            return false;
        }
    }
};

// UI Update Functions
const uiHandlers = {
    updateTable: () => {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = filteredUsers
            .map((user, index) => `
                <tr>
                    <td class="px-6 py-4">${index + 1}</td>
                    <td class="px-6 py-4">${user.name}</td>
                    <td class="px-6 py-4">${user.email}</td>
                    <td class="px-6 py-4">${user.username}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-medium ${
                            user.role === 'faculty' ? 'text-purple-600 bg-purple-100' : 'text-blue-600 bg-blue-100'
                        } rounded-full">
                            ${user.role}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <button onclick="editUser(${user.sno})" class="text-blue-600 hover:text-blue-800 mr-2">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteUser(${user.sno})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
    },

    showModal: (title = 'Add New User') => {
        document.getElementById('modalTitle').textContent = title;
        userForm.reset();
        userModal.classList.remove('hidden');
        userModal.classList.add('flex');
    },

    hideModal: () => {
        userModal.classList.remove('flex');
        userModal.classList.add('hidden');
        userForm.reset();
    },

    populateEditForm: (user) => {
        document.getElementById('userId').value = user.sno;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('username').value = user.username;
        document.getElementById('password').value = '';
        document.getElementById('userType').value = user.role;
    }
};

// Event Handlers
async function fetchUsers() {
    if (await crudOperations.read()) {
        uiHandlers.updateTable();
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    if (await crudOperations.delete(userId)) {
        await fetchUsers();
    } else {
        alert('Failed to delete user');
    }
}

async function editUser(userId) {
    try {
        const response = await fetch(`/api/admin/singleUser/${userId}`);
        const data = await response.json();
        if (data.success) {
            uiHandlers.showModal('Edit User');
            uiHandlers.populateEditForm(data.user);
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

// Event Listeners
addUserBtn.addEventListener('click', () => uiHandlers.showModal());
closeUserModal.addEventListener('click', uiHandlers.hideModal);
cancelUserBtn.addEventListener('click', uiHandlers.hideModal);
userModal.addEventListener('click', (e) => {
    if (e.target === userModal) uiHandlers.hideModal();
});

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let userId = document.getElementById('userId').value;
    const formData = new FormData(userForm);
    
    if (userId && !formData.get('password')) {
        formData.delete('password');
    }
    
    try {
        const success = userId ? 
            await crudOperations.update(userId, formData) :
            await crudOperations.create(formData);
        userId = "";
        
        
        if (success) {
            uiHandlers.hideModal();
            await fetchUsers();
            window.location.reload()
        }
    } catch (error) {
        console.error('Operation failed:', error);
        alert('Operation failed. Please try again.');
    }
});

document.querySelectorAll('.searchUser').forEach(el => {
    el.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filteredUsers = searchTerm === '' ? [...users] : 
            users.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm)
            );
        uiHandlers.updateTable();
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



// Initialize
fetchUsers();
