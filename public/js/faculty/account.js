const isLoggedInOptions = {
    method: "POST",
};

fetch("/api/loggedInUser", isLoggedInOptions)
    .then((response) => response.json())
    .then((response) => {
        let userProfilePic = document.querySelector("#userProfilePic");
        let profilePic = document.querySelector("#profilePic");
        let userFullName = document.querySelector("#userFullName");
        let userName = document.querySelector("#userName");
        let userRole = document.querySelector("#userRole");
        let department = document.querySelector("#department");
        let name = document.querySelector("#name");
        let facultyId = document.querySelector("#facultyId");
        let email = document.querySelector("#email");

        if (response.success) {
            // Update UI with user data
            userProfilePic.src = `https://ui-avatars.com/api/?name=${response.user.name}`;
            profilePic.src = `https://ui-avatars.com/api/?name=${response.user.name}`;
            userFullName.innerHTML = response.user.name;
            userName.innerHTML = response.user.name;
            userRole.innerHTML = response.user.role;
            name.value = response.user.name;
            facultyId.value = response.user.username;  // Changed to username
            department.value = response.user.sno;      // Changed to sno as Faculty ID
            email.value = response.user.email;


            // Store additional user details as needed
            const userData = response.user;
            console.log("User Data:", userData);
            
            // You can access other user properties like:
            // userData.email
            // userData.username
            // userData.role
            // userData.sno
        }
    })
    .catch((err) => console.error("Error fetching user data:", err));

document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const accountForm = document.getElementById('accountForm');
    const inputs = accountForm.querySelectorAll('input');
    let isEditing = false;
    let user = null;

    // Get user ID when loading profile data
    fetch("/api/loggedInUser", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                user = data.user;
            }
        });

    editProfileBtn.addEventListener('click', () => {
        isEditing = !isEditing;
        
        // Toggle input fields except username and Faculty ID
        inputs.forEach(input => {
            if (
              input.id !== "facultyId" &&
              input.id !== "department" &&
              input.id !== "email"
            ) {
              input.readOnly = !isEditing;
            }
        });

        // Update button text and style
        if (isEditing) {
            editProfileBtn.innerHTML = '<i class="fas fa-save"></i><span>Save Changes</span>';
            editProfileBtn.classList.remove('from-purple-500', 'to-indigo-500');
            editProfileBtn.classList.add('from-green-500', 'to-green-600');
        } else {
            // Save the changes
            const updatedData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                username: user.username, // Keep original username
                role: user.role // Keep original role
            };

            // Add department if it exists
            const departmentValue = document.getElementById('department').value;
            if (departmentValue && departmentValue !== "N/A") {
                updatedData.department = departmentValue;
            }

            fetch(`/api/faculty/account/update/${user.sno}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "User updated successfully") {
                    // Update UI elements with new data
                    document.querySelector("#userFullName").innerHTML = updatedData.name;
                    document.querySelector("#userName").innerHTML = updatedData.name;
                    document.querySelector("#userProfilePic").src = `https://ui-avatars.com/api/?name=${updatedData.name}`;
                    document.querySelector("#profilePic").src = `https://ui-avatars.com/api/?name=${updatedData.name}`;
                    
                    // Show success message
                    alert('Profile updated successfully!');
                } else {
                    alert(data.error || 'Failed to update profile. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('Error updating profile. Please try again.');
            });

            // Reset button
            editProfileBtn.innerHTML = '<i class="fas fa-edit"></i><span>Edit Profile</span>';
            editProfileBtn.classList.remove('from-green-500', 'to-green-600');
            editProfileBtn.classList.add('from-purple-500', 'to-indigo-500');
        }
    });

    const changePasswordBtn = document.getElementById('changePasswordBtn');
    // Add password change modal to body
    const passwordModalHtml = `
        <div id="passwordModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                <form id="changePasswordForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input type="password" id="newPassword" required
                            class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input type="password" id="confirmPassword" required
                            class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400">
                    </div>
                    <div class="flex gap-4 pt-2">
                        <button type="submit"
                            class="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                            Change Password
                        </button>
                        <button type="button" id="cancelPasswordChange"
                            class="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', passwordModalHtml);

    // Password change modal functionality
    const passwordModal = document.getElementById('passwordModal');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const cancelPasswordBtn = document.getElementById('cancelPasswordChange');

    changePasswordBtn.addEventListener('click', () => {
        passwordModal.classList.remove('hidden');
        passwordModal.classList.add('flex');
    });

    cancelPasswordBtn.addEventListener('click', () => {
        passwordModal.classList.add('hidden');
        passwordModal.classList.remove('flex');
        changePasswordForm.reset();
    });

    // Close modal when clicking outside
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            passwordModal.classList.add('hidden');
            passwordModal.classList.remove('flex');
            changePasswordForm.reset();
        }
    });

    // Handle password change form submission
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        try {
            const response = await fetch(`/api/faculty/account/update/${user.sno}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role
                })
            });

            const data = await response.json();

            if (data.message === "User updated successfully") {
                alert('Password changed successfully!');
                passwordModal.classList.add('hidden');
                passwordModal.classList.remove('flex');
                changePasswordForm.reset();
            } else {
                alert(data.error || 'Failed to change password. Please try again.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password. Please try again.');
        }
    });
});