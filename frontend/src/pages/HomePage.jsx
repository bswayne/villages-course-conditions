import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'; // For Table Container background
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Rating from '@mui/material/Rating';

// Helper function to capitalize first letter
const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

function HomePage() {
  const { courseType } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('Golf Courses');

  useEffect(() => {
    if (courseType) {
      setTitle(`${capitalize(courseType)} Courses`);
    }

    const fetchCourses = async () => {
      if (!courseType) {
        setError("No course type specified.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      setCourses([]);
      try {
        console.log(`Fetching courses with type: ${courseType}`);
        const response = await api.get(`/courses?type=${courseType}`);
        setCourses(response.data);
      } catch (err) {
        console.error(`Error fetching ${courseType} courses:`, err);
        setError(err.response?.data || err.message || `Failed to fetch ${courseType} courses.`);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [courseType]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
        <Typography>Loading {courseType} courses...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!loading && !error && courses.length === 0 && (
         <Typography align="center" sx={{ mt: 4 }}>No {courseType} courses found.</Typography>
      )}

{!error && courses.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label={`${courseType} courses table`}>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                <TableCell>Course Name</TableCell>
                {/* --- CHANGE Header --- */}
                <TableCell align="center">Recent Condition (Avg Rating)</TableCell>
                {/* --- END CHANGE --- */}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow
                  key={course.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {course.locationName}
                  </TableCell>
                  {/* --- CHANGE Cell Content --- */}
                  <TableCell align="center">
                    {course.recentAverageRating !== null ? (
                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Rating
                             name={`avg-rating-${course.id}`}
                             value={course.recentAverageRating}
                             precision={0.1} // Show partial stars
                             readOnly
                             size="small"
                           />
                           <Typography variant="body2">({course.recentAverageRating})</Typography>
                       </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No recent reports
                      </Typography>
                    )}
                  </TableCell>
                  {/* --- END CHANGE --- */}
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      component={RouterLink}
                      to={`/course/${course.id}`}
                    >
                      Details / Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default HomePage;