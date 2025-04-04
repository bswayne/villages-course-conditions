import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, onIdTokenChanged, signOut as firebaseSignOut } from '../firebase'; // Adjust path
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState(localStorage.getItem('idToken')); // Initialize from localStorage

  // Function to fetch profile from backend
  const fetchUserProfile = async () => {
    try {
        // The api instance should automatically add the token from localStorage
        const response = await api.get('/user/profile');
        // console.log("Fetched user profile in AuthContext:", response.data);
        setUserProfile(response.data);
    } catch (error) {
        console.error("AuthContext: Failed to fetch user profile:", error);
        // Decide how to handle profile fetch error - maybe set profile to a default?
        // Setting to null indicates profile couldn't be fetched reliably.
        setUserProfile(null);
    }
};

  useEffect(() => {
    // Listen for ID token changes (includes login/logout)
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('idToken', token);
        setIdToken(token);
        setCurrentUser(user);
        await fetchUserProfile(); 
      } else {
        localStorage.removeItem('idToken');
        setIdToken(null);
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false); // Finished initial check
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // State update will be handled by onIdTokenChanged listener
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const refreshUserProfile = async () => {
    if (currentUser) { // Only fetch if logged in
       await fetchUserProfile();
    }
  };
  // Add login/signup functions here if you prefer them in the context
  // instead of directly calling firebase methods in components

  const value = {
    currentUser,
    userProfile, // <-- Expose profile data
    idToken,
    loading,
    logout,
    refreshUserProfile, // <-- Expose refresh function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after initial auth check */}
    </AuthContext.Provider>
  );
}