// ===================================================================
// CRITICAL SETUP CHECKLIST - **PLEASE READ**
// ===================================================================
// THE SCRIPT IS NOT WORKING BECAUSE OF STEP #3.
//
// 1. Your Firebase config details are filled in.
// 2. In Firebase, Authentication -> Sign-in method, "Email/Password" is ENABLED.
// 3. In your login.html file, you MUST change your script tag to include `type="module"`.
//
//    Find this line at the bottom of login.html:
//    <script src="login.js"></script>
//
//    And CHANGE IT TO THIS:
//    <script type="module" src="login.js"></script>
//
// ===================================================================


// ===================================================================
// 1. FIREBASE SDK IMPORTS
// ===================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===================================================================
// 2. YOUR FIREBASE CONFIGURATION
// ===================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAqNEhChaAs-1x6GK_2D6clsmDRh1e__GA",
  authDomain: "ecolearn-8f47c.firebaseapp.com",
  projectId: "ecolearn-8f47c",
  storageBucket: "ecolearn-8f47c.firebasestorage.app",
  messagingSenderId: "687303214463",
  appId: "1:687303214463:web:e8c7b64a72c2e118a4064a",
  measurementId: "G-41EXNW7W27"
};


// ===================================================================
// 3. INITIALIZE FIREBASE & GET REFERENCES
// ===================================================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ===================================================================
// 4. DOM ELEMENT REFERENCES
// ===================================================================
const pageContainer = document.querySelector('.page-container');
const cardTitle = document.getElementById('cardTitle');
const cardSubtitle = document.getElementById('cardSubtitle');
const authForm = document.getElementById('authForm');
const authFooter = document.getElementById('authFooter');

// Create an error message element to be used later
const errorMessage = document.createElement('p');
errorMessage.className = 'error-message';
errorMessage.style.color = '#ef4444';
errorMessage.style.fontSize = '0.85rem';
errorMessage.style.textAlign = 'center';
errorMessage.style.marginTop = '1rem';
errorMessage.style.display = 'none';
authForm.insertAdjacentElement('afterend', errorMessage);


// ===================================================================
// 5. UI LOGIC (Your original code, adapted for Firebase)
// ===================================================================

// Initial Login Form HTML
function setLoginForm() {
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
        <span class="material-symbols-outlined">login</span> Log In
      </button>
    `;

    authFooter.innerHTML = `Don't have an account? <a href="#" id="toggleToSignUp">Join EcoLearn</a>`;
}

// Initial Sign Up Form HTML
function setSignUpForm() {
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
        <label for="institute">Institute Name</label>
        <input class="form-input" type="text" id="institute" placeholder="Your Institute Name" required>
      </div>
       <div class="form-group">
        <label for="contact">Contact No.</label>
        <input class="form-input" type="tel" id="contact" placeholder="Your Contact Number" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input class="form-input" type="email" id="email" placeholder="your.email@school.edu" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input class="form-input" type="password" id="password" placeholder="Create a Password" required>
      </div>
      <button type="submit" class="submit-btn">
        <span class="material-symbols-outlined">eco</span> Sign Up
      </button>
    `;

    authFooter.innerHTML = `Already have an account? <a href="#" id="toggleToLogin">Log In</a>`;
}

// Switch to Sign Up
function switchToSignUp() {
  pageContainer.classList.add('slide-left');
  setTimeout(setSignUpForm, 600);
}

// Switch back to Login
function switchToLogin() {
  pageContainer.classList.remove('slide-left');
  setTimeout(setLoginForm, 600);
}

// Set the initial form on page load
setLoginForm();

// DELEGATED EVENT LISTENER for toggling forms
authFooter.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        e.preventDefault();
        if (e.target.id === 'toggleToSignUp') {
            switchToSignUp();
        }
        if (e.target.id === 'toggleToLogin') {
            switchToLogin();
        }
    }
});


// ===================================================================
// 6. MAIN AUTHENTICATION LOGIC
// ===================================================================

// Function to provide user-friendly error messages
function getFriendlyErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please log in.';
        case 'auth/invalid-credential':
             return 'Incorrect email or password. Please try again.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = authForm.querySelector('.submit-btn');
  
  // Disable button and clear previous errors
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';
  errorMessage.style.display = 'none';

  // Determine if we are in login or signup mode by checking for a unique field
  const isLoginMode = !document.getElementById('name'); 

  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
      
    if (isLoginMode) {
      // --- LOGIN LOGIC ---
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = 'index.html'; 
    } else {
      // --- SIGN UP LOGIC ---
      const name = document.getElementById('name').value;
      const schoolId = document.getElementById('schoolId').value;
      const institute = document.getElementById('institute').value;
      const contact = document.getElementById('contact').value;

      if (!name || !schoolId || !institute || !contact) {
          throw new Error("Please fill out all fields.");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        schoolId: schoolId,
        institute: institute,
        contact: contact,
        email: user.email,
        createdAt: new Date(),
        ecoPoints: 0,
        level: 1,
        badges: [],
        jars: 0
      });
      
      window.location.href = 'index.html';
    }
  } catch (error) {
    // --- ERROR HANDLING ---
    console.error('Authentication Error:', error);
    errorMessage.textContent = getFriendlyErrorMessage(error); // Use the new function here
    errorMessage.style.display = 'block';
    submitBtn.disabled = false;
    // Restore button text after error
    if (isLoginMode) {
        submitBtn.innerHTML = `<span class="material-symbols-outlined">login</span> Log In`;
    } else {
        submitBtn.innerHTML = `<span class="material-symbols-outlined">eco</span> Sign Up`;
    }
  }
});

