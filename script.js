

// JavaScript for toggling the sidebar on mobile
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Optional: Close sidebar when clicking outside of it on mobile
document.addEventListener('click', (event) => {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle.contains(event.target);

    if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('open')) {
        if (window.innerWidth < 768) { // Only on mobile view
            sidebar.classList.remove('open');
        }
    }
});
