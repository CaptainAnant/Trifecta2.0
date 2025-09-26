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

// Update the levels page title with the selected topic
document.addEventListener('DOMContentLoaded', () => {
const topicTitle = document.getElementById('topicTitle');

// Check for topic from sessionStorage first
let topic = sessionStorage.getItem('selectedTopic');

// If not in sessionStorage, check the URL parameter
if (!topic) {
    const urlParams = new URLSearchParams(window.location.search);
    topic = urlParams.get('topic');
}

if (topic) {
    topicTitle.textContent = topic;
} else {
    topicTitle.textContent = "EcoLearn Levels"; // Default title if no topic is found
}

});