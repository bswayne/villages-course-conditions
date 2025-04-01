import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // For layout inside card
import Rating from '@mui/material/Rating'; // Use MUI Rating component!

// Helper function to format Firestore Timestamp or date string
const formatDate = (input) => {
  // console.log('[formatDate] Input:', input, '| Type:', typeof input); // Log input

  if (!input) return 'Unknown date';

  try {
    let date;

    // Handle Date objects (likely from 'timestamp')
    if (input instanceof Date) {
      date = input;
      // console.log('[formatDate] Handled as Date object:', date);
      // Format using user's locale for timestamps
       return date.toLocaleDateString(undefined, {
         year: 'numeric', month: 'short', day: 'numeric',
       });
    }
    // Handle Firestore Timestamp objects (fallback)
    else if (typeof input === 'object' && input.seconds) {
       date = new Date(input.seconds * 1000);
      //  console.log('[formatDate] Handled as Firestore Timestamp:', date);
       // Format using user's locale for timestamps
        return date.toLocaleDateString(undefined, {
          year: 'numeric', month: 'short', day: 'numeric',
        });
    }
    // Handle 'YYYY-MM-DD' strings (expected for 'date_played')
    else if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
      // console.log('[formatDate] Attempting to handle as YYYY-MM-DD string:', input);

      // OPTION A: Simplest - Split and format manually (avoids Date constructor issues)
      const parts = input.split('-'); // [YYYY, MM, DD]
      if (parts.length === 3) {
           const year = parts[0];
           const monthNum = parseInt(parts[1], 10);
           const day = parseInt(parts[2], 10); // Use parseInt for day

           // Manual month mapping (or use a library/Intl.DateTimeFormat later)
           const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

           if (monthNum >= 1 && monthNum <= 12) {
               const formatted = `${monthNames[monthNum - 1]} ${day}, ${year}`;
              //  console.log('[formatDate] Manual format result:', formatted);
               return formatted;
           }
      }

      return 'Invalid date string';

    }
    // Fallback for unexpected types
    else {
        // console.warn('[formatDate] Unhandled input type:', typeof input, input);
        // Try a generic Date parse as last resort
        date = new Date(input);
        if (!isNaN(date.getTime())) {
           return date.toLocaleDateString(undefined, {
             year: 'numeric', month: 'short', day: 'numeric',
           });
        }
    }

    // If all else fails
    return 'Unknown format';

  } catch (error) {
    console.error("[formatDate] Error:", error, "Input:", input);
    return "Error date";
  }
};

function ConditionList({ conditions }) {
  if (!conditions || conditions.length === 0) {
    return <Typography variant="body1">No condition reports yet.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}> {/* Use gap for spacing */}
      {conditions.map(condition => (
        <Card key={condition.id} variant="outlined">
          <CardContent>
            <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Grid xs={12} sm="auto">
                 {/* Display rating using MUI Rating */}
                 <Rating name={`rating-${condition.id}`} value={condition.rating || 0} readOnly size="small"/>
              </Grid>
              <Grid xs={12} sm>
                <Typography variant="body2" color="text.secondary" align="right">
                  Round played by: {condition.user_display_name || 'Anonymous'} on {formatDate(condition.date_played)}
                </Typography>
              </Grid>
            </Grid>

            {condition.comment && (
              <Typography variant="body1" paragraph> {/* paragraph adds bottom margin */}
                {condition.comment}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" display="block">
              {/* Consider privacy before showing email */}
              {/* Submitted by: {condition.userEmail || 'Anonymous'} */}
              Submitted: {formatDate(condition.timestamp)} {/* Timestamp added by backend */}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default ConditionList;