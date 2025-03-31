import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton'; // For potential icon button
import AccountCircle from '@mui/icons-material/AccountCircle'; // For layout

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar position="static"> {/* Or "sticky", etc. */}
      <Toolbar>
        {/* Title - Link to Home */}
        <Typography
          variant="h6"
          size={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }} // Inherit color, remove underline
        >
          Villages Course Conditions
        </Typography>

        {/* Navigation Links */}
        <Button color="inherit" component={RouterLink} to="/">
          Courses
        </Button>

        {/* Auth Section */}
        <Box size={{ flexGrow: 1 }}> 
          {currentUser ? (
            <>
              <Typography variant="body2" component="span" sx={{ mr: 2, display: { xs: 'none', sm: 'inline' } }}>
                {currentUser.email}
              </Typography>

              <IconButton
                color="inherit"
                component={RouterLink}
                to="/profile" // <-- Link to the new profile route
                aria-label="account of current user"
                title="Profile" // Tooltip
              >
                <AccountCircle />
              </IconButton>

              <Button color="inherit" variant="outlined" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" variant="outlined" size="small" component={RouterLink} to="/login">
              Login
            </Button>
          )}
          {/* Optional Signup Button */}
          {/* {!currentUser && (
            <Button color="inherit" component={RouterLink} to="/signup" sx={{ ml: 1 }}>
              Sign Up
            </Button>
          )} */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;