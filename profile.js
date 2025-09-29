// Simple Profile Page JavaScript
// DOM Elements
const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');
const profileFormSection = document.querySelector('.profile-form-section');
const passwordFormSection = document.getElementById('passwordFormSection');
const logoutBtn = document.getElementById('logout-btn');
const topicsDropdown = document.getElementById('topicsDropdown');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    addEventListeners();
    animateElements();
});

// Initialize profile data
function initializeProfile() {
    console.log('Profile page initialized for: Abhay Aditya R S');
    loadProfileData();
}

// Add event listeners.
function addEventListeners() {
    // Profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Password form submission
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Topics dropdown
    if (topicsDropdown) {
        topicsDropdown.addEventListener('mouseenter', showDropdown);
        topicsDropdown.addEventListener('mouseleave', hideDropdown);
    }
}

// Show change password form
function showChangePassword() {
    profileFormSection.style.display = 'none';
    passwordFormSection.style.display = 'block';

    // Clear password form
    passwordForm.reset();

    // Focus on first input
    const firstInput = passwordForm.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

// Show profile form
function showProfile() {
    passwordFormSection.style.display = 'none';
    profileFormSection.style.display = 'block';
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(profileForm);
    const data = Object.fromEntries(formData);
    const submitBtn = profileForm.querySelector('.submit-btn');

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        try {
            localStorage.setItem('ecolearn_profile', JSON.stringify(data));
            showNotification('Profile updated successfully!', 'success');
            updateProfileDisplay(data);
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Failed to update profile. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 1000);
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();
    const formData = new FormData(passwordForm);
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    const submitBtn = passwordForm.querySelector('.submit-btn');

    // Validate passwords
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match!', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        try {
            showNotification('Password updated successfully!', 'success');
            passwordForm.reset();
            setTimeout(() => {
                showProfile();
            }, 1500);
        } catch (error) {
            console.error('Error updating password:', error);
            showNotification('Failed to update password. Please try again.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 1000);
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        document.body.style.opacity = '0.5';
        showNotification('Logging out...', 'info');
        // Simulate logout delay
        setTimeout(() => {
            localStorage.removeItem('ecolearn_profile');
            window.location.href = '../Trifecta2.0-underDev/login.html';
        }, 1000);
    }
}

// Dropdown functionality
function showDropdown() {
    const dropdown = topicsDropdown.querySelector('.dropdown-menu');
    if (dropdown) {
        dropdown.style.display = 'block';
    }
}

function hideDropdown() {
    const dropdown = topicsDropdown.querySelector('.dropdown-menu');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

// Load profile data from localStorage
function loadProfileData() {
    try {
        const savedData = localStorage.getItem('ecolearn_profile');
        if (savedData) {
            const data = JSON.parse(savedData);
            updateProfileDisplay(data);
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

// Update profile display with new data
function updateProfileDisplay(data) {
    Object.keys(data).forEach(key => {
        const input = document.getElementById(key);
        if (input && data[key]) {
            input.value = data[key];
        }
    });

    const profileName = document.getElementById('profileName');
    if (profileName && data.name) {
        profileName.textContent = data.name;
    }
}

// Animate elements on load
function animateElements() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.opacity = '0';
        formContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            formContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            formContainer.style.opacity = '1';
            formContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    const cards = document.querySelectorAll('.profile-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100 + 300);
    });
}

// Animate progress bars
function animateProgressBars() {
    const progressFills = document.querySelectorAll('.progress-fill');
    progressFills.forEach((fill, index) => {
        const targetWidth = fill.style.width;
        fill.style.width = '0';
        setTimeout(() => {
            fill.style.width = targetWidth;
        }, index * 200 + 500); // Stagger animation
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 2000;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
                box-shadow: 0 10px 15px 3px rgba(0, 0, 0, 0.1);
            }
            .notification-success { background: #10b981; }
            .notification-warning { background: #f59e0b; }
            .notification-error { background: #ef4444; }
            .notification-info { background: #3b82f6; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        if (!input.value.trim()) {
            formGroup.classList.add('error');
            isValid = false;
        } else {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        }
    });
    return isValid;
}

// Real-time input validation
document.addEventListener('input', function(e) {
    if (e.target.matches('input[required]')) {
        const formGroup = e.target.closest('.form-group');
        if (e.target.value.trim()) {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');
        } else {
            formGroup.classList.remove('success');
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modals or go back
    if (e.key === 'Escape') {
        if (passwordFormSection.style.display !== 'none') {
            showProfile();
        }
    }
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (profileFormSection.style.display !== 'none') {
            profileForm.dispatchEvent(new Event('submit'));
        } else if (passwordFormSection.style.display !== 'none') {
            passwordForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Handle edit section functionality
function handleEditSection(e) {
    const section = e.target.closest('.profile-card');
    const sectionTitle = section.querySelector('h3').textContent.trim();
    e.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        e.target.style.transform = 'scale(1)';
    }, 150);

    switch(sectionTitle) {
        case 'About':
            showEditModal('about', sectionTitle);
            break;
        case 'Learning Preferences':
            showEditModal('preferences', sectionTitle);
            break;
        case 'Contact & Social':
            showEditModal('contact', sectionTitle);
            break;
        default:
            showEditModal('general', sectionTitle);
    }
}

// Handle avatar edit
function handleAvatarEdit(e) {
    e.preventDefault();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                showNotification('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    // This is a common pattern, but it's better to keep the element and remove it after a delay
    // as some browsers might not handle it correctly. For simplicity, we'll keep the original logic.
    setTimeout(() => document.body.removeChild(fileInput), 500);
}

// Handle edit profile
function handleEditProfile(e) {
    e.preventDefault();
    showEditModal('profile', 'Edit Profile');
}

// Handle share profile
function handleShareProfile(e) {
    e.preventDefault();
    const shareUrl = window.location.href;
    const shareText = "Check out my EcoLearn profile! I'm learning about environmental conservation and sustainability.";

    if (navigator.share) {
        navigator.share({
            title: 'EcoLearn Profile Abhay Aditya R S',
            text: shareText,
            url: shareUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Profile link copied to clipboard!', 'success');
        }).catch(() => {
            // Further fallback: Show share modal
            showShareModal(shareUrl, shareText);
        });
    }
}

// Handle social links.
function handleSocialLink(e) {
    e.preventDefault();
    const platform = e.currentTarget.querySelector('span').textContent;
    const urls = {
        'LinkedIn': 'https://linkedin.com/in/abhay-aditya-rs',
        'Twitter': 'https://twitter.com/abhay_aditya_rs',
        'GitHub': 'https://github.com/abhay-aditya-rs'
    };
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
    } else {
        showNotification(`${platform} profile not configured`, 'warning');
    }
}

// Handle badge clicks
function handleBadgeClick(e) {
    const badgeName = e.currentTarget.querySelector('.badge-name').textContent;
    const badgeDate = e.currentTarget.querySelector('.badge-date').textContent;
    showBadgeModal(badgeName, badgeDate);
}

// Update last seen status
function updateLastSeen() {
    const now = new Date();
    console.log(`Last seen updated: ${now.toISOString()}`);
}

// Modal functionality
function showEditModal(type, title) {
    const modal = createModal(title, getEditModalContent(type));
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
    });

    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal(modal);
        }
    });

    const form = modal.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(type, form);
            closeModal(modal);
        });
    }
}

