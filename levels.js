// Topics Dropdown Toggle (for navbar consistency)
const topicsDropdown = document.getElementById('topicsDropdown');
if (topicsDropdown) {
  topicsDropdown.addEventListener('click', (event) => {
    event.stopPropagation();
    topicsDropdown.classList.toggle('active');
  });
}
document.addEventListener('click', (event) => {
  if (topicsDropdown && !topicsDropdown.contains(event.target)) {
    topicsDropdown.classList.remove('active');
  }
});

// Locked Level Hover and Click Behavior
const lockedLevel = document.querySelector('.level-node.locked');
const lockedPopup = document.getElementById('lockedPopup');
const closePopup = document.getElementById('closePopup');

if (lockedLevel) {
  // Show tooltip on hover
  lockedLevel.addEventListener('mouseenter', () => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = lockedLevel.dataset.tooltip;
    document.body.appendChild(tooltip);

    const rect = lockedLevel.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

    lockedLevel.addEventListener('mouseleave', () => {
      tooltip.remove();
    });
  });

  // Show pop-up on click
  lockedLevel.addEventListener('click', (event) => {
    event.preventDefault();
    lockedPopup.classList.remove('hidden');
  });
}

// Close pop-up
if (closePopup) {
  closePopup.addEventListener('click', () => {
    lockedPopup.classList.add('hidden');
  });
}

// Add blur effect to navbar on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Update page-header container with selected topic
const topicLinks = document.querySelectorAll('.dropdown-menu a');
const topicTitle = document.getElementById('topicTitle');

topicLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const selectedTopic = link.getAttribute('data-topic');
    if (selectedTopic) {
      topicTitle.textContent = selectedTopic;
    }
  });
});
