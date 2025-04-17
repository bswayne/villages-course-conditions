import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton'; 
import AccountCircle from '@mui/icons-material/AccountCircle'; // For layout

const customGreen = 'rgb(0, 73, 44)';
const contrastColor = '#ffffff'; 

function Navbar() {
  
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = userProfile?.displayName || currentUser?.email || 'User';
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar position="static" color="primary">
    <Toolbar>
      <Button color="inherit" component={RouterLink} to="/select-course-type">
        Courses
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {currentUser ? (
          <>
            {/* --- Use derived displayName --- */}
            <Typography variant="body2" component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
               {displayName}
             </Typography>
             {/* --- End Change --- */}

            <IconButton /* Profile Button */
              color="inherit"
              component={RouterLink}
              to="/profile"
              aria-label="account of current user"
              title="Profile"
            >
              <AccountCircle />
            </IconButton>

            <Button /* Logout Button */
              color="inherit"
              variant="outlined"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
           <Button /* Login Button */
             color="inherit"
             variant="outlined"
             size="small"
             component={RouterLink}
             to="/login"
           >
             Login
           </Button>
         )}
      </Box>
    </Toolbar>
  </AppBar>
);
}

export default Navbar;