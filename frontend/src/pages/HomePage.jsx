
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card'; // <-- Import Card
import CardContent from '@mui/material/CardContent'; // <-- Import CardContent
import CardActions from '@mui/material/CardActions'; // <-- Import CardActions
import Grid from '@mui/material/Grid'; // <-- Import Grid for Card layout spacing
import { useTheme } from '@mui/material/styles'; // <-- Import useTheme
import useMediaQuery from '@mui/material/useMediaQuery'; // <-- Import useMediaQuery

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

function HomePage() {
    const { courseType } = useParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('Golf Courses');

    // --- Media Query Hook ---
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // True for 'xs' and 'sm' screens

    useEffect(() => {
        // ... (fetchCourses logic remains the same) ...
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
            // console.log(`Fetching courses with type: ${courseType}`);
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
      <Container
        maxWidth={isMobile ? false : 'lg'}                                     
        disableGutters={isMobile}         
      sx={{ py: 4 }}
      >
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {title}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {!loading && !error && courses.length === 0 && (
                <Typography align="center" sx={{ mt: 4 }}>No {courseType} courses found.</Typography>
            )}

            {!error && courses.length > 0 && (
                // --- Conditional Rendering based on screen size ---
                isMobile ? (
                  <Box
                  sx={{
                      // If Container has no gutters, mt needs adjustment? Maybe add px here?
                      // px: 2, // Add padding here if Container gutters are disabled
                      mt: 2,
                      width: '100%',          // Set width relative to the Container
                      mx: 'auto',            // Center this Box
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                  }}
              >
                  {courses.map((course) => (
                     <Card
                          key={course.id}
                          variant="outlined"
                      >
                          <CardContent>
                              {/* ... CardContent remains the same ... */}
                               <Typography variant="h6" component="div" gutterBottom>
                                   {course.locationName}
                               </Typography>
                               <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                   <Typography variant="body2" sx={{ mr: 1 }}>
                                       Recent Avg:
                                   </Typography>
                                   {course.recentAverageRating !== null ? (
                                       <Rating
                                           name={`avg-rating-card-${course.id}`}
                                           value={course.recentAverageRating}
                                           precision={0.1}
                                           readOnly
                                           size="small"
                                       />
                                   ) : (
                                       <Typography variant="caption" color="text.secondary">
                                           No reports
                                       </Typography>
                                   )}
                                    {course.recentAverageRating !== null && (
                                       <Typography variant="body2" sx={{ ml: 0.5 }}>
                                            ({course.recentAverageRating})
                                       </Typography>
                                    )}
                               </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'flex-end' }}>
                               {/* ... CardActions remains the same ... */}
                               <Button
                                   size="small"
                                   component={RouterLink}
                                   to={`/course/${course.id}`}
                                   variant="outlined"
                               >
                                   Details / Report
                               </Button>
                          </CardActions>
                      </Card>
                  ))}
              </Box>
                ) : (
                    // --- Desktop View: Table ---
                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table sx={{ minWidth: 650 }} aria-label={`${courseType} courses table`}>
                            <TableHead>
                                <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
                                    <TableCell>Course Name</TableCell>
                                    <TableCell align="center">Recent Condition (Avg Rating)</TableCell>
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
                                        <TableCell align="center">
                                            {course.recentAverageRating !== null ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                    <Rating
                                                        name={`avg-rating-table-${course.id}`}
                                                        value={course.recentAverageRating}
                                                        precision={0.1}
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
                )
            )}
        </Container>
    );
}

export default HomePage;