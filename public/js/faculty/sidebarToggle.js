const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const overlay = document.getElementById('sidebarOverlay');

function toggleSidebar() {
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    if (isOpen) {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    } else {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

// Event Listeners
sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
});

overlay.addEventListener('click', toggleSidebar);

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    const clickedInside = sidebar.contains(e.target) || sidebarToggle.contains(e.target);
    if (isOpen && !clickedInside) {
        toggleSidebar();
    }
});

// Handle screen resize
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
    }
});

// Prevent sidebar content clicks from closing
sidebar.addEventListener('click', (e) => e.stopPropagation());

// Update active link based on current path
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('bg-white/10');
    }
});
