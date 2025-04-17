// src/pages/LandingPage.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper'; // For the app promo background
import Grid from '@mui/material/Grid'; 

import smallImage from '../assets/vcc_small.jpg'; // 329w
import mediumImage from '../assets/vcc_medium.jpg'; // 640w
import fullsizeImage from '../assets/vcc_fullsize.jpg'; // 1496w
import appIcon from '../assets/unofficial_guide_icon.jpg';

import appStoreIcon from '../assets/badge-app-store-286x88.png'; 
import googlePlayIcon from '../assets/badge-google-play-286x88.png';


function LandingPage() {
    const appleLink = "https://apps.apple.com/us/app/unofficial-guide/id6593660910";
    const googleLink = "https://play.google.com/store/apps/details?id=com.unofficialsoftware.guidetothevillages";

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 4, sm: 8 } }}>
             {/* --- Responsive Image --- */}
             <Box sx={{ mb: { xs: 2, sm: 3 }, maxWidth: '700px', mx:'auto' }}> {/* Control max width and center */}
                <img
                    src={mediumImage} // Fallback src
                    srcSet={`
                        ${smallImage} 329w,
                        ${mediumImage} 640w,
                        ${fullsizeImage} 1496w
                    `}
                    sizes="(max-width: 600px) 90vw, (max-width: 900px) 70vw, 650px"
                    alt="Villages Course Conditions Preview"
                    style={{ // Basic responsive image styling
                        display: 'block', // Removes extra space below image
                        width: '100%',    // Make image fill the Box container
                        height: 'auto',   // Maintain aspect ratio
                        borderRadius: '8px' // Optional: adds rounded corners
                    }}
                    loading="lazy" // Improve initial page load
                />
            </Box>
            {/* --- End Image --- */}
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Links Conditions
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Get the latest user-reported conditions for Executive and Championship golf courses in The Villages.
            </Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                justifyContent="center"
                sx={{ mb: 6 }}
            >
                <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/login"
                >
                    Login
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/signup"
                >
                    Sign Up
                </Button>
            </Stack>

            {/* --- App Promotion Section --- */}
            <Paper elevation={1} sx={{ mt: 6, py: 4, px: 2, backgroundColor: 'action.hover' }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Also check out our Mobile App!
                </Typography>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    {/* App Icon */}
                    <Grid item xs={12} sm="auto">
                        <img
                            src={appIcon}
                            alt="Unofficial Guide - The Villages App Icon"
                            style={{ width: '80px', height: '80px', borderRadius: '15px' }}
                        />
                    </Grid>
                    {/* App Name & Store Buttons */}
                    <Grid item xs={12} sm>
                        <Typography variant="h6" component="p" sx={{ mb: 2 }}>
                            Unofficial Guide - The Villages
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            {/* App Store Link/Badge */}
                            <a
                                href={appleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }} // Remove underline from link
                            >
                                <img
                                    src={appStoreIcon}
                                    alt="Download on the App Store"
                                    style={{
                                        width: '120px', // Set desired width
                                        height: 'auto',   // Maintain aspect ratio
                                        verticalAlign: 'middle' // Align images nicely if heights differ slightly
                                    }}
                                />
                            </a>
                            {/* Google Play Link/Badge */}
                            <a
                                href={googleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                            >
                                 <img
                                    src={googlePlayIcon}
                                    alt="Get it on Google Play"
                                    style={{
                                        width: '120px', // Set desired width
                                        height: 'auto',
                                        verticalAlign: 'middle'
                                    }}
                                />
                             </a>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
            {/* --- End App Promotion Section --- */}


        </Container>
    );
}

export default LandingPage;