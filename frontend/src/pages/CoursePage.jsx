import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ConditionForm from '../components/ConditionForm'; 
import ConditionList from '../components/ConditionList'; 
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
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState(`Course`); // Placeholder
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const hasDisplayName = !!userProfile?.displayName?.trim();

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
             setCourseName(courseRes.data.locationName || `Course ${courseId}`);
        } catch (courseErr) {
             console.warn("Could not fetch course details:", courseErr);
             setCourseName(`Course ${courseId}`);
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

  if (authLoading || loading){
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


      {/* Add Condition Section */}
      {currentUser ? (
        <Box sx={{ mb: 3 }}>
          {/* Case 1: User has Display Name, show button or form */}
          {hasDisplayName && !showForm && (
            <Button variant="contained" color="primary" onClick={() => setShowForm(true)}>
              Report Today's Conditions
            </Button>
          )}
          {hasDisplayName && showForm && (
            <Card variant="outlined" sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Add New Report</Typography>
                <ConditionForm
                  courseId={courseId}
                  // Pass user's display name to the form if needed for display/confirmation
                  // userDisplayName={userProfile.displayName}
                  onConditionAdded={handleConditionAdded}
                  onCancel={() => setShowForm(false)}
                />
              </CardContent>
            </Card>
          )}

          {/* Case 2: User logged in BUT NO Display Name */}
          {!hasDisplayName && (
            <Alert severity="info">
              Please set up your display name on your profile before submitting condition reports.
              <Button
                 size="small"
                 variant="outlined"
                 sx={{ ml: 2 }}
                 onClick={() => navigate('/profile', { state: { from: location } })} // Navigate to profile, pass current location
               >
                 Go to Profile
               </Button>
            </Alert>
          )}
        </Box>
      ) : (
        // Case 3: User not logged in
        <Alert severity="info" sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/login">Login</Link> to view or add condition reports.
        </Alert>
      )}
      {/* --- End Condition Reporting Section Logic --- */}


      {/* Condition List Section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{mt: 4}}>
        Recent Reports (Last 7 Days)
      </Typography>
      {!loading && conditions.length === 0 && !error && (
          <Typography>No condition reports submitted for this course in the last 7 days.</Typography>
       )}
      {conditions.length > 0 && (
          <ConditionList conditions={conditions} />
       )}
    </Container>
  );
}

export default CoursePage;