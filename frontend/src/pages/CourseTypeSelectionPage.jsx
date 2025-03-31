import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper'; // Use Paper for card-like appearance
import Box from '@mui/material/Box';
import GolfCourseIcon from '@mui/icons-material/GolfCourse'; // Example icon

function CourseTypeSelectionPage() {
  const navigate = useNavigate();

  const handleSelection = (courseType) => {
    // Navigate to the filtered course list page
    navigate(`/courses/${courseType}`); // Use 'executive' or 'championship' in URL
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Select Course Type
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose which type of Villages golf courses you'd like to see conditions for.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {/* Executive Courses Option */}
        <Grid xs={12} sm={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, '&:hover': { boxShadow: 6 }, cursor: 'pointer' }}
            onClick={() => handleSelection('executive')}
          >
            <GolfCourseIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Executive Courses
            </Typography>
            {/* Add a brief description if desired */}
            {/* <Typography variant="body2" color="text.secondary">
              Shorter courses, great for practice.
            </Typography> */}
          </Paper>
        </Grid>

        {/* Championship Courses Option */}
        <Grid xs={12} sm={6}>
           <Paper
            elevation={3}
            sx={{ p: 3, '&:hover': { boxShadow: 6 }, cursor: 'pointer' }}
            onClick={() => handleSelection('championship')}
          >
             <GolfCourseIcon sx={{ fontSize: 40, mb: 1, color: 'secondary.main' }} />
             <Typography variant="h6" gutterBottom>
               Championship Courses
             </Typography>
             {/* <Typography variant="body2" color="text.secondary">
               Longer, more challenging layouts.
             </Typography> */}
           </Paper>
        </Grid>

         {/* Add Pitch & Putt later if needed */}
         {/* <Grid xs={12} sm={6}>
              // ... Paper/Button for Pitch & Putt ... onClick={() => handleSelection('pitch-putt')}
         </Grid> */}

      </Grid>
       {/* Alternatively, use simple buttons */}
       {/* <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
           <Button
               variant="contained"
               size="large"
               onClick={() => handleSelection('executive')}
            >
               Executive Courses
            </Button>
            <Button
               variant="contained"
               size="large"
               color="secondary"
               onClick={() => handleSelection('championship')}
             >
                Championship Courses
             </Button>
       </Box> */}
    </Container>
  );
}

export default CourseTypeSelectionPage;