const pageContainer = document.querySelector('.page-container');
const cardTitle = document.getElementById('cardTitle');
const cardSubtitle = document.getElementById('cardSubtitle');
const authForm = document.getElementById('authForm');
const authFooter = document.getElementById('authFooter');
const toggleToSignUp = document.getElementById('toggleToSignUp');

// Switch to Sign Up
toggleToSignUp.addEventListener('click', (e) => {
  e.preventDefault();
  pageContainer.classList.add('slide-left');

  setTimeout(() => {
    cardTitle.textContent = 'Join EcoLearn 🌱';
    cardSubtitle.textContent = 'Create your account to start your journey.';

    authForm.innerHTML = `
      <div class="form-group">
        <label for="name">Name</label>
        <input class="form-input" type="text" id="name" placeholder="Your Name" required>
      </div>
      <div class="form-group">
        <label for="schoolId">School/College ID</label>
        <input class="form-input" type="text" id="schoolId" placeholder="Your ID" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input class="form-input" type="email" id="email" placeholder="your.email@school.edu" required>
      </div>
      <div class="form-group">
        <label for="contact">Contact No.</label>
        <input class="form-input" type="tel" id="contact" placeholder="Your Contact Number" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input class="form-input" type="password" id="password" placeholder="Create a Password" required>
      </div>
      <div class="form-group">
        <label for="institute">Institute Name</label>
        <input class="form-input" type="text" id="institute" placeholder="Your Institute Name" required>
      </div>
      <button type="submit" class="submit-btn">
        <span class="material-symbols-outlined">eco</span> Sign Up
      </button>
    `;

    authFooter.innerHTML = `Already have an account? <a href="#" id="toggleToLogin">Log In</a>`;
    document.getElementById('toggleToLogin').addEventListener('click', toggleToLogin);
  }, 600);
});

// Switch back to Login
function toggleToLogin(e) {
  e.preventDefault();
  pageContainer.classList.remove('slide-left');

  setTimeout(() => {
    cardTitle.textContent = 'Welcome Back! 👋';
    cardSubtitle.textContent = 'Continue your journey to make India greener';

    authForm.innerHTML = `
      <div class="form-group">
        <label for="email">Email</label>
        <input class="form-input" type="email" id="email" placeholder="your.email@school.edu" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input class="form-input" type="password" id="password" placeholder="Enter your password" required>
      </div>
      <button type="submit" class="submit-btn">
        <span class="material-symbols-outlined">eco</span> Log In
      </button>
    `;

    authFooter.innerHTML = `Don't have an account? <a href="#" id="toggleToSignUp">Join EcoLearn</a>`;
    document.getElementById('toggleToSignUp').addEventListener('click', (ev) => {
      ev.preventDefault();
      toggleToSignUp.click();
    });
  }, 600);
}
