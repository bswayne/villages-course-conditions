import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, onIdTokenChanged, signOut as firebaseSignOut } from '../firebase'; // Adjust path

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idToken, setIdToken] = useState(localStorage.getItem('idToken')); // Initialize from localStorage

  useEffect(() => {
    // Listen for ID token changes (includes login/logout)
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('idToken', token);
        setIdToken(token);
        setCurrentUser(user); // Store the Firebase user object
      } else {
        localStorage.removeItem('idToken');
        setIdToken(null);
        setCurrentUser(null);
      }
      setLoading(false); // Finished initial check
    });

    // Cleanup subscription on unmount
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

  // Add login/signup functions here if you prefer them in the context
  // instead of directly calling firebase methods in components

  const value = {
    currentUser,
    idToken,
    loading,
    logout, // Expose logout function
    // login, signup (if added here)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after initial auth check */}
    </AuthContext.Provider>
  );
}