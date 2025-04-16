import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext'; 
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CoursePage from './pages/CoursePage';
import CourseTypeSelectionPage from './pages/CourseTypeSelectionPage';
import ProfilePage from './pages/ProfilePage';  
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './App.css';

// Helper component to handle root path redirection based on auth state
function RootRedirect() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optionally show a loading indicator here, or rely on ProtectedRoute's loading
    return null; // Or a spinner component
  }

  // If logged in, redirect to the main app page.
  // If not logged in, show the LandingPage.
  return currentUser ? <Navigate to="/select-course-type" replace /> : <LandingPage />;
}

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
        <Routes>
          {/* Public route - Login Page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} /> 
          <Route path="/" element={<RootRedirect />} /> 

          {/* Protected Routes */}
          <Route
            path="/select-course-type" // <-- Route for the selection page
            element={
              <ProtectedRoute>
                <CourseTypeSelectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseType" // <-- Route for filtered course list (HomePage)
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/:courseId" // <-- Route for individual course detail page
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
           {/* Redirect base path '/' to the selection page if logged in */}
           <Route
            path="/"
            element={
              <ProtectedRoute>
                 <Navigate to="/select-course-type" replace />
              </ProtectedRoute>
            }
           />


          {/* Catch-all 404 Route */}
          <Route path="*" element={
             <ProtectedRoute>
                 <Typography variant="h4" align="center">404 - Page Not Found</Typography>
             </ProtectedRoute>
            }
           />
        </Routes>
      </Box>
      {/* Optional Footer */}
    </Box>
  );
}

export default App;
