// src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    auth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider, 
    OAuthProvider,      
    signInWithPopup, 
} from '../firebase'; 
import { useAuth } from '../contexts/AuthContext'; 
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link'; // MUI Link
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider'; 
import Stack from '@mui/material/Stack';   
import GoogleIcon from '@mui/icons-material/Google'; 
import AppleIcon from '@mui/icons-material/Apple';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser, loading: authLoading } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && currentUser) {
            navigate("/select-course-type", { replace: true }); // Redirect to main app area
        }
    }, [currentUser, authLoading, navigate]);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }
        if (password.length < 6) {
            // Firebase enforces minimum length, but good to check client-side
            return setError("Password should be at least 6 characters long.");
        }

        setLoading(true);
        try {
            // --- Create user with Firebase ---
            await createUserWithEmailAndPassword(auth, email, password);
            // --- End Firebase call ---

            // Success: Let the AuthContext listener handle the user state change and redirect
            // Optionally navigate to login page or profile setup page immediately
            // navigate('/profile', { state: { isNewUser: true } }); // Example redirect to profile
            // Or let the useEffect redirect them to the main app page
        } catch (err) {
            console.error('Error signing up:', err);
            setError(getFriendlySignupErrorMessage(err));
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

    // Helper for signup-specific errors
    const getFriendlySignupErrorMessage = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'This email address is already registered. Try logging in.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password is too weak. Please use a stronger password (at least 6 characters).';
            // Add other Firebase signup error codes as needed
            default:
                return error.message || 'An unknown error occurred during sign-up.';
        }
    };

    // Show loading spinner if auth state is loading or if user is already logged in (during redirect)
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
                            Sign Up
                        </Typography>

                        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                        <Box component="form" onSubmit={handleSignupSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
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
                                autoComplete="new-password" // Suggest new password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <TextField // <-- Confirmation Field
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link component={RouterLink} to="/login" variant="body2">
                                        {"Already have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                        
                        {/* --- Divider --- */}
                        <Divider sx={{ width: '100%', my: 2 }}>OR</Divider>
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

export default SignupPage;