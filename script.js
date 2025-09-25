// =================================================================== //
// NAVIGATION FUNCTIONALITY                                            //
// =================================================================== //

// --- Topics Dropdown Toggle ---
const topicsDropdown = document.getElementById('topicsDropdown');

if (topicsDropdown) {
  topicsDropdown.addEventListener('click', (event) => {
    // Prevents the global click listener from firing immediately
    event.stopPropagation(); 
    topicsDropdown.classList.toggle('active');
  });
}

// --- Sidebar Toggle for Mobile/Tablet ---
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (sidebar && sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// =================================================================== //
// GLOBAL CLICK HANDLERS                                               //
// =================================================================== //

// --- Close dropdown and sidebar when clicking outside ---
document.addEventListener('click', (event) => {
  // Handle dropdown closure
  if (topicsDropdown && !topicsDropdown.contains(event.target)) {
    topicsDropdown.classList.remove('active');
  }
  
  // Handle sidebar closure on mobile
  if (sidebar && sidebarToggle) {
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggle = sidebarToggle.contains(event.target);
    
    if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('open')) {
      if (window.innerWidth < 768) { // Only on mobile view
        sidebar.classList.remove('open');
      }
    }
  }
});