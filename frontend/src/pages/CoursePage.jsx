import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ConditionForm from '../components/ConditionForm'; // Will update this next
import ConditionList from '../components/ConditionList'; // Will update this next
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link'; // MUI Link
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CoursePage() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState(`Course ${courseId}`); // Placeholder
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch conditions function
  const fetchConditions = async () => {
    try {
      const response = await api.get(`/conditions/course/${courseId}`);
      setConditions(response.data);
    } catch (err) {
      console.error("Error fetching conditions:", err);
      setError(err.message || 'Failed to fetch conditions.');
      // Don't clear existing conditions on refresh error
    }
  };

  // Initial data fetch (course details + conditions)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      setConditions([]); // Clear previous conditions on course change
      setShowForm(false); // Hide form on course change
      try {
        // Fetch course details (optional, adjust API if needed)
        try {
             const courseRes = await api.get(`/courses/${courseId}`);
             setCourseName(courseRes.data.name || `Course ${courseId}`);
        } catch (courseErr) {
             console.warn("Could not fetch course details:", courseErr);
             // Keep placeholder name
        }

        // Fetch conditions
        await fetchConditions();

      } catch (err) {
        // Catch errors from fetchConditions here too if needed, though it has its own catch
        console.error("Error fetching course page data:", err);
        setError(err.message || 'Failed to load page data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [courseId]);

  const handleConditionAdded = (newCondition) => {
    setConditions(prev => [newCondition, ...prev]);
    setShowForm(false);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
        <Typography>Loading course conditions...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
       <Box sx={{ mb: 1 }}> {/* Add margin below the button */}
          <Button
             variant="text" // Subtle look
             startIcon={<ArrowBackIcon />}
             onClick={() => navigate(-1)} // Go back one step in history
           >
             Back to Courses
           </Button>
       </Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {courseName} Conditions
      </Typography>

      {/* Only show main error if conditions failed AND list is empty */}
      {error && conditions.length === 0 && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {/* Show error even if list exists, but less prominently? */}
      {/* {error && conditions.length > 0 && <Alert severity="warning" sx={{ mb: 3 }}>Could not refresh conditions: {error}</Alert>} */}

      {/* Add Condition Section */}
      {currentUser ? (
        <Box sx={{ mb: 3 }}>
          {!showForm && (
            <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
              Report Today's Conditions
            </Button>
          )}
          {showForm && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Add New Report</Typography>
                <ConditionForm
                  courseId={courseId}
                  onConditionAdded={handleConditionAdded}
                  onCancel={() => setShowForm(false)}
                />
              </CardContent>
            </Card>
          )}
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/login">Login</Link> to add a condition report.
        </Alert>
      )}

      {/* Condition List Section */}
      <Typography variant="h5" component="h2" gutterBottom>
        Recent Reports
      </Typography>
      <ConditionList conditions={conditions} />

    </Container>
  );
}

export default CoursePage;