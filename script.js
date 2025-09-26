// Topics Dropdown Toggle
const topicsDropdown = document.getElementById('topicsDropdown');
if (topicsDropdown) {
topicsDropdown.addEventListener('click', (event) => {
event.stopPropagation();
topicsDropdown.classList.toggle('active');
});
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
if (topicsDropdown && !topicsDropdown.contains(event.target)) {
topicsDropdown.classList.remove('active');
}
});

// Pass the selected topic to the levels page
document.querySelectorAll('.topic-btn, .dropdown-menu a').forEach(item => {
item.addEventListener('click', (event) => {
const topic = event.target.getAttribute('data-topic');
if (topic) {
// Store topic in sessionStorage to be retrieved on the levels page
sessionStorage.setItem('selectedTopic', topic);
}
});
});