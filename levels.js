window.onload = function() {
// Get the topic from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

// Find the heading element on the page
const topicTitle = document.getElementById('topicTitle');

// If a topic is found and the heading element exists, update the text
if (topic && topicTitle) {
topicTitle.textContent = topic;
}

// --- TOPICS DROPDOWN TOGGLE (for navbar consistency) ---
const topicsDropdown = document.getElementById('topicsDropdown');

if (topicsDropdown) {
topicsDropdown.addEventListener('click', (event) => {
event.stopPropagation();
topicsDropdown.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  if (topicsDropdown && !topicsDropdown.contains(event.target)) {
    topicsDropdown.classList.remove('active');
  }
});

}
};

// This is a comment