// ===================================================================
// CRITICAL SETUP CHECKLIST
// ===================================================================
// 1. You MUST paste your unique Firebase config details into section #2 below.
// 2. This script redirects to login.html if no user is logged in.
// ===================================================================


// ===================================================================
// 1. FIREBASE SDK IMPORTS
// ===================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===================================================================
// 2. PASTE YOUR FIREBASE CONFIGURATION HERE
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
// 4. AUTHENTICATION STATE & DATA FETCHING
// ===================================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in.
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const name = userData.name;
      
      const profileName = document.getElementById('profileName');
      const profileIcon = document.getElementById('profileIcon');

      if (profileName) profileName.textContent = name;
      if (profileIcon) profileIcon.textContent = name.charAt(0).toUpperCase();

    } else {
      console.error("No user profile found in the database for this user.");
      const profileName = document.getElementById('profileName');
      if (profileName) profileName.textContent = "User";
    }
  } else {
    // User is signed out, redirect to login page.
    window.location.href = 'login.html';
  }
});


// =I==================================================================
// 5. EVENT LISTENERS FOR UI ELEMENTS
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const topicsDropdown = document.getElementById('topicsDropdown');

    // --- Logout Functionality ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch((error) => console.error("Sign out error:", error));
        });
    }

    // --- Topics Dropdown Toggle ---
    if (topicsDropdown) {
        topicsDropdown.addEventListener('click', (event) => {
            event.stopPropagation();
            topicsDropdown.classList.toggle('active');
        });
    }

    // --- Close dropdown when clicking outside ---
    document.addEventListener('click', (event) => {
        if (topicsDropdown && !topicsDropdown.contains(event.target)) {
            topicsDropdown.classList.remove('active');
        }
    });

    // --- Pass the selected topic to the levels page ---
    document.querySelectorAll('.topic-btn, .dropdown-menu a').forEach(item => {
        item.addEventListener('click', (event) => {
            // NOTE: The default link behavior will navigate to levels.html
            const topic = event.target.getAttribute('data-topic');
            if (topic) {
                sessionStorage.setItem('selectedTopic', topic);
            }
        });
    });
});
