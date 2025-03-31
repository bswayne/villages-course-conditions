import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CoursePage from './pages/CoursePage';
import CourseTypeSelectionPage from './pages/CourseTypeSelectionPage';
import ProfilePage from './pages/ProfilePage';  
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import SignupPage from './pages/SignupPage'; // If adding signup
// import NotFoundPage from './pages/NotFoundPage'; // If adding 404
import './App.css'; // Keep your global styles

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, sm: 3 } }}>
        <Routes>
          {/* Public route - Login Page */}
          <Route path="/login" element={<LoginPage />} />

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
