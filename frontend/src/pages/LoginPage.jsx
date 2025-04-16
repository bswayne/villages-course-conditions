import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider, // <-- Import
  OAuthProvider,      // <-- Import
  signInWithPopup,    // <-- Import
} from '../firebase'; // Adjust path if needed
import { useAuth } from '../contexts/AuthContext'; // Adjust path
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Grid } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link'; // MUI Link
import Divider from '@mui/material/Divider'; // <-- Import Divider
import Stack from '@mui/material/Stack';   // <-- Import Stack for button layout
import GoogleIcon from '@mui/icons-material/Google'; // <-- Import Google Icon
import AppleIcon from '@mui/icons-material/Apple';   // <-- Import Apple Icon
import { useLocation } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Single loading state for all login methods for simplicity
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { currentUser, loading: authLoading } = useAuth();
  const from = location.state?.from?.pathname || "/select-course-type";

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate(from, { replace: true }); 
    }
  }, [currentUser, authLoading, navigate, from]);

//   const handleLoginSuccess = () => {
//     // Called after ANY successful login (Email/Pass, Google, Apple)
//     console.log(`Login successful, redirecting to: ${from}`);
//     navigate(from, { replace: true }); // <-- Redirect to 'from' location
// };

const handleEmailPasswordSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // handleLoginSuccess(); // Let useEffect handle redirect based on currentUser change
  } catch (err) {
    console.error('Error signing in with email:', err);
    setError(getFriendlyErrorMessage(err));
  } finally {
    setLoading(false);
  }
};

  // --- Google Sign-In Handler ---
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // handleLoginSuccess(); // Let useEffect handle redirect based on currentUser change
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // --- Apple Sign-In Handler ---
  const handleAppleSignIn = async () => {
    // ... (Apple sign-in logic) ...
   setError('');
   setLoading(true);
   const provider = new OAuthProvider('apple.com');
   provider.addScope('email');
   provider.addScope('name');
   try {
     await signInWithPopup(auth, provider);
    // handleLoginSuccess(); // Let useEffect handle redirect based on currentUser change
   } catch (err) {
     console.error('Error signing in with Apple:', err);
     setError(getFriendlyErrorMessage(err));
   } finally {
     setLoading(false);
   }
 };

  // Helper to make Firebase errors more user-friendly
  const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in window closed before completion.';
        case 'auth/cancelled-popup-request':
            return 'Multiple sign-in windows opened. Please close others and try again.';
        case 'auth/account-exists-with-different-credential':
             return 'An account already exists with the same email address but different sign-in credentials. Try signing in using the original method.';
        // Add more specific cases as needed
        default:
            return error.message || 'An unknown error occurred during sign-in.';
        }
    };


  if (authLoading || (!authLoading && currentUser)) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Sign In
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

            {/* --- Email/Password Form --- */}
            <Box component="form" onSubmit={handleEmailPasswordSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
               {/* Optional Signup Link */}
              <Grid container justifyContent="flex-end">
                 <Grid>
                   <Link component={RouterLink} to="/signup" variant="body2">
                     {"Don't have an account? Sign Up"}
                   </Link>
                 </Grid>
               </Grid>
            </Box>

            {/* --- Divider --- */}
            <Divider sx={{ width: '100%', my: 2 }}>OR</Divider>

            {/* --- Provider Sign-In Buttons --- */}
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
                sx={{ justifyContent: 'center' }} // Center content including icon
              >
                Sign in with Google
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AppleIcon />}
                onClick={handleAppleSignIn}
                disabled={loading}
                // Style Apple button more distinctly if desired
                sx={{
                    backgroundColor: 'common.black', // Apple button background
                    color: 'common.white', // Apple button text
                    justifyContent: 'center',
                    '&:hover': {
                       backgroundColor: '#333', // Darken on hover
                    },
                    // Disabled state will be handled by MUI `disabled` prop styling
                }}
              >
                Sign in with Apple
              </Button>
            </Stack>

          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginPage;