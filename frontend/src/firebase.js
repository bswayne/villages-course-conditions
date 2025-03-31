// src/firebase.js (or similar)
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  GoogleAuthProvider, // <-- Import Google provider
  OAuthProvider,      // <-- Import generic OAuth provider for Apple
  signInWithPopup,    // <-- Import signInWithPopup
  // Add other auth methods if needed: createUserWithEmailAndPassword, etc.
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig'; // Ensure path is correct

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional
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