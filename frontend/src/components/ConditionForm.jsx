import React, { useState } from 'react';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack'; // For button layout

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // More robust way
};

function ConditionForm({ courseId, onConditionAdded, onCancel }) {
  const [rating, setRating] = useState('3'); // Use string for Select value
  const [comment, setComment] = useState('');
  const [conditionDate, setConditionDate] = useState(getTodayDateString());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rating || !conditionDate) {
      setError('Please provide a rating and the date played.');
      return;
    }
    setSubmitting(true);

    try {
      const response = await api.post('/conditions', {
        courseId,
        rating: parseInt(rating, 10),
        comment,
        conditionDate,
      });
      onConditionAdded(response.data);
      // No need to clear form here, as the component might unmount or hide
    } catch (err) {
      console.error("Error submitting condition:", err);
      setError(err.response?.data || err.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack spacing={2}> {/* Stack items vertically with spacing */}
        <FormControl fullWidth required>
          <InputLabel id="rating-label">Rating</InputLabel>
          <Select
            labelId="rating-label"
            id="rating"
            value={rating}
            label="Rating"
            onChange={(e) => setRating(e.target.value)}
            disabled={submitting}
          >
            <MenuItem value="5">5 - Excellent</MenuItem>
            <MenuItem value="4">4 - Good</MenuItem>
            <MenuItem value="3">3 - Average</MenuItem>
            <MenuItem value="2">2 - Fair</MenuItem>
            <MenuItem value="1">1 - Poor</MenuItem>
          </Select>
        </FormControl>

        <TextField
          id="conditionDate"
          label="Date Played"
          type="date"
          required
          fullWidth
          value={conditionDate}
          onChange={(e) => setConditionDate(e.target.value)}
          InputLabelProps={{
            shrink: true, // Keep label shrunk for date type
          }}
          disabled={submitting}
        />

        <TextField
          id="comment"
          label="Comments (Optional)"
          multiline
          rows={3}
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={submitting}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={submitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit"/> : null}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ConditionForm;