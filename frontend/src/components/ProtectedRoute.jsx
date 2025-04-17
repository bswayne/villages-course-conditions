import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if needed
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function ProtectedRoute({ children }) {
  const { currentUser, loading: authLoading } = useAuth(); // Rename context loading to avoid conflict
  const location = useLocation(); // Get current location

  if (authLoading) {
    // Show a loading indicator while the auth state is being determined
    // Prevents flashing the login page briefly if already logged in
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // Stack items vertically
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh', // Take up most of the viewport height
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Verifying authentication...</Typography>
      </Box>
    );
  }

  if (!currentUser) {
    // User not logged in, redirect to login page
    // Pass the current location in state so we can redirect back after login
    // Use 'replace' to avoid adding the protected route to history when redirecting
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // User is logged in, render the child component (the actual page)
  return children;
}

export default ProtectedRoute;