function showBadgeModal(badgeName, badgeDate) {
    const modal = createModal(`Badge: ${badgeName}`, getBadgeModalContent(badgeName, badgeDate));
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
    });

    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal(modal);
        }
    });
}

function showShareModal(url, text) {
    const modal = createModal('Share Profile', getShareModalContent(url, text));
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => {
        closeModal(modal);
    });

    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal(modal);
        }
    });

    modal.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const textToCopy = e.target.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showNotification('Copied to clipboard!', 'success');
            });
        });
    });
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;

    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            .modal {
                background: white;
                border-radius: 1rem;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px 5px rgba(0, 0, 0, 0.1);
                animation: slideIn 0.3s ease;
            }
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #E4F3D8;
            }
            .modal-header h3 {
                margin: 0;
                color: #374151;
                font-size: 1.125rem;
                font-weight: 600;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6b7280;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.15s;
            }
            .modal-close:hover {
                background: rgba(0, 0, 0, 0.1);
            }
            .modal-body {
                padding: 1.5rem;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    return modal;
}

function closeModal(modal) {
    // Add the fadeOut animation style if it doesn't exist
    if (!document.querySelector('#modal-fadeOut-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-fadeOut-styles';
        styles.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }

    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Modal content generators
function getEditModalContent(type) {
    const formStyles = `
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: border-color 0.15s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3FAA7E;
            box-shadow: 0 0 0 3px rgba(63, 170, 126, 0.1);
        }
        .modal-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }
        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
        }
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: none;
        }
        .btn-primary {
            background: #3FAA7E;
            color: white;
            border: none;
        }
        .btn:hover {
            transform: translateY(-1px);
        }
    `;

    let content = `<style>${formStyles}</style>`;
    switch(type) {
        case 'about':
            content += `
                <form>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" value="abhay.aditya@email.com">
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <input type="text" id="location" value="Bangalore, India">
                    </div>
                    <div class="form-group">
                        <label for="bio">Bio</label>
                        <textarea id="bio" rows="3">Passionate about environmental conservation and sustainable living. Love learning about climate solutions and sharing knowledge with others.</textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            `;
            break;
        case 'preferences':
            content += `
                <form>
                    <div class="form-group">
                        <label for="learningStyle">Learning Style</label>
                        <select id="learningStyle">
                            <option value="visual">Visual & Interactive</option>
                            <option value="auditory">Auditory</option>
                            <option value="reading">Reading/Writing</option>
                            <option value="kinesthetic">Kinesthetic</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dailyGoal">Daily Learning Goal</label>
                        <select id="dailyGoal">
                            <option value="15">15 minutes</option>
                            <option value="30" selected>30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Preferences</button>
                    </div>
                </form>
            `;
            break;
        case 'contact':
            content += `
                <form>
                    <div class="form-group">
                        <label for="linkedin">LinkedIn Profile</label>
                        <input type="url" id="linkedin" placeholder="https://linkedin.com/in/username">
                    </div>
                    <div class="form-group">
                        <label for="twitter">Twitter Handle</label>
                        <input type="text" id="twitter" placeholder="@username">
                    </div>
                    <div class="form-group">
                        <label for="github">GitHub Profile</label>
                        <input type="url" id="github" placeholder="https://github.com/username">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Links</button>
                    </div>
                </form>
            `;
            break;
        default:
            content += `
                <form>
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" value="Abhay Aditya R S">
                    </div>
                    <div class="form-group">
                        <label for="title">Title</label>
                        <input type="text" id="title" value="Eco Warrior">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            `;
    }
    return content;
}

function getBadgeModalContent(badgeName, badgeDate) {
    const badgeDescriptions = {
        'Climate Expert': 'Completed all Climate Change modules with 90% or higher scores.',
        'Biodiversity Champion': 'Demonstrated mastery in understanding ecosystem conservation.',
        '7-Day Streak': 'Maintained consistent learning for 7 consecutive days.',
        'Quiz Master': 'Achieved perfect scores on 5 consecutive quizzes.'
    };
    return `
        <div style="text-align: center; padding: 1rem;">
            <div style="width: 80px; height: 80px; background: #3FAA7E; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: white; font-size: 2rem;">
                <i class="fas fa-medal"></i>
            </div>
            <h4 style="margin-bottom: 0.5rem; color: #374151;">${badgeName}</h4>
            <p style="color: #667280; margin-bottom: 1rem;">Earned on ${badgeDate}</p>
            <p style="color: #374151; line-height: 1.6;">${badgeDescriptions[badgeName] || 'Great achievement in your learning journey!'}</p>
        </div>
    `;
}

function getShareModalContent(url, text) {
    return `
        <div style="text-align: center; padding: 1rem;">
            <h4 style="margin-bottom: 1rem; color: #374151;">Share Your Profile</h4>
            <p style="color: #667280; margin-bottom: 1.5rem;">${text}</p>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">Profile URL: </label>
                <input type="text" value="${url}" readonly style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: #f9fafb;">
                <button class="copy-btn" data-copy="${url}" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #3FAA7E; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Copy URL</button>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}', '_blank')" style="padding: 0.75rem 1.5rem; background: #1d9bf0; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}', '_blank')" style="padding: 0.75rem 1.5rem; background: #0077b5; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </button>
            </div>
        </div>
    `;
}

// Handle form submissions
function handleFormSubmission(type, form) {
    const formData = new FormData(form);
    console.log(`Updating ${type} with data:`, Object.fromEntries(formData));
    showNotification('Profile updated successfully!', 'success');
    setTimeout(() => {
        updateUIAfterEdit(type, Object.fromEntries(formData));
    }, 500);
}

function updateUIAfterEdit(type, data) {
    console.log('UI updated with new data:', data);
}

console.log('Profile page JavaScript loaded successfully!');