// src/firebase.js (or similar)
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  // Add other auth methods if needed: createUserWithEmailAndPassword, etc.
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, 
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error("Firebase configuration is missing essential values (apiKey, projectId) from environment variables (VITE_FIREBASE_...).");
  // You might want to throw an error or display a message to the user
  // depending on how critical Firebase is immediately.
} else {
  console.log("Firebase config loaded from environment variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
if (firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch(e) {
    console.warn("Failed to initialize Firebase Analytics", e)
  }
} else {
  console.log("Firebase Measurement ID not found, skipping Analytics initialization.");
}
const auth = getAuth(app);

// Export everything needed
export {
  auth,
  analytics,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  GoogleAuthProvider, // <-- Export
  OAuthProvider,      // <-- Export
  signInWithPopup,    // <-- Export
  // Export others as needed
};