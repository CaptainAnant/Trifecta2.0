// ===================================================================
// CRITICAL SETUP CHECKLIST - **PLEASE READ**
// ===================================================================
// 1. You MUST paste your unique Firebase config details into section #2 below.
//    This is the most likely reason the page isn't working correctly.
// 2. Make sure you are logged in. This script will redirect to login.html if you are not.
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
  apiKey: "YOUR_API_KEY", // <--- PASTE YOUR KEY HERE
  authDomain: "YOUR_AUTH_DOMAIN", // <--- AND HERE
  projectId: "YOUR_PROJECT_ID", // <--- AND HERE
  storageBucket: "YOUR_STORAGE_BUCKET", // <--- AND HERE
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // <--- AND HERE
  appId: "YOUR_APP_ID" // <--- AND HERE
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
    console.log("User is authenticated:", user.uid);
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const name = userData.name;
      
      // Update the UI with the user's name
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
    console.log("User is not logged in. Redirecting to login.html");
    window.location.href = 'login.html';
  }
});

// ===================================================================
// 5. UI EVENT LISTENERS (RUNS AFTER THE PAGE IS LOADED)
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
            const topic = event.target.getAttribute('data-topic');
            if (topic) {
                sessionStorage.setItem('selectedTopic', topic);
            }
        });
    });
});

