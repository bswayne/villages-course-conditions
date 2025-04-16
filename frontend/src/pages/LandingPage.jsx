// src/pages/LandingPage.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// Optional: Add an image or icon
import GolfCourseIcon from '@mui/icons-material/GolfCourse';

function LandingPage() {
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 4, sm: 8 } }}>
            <GolfCourseIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to The Villages Course Conditions
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Get the latest user-reported conditions for Executive and Championship golf courses in The Villages.
            </Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }} // Column on small screens, row on larger
                spacing={2}
                justifyContent="center"
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

            {/* Optional: Add more sections like Features, How it works, etc. */}
            {/* <Box sx={{ mt: 6 }}>
                <Typography variant="h5">Features</Typography>
                // Feature list...
            </Box> */}
        </Container>
    );
}

export default LandingPage;