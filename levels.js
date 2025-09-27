// ===================================================================
// CRITICAL SETUP CHECKLIST
// ===================================================================
// 1. You MUST paste your unique Firebase config details into section #2 below.
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
const profileName = document.getElementById('profileName');
const profileIcon = document.getElementById('profileIcon');
const logoutBtn = document.getElementById('logout-btn');
const topicsDropdown = document.getElementById('topicsDropdown');
const topicTitle = document.getElementById('topicTitle');


// ===================================================================
// 5. AUTHENTICATION STATE & DATA FETCHING
// ===================================================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in, fetch their data
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const name = userData.name;
      
      // Update the UI with the user's name
      if (profileName) profileName.textContent = name;
      if (profileIcon) profileIcon.textContent = name.charAt(0).toUpperCase();
    } else {
      console.error("No such user document!");
      if (profileName) profileName.textContent = "User";
    }
  } else {
    // User is signed out, redirect to login page
    window.location.href = 'login.html';
  }
});


// ===================================================================
// 6. UI LOGIC & EVENT LISTENERS
// ===================================================================

// Logout Functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).catch((error) => console.error("Sign out error:", error));
    });
}

// Topics Dropdown Toggle
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

// Update page-header container with selected topic from either URL or sessionStorage
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const topicFromURL = params.get('topic');
    const topicFromStorage = sessionStorage.getItem('selectedTopic');
    const currentTopic = topicFromURL || topicFromStorage;

    if (currentTopic && topicTitle) {
        topicTitle.textContent = currentTopic;
    } else if (topicTitle) {
        topicTitle.textContent = 'Select a Topic';
    }
});

// Save topic to sessionStorage when any topic link is clicked
document.querySelectorAll('.dropdown-menu a, .topic-btn').forEach(link => {
    link.addEventListener('click', (event) => {
        const selectedTopic = link.getAttribute('data-topic');
        if (selectedTopic) {
            sessionStorage.setItem('selectedTopic', selectedTopic);
        }
    });
});

