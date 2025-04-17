import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import executiveImage from '../assets/executive_golf.jpg';
import championshipImage from '../assets/championship_golf.jpg';
import pitchAndPuttImage from '../assets/pitch_and_putt.jpg';


function CourseTypeSelectionPage() {
  const navigate = useNavigate();
  const fixedImageSize = '150px';

  const handleSelection = (courseType) => {
    navigate(`/courses/${courseType}`); 
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Select Course Type
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose which type of Villages golf courses you'd like to see conditions for.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Executive Courses Option */}
        <Grid item xs={12} sm={6} md={4}> {/* Grid handles responsiveness */}
          <Paper
            elevation={1}
            sx={{
              p: 2, // Add padding inside the paper
              '&:hover': { boxShadow: 2 },
              cursor: 'pointer',
              height: '100%', // Ensure cards in the same row have equal height
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Center content horizontally
              justifyContent: 'center' // Center content vertically (optional, adjust spacing if needed)
            }}
            onClick={() => handleSelection('executive')}
          >
            {/* Image with fixed size */}
            <img
              src={executiveImage}
              alt="Executive Golf Course"
              style={{
                width: fixedImageSize, // Apply fixed size
                height: fixedImageSize, // Apply fixed size
                objectFit: 'cover', // Maintain aspect ratio and cover area
                marginBottom: '16px', // Add space below image (theme.spacing(2))
                borderRadius: '4px' // Optional: slightly rounded corners
              }}
              loading="lazy"
            />
            {/* Text Label */}
            <Typography variant="h6" component="div">
              Executive Courses
            </Typography>
          </Paper>
        </Grid>

        {/* Championship Courses Option */}
        <Grid item xs={12} sm={6} md={4}>
           <Paper
             elevation={1}
             sx={{ p: 2, '&:hover': { boxShadow: 2 }, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
             onClick={() => handleSelection('championship')}
           >
             <img
                src={championshipImage}
                alt="Championship Golf Course"
                style={{ width: fixedImageSize, height: fixedImageSize, objectFit: 'cover', marginBottom: '16px', borderRadius: '4px' }}
                loading="lazy"
             />
             <Typography variant="h6" component="div">
               Championship Courses
             </Typography>
           </Paper>
        </Grid>

        {/* Pitch & Putt Option */}
        <Grid item xs={12} sm={6} md={4}>
           <Paper
            elevation={1}
            sx={{ p: 2, '&:hover': { boxShadow: 2 }, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => handleSelection('pitch-putt')}
           >
             <img
                src={pitchAndPuttImage}
                alt="Pitch & Putt Course"
                style={{ width: fixedImageSize, height: fixedImageSize, objectFit: 'cover', marginBottom: '16px', borderRadius: '4px' }}
                loading="lazy"
             />
             <Typography variant="h6" component="div">
               Pitch & Putt
             </Typography>
           </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CourseTypeSelectionPage;