// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Normalize CSS

import './index.css'; // Keep your Tailwind base styles (or remove if going fully MUI styling)
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext'; // Adjust path if needed

const customGreen = 'rgb(0, 73, 44)';
// Define a basic theme (optional, MUI has a default)
const theme = createTheme({
  // You can customize palette, typography, etc. here
  palette: {
    // Option A: Define it as the primary color
    primary: {
      main: customGreen,
      contrastText: '#ffffff', // Ensure text/icons on primary background are white
    },
    components: {
      MuiButton: {
          styleOverrides: {
              // Target outlined buttons specifically
              outlined: ({ theme, ownerState }) => ({
                  // Example: Make primary outlined buttons use the green
                  ...(ownerState.color === 'primary' && {
                       color: theme.palette.primary.main,
                       borderColor: theme.palette.primary.main,
                       '&:hover': {
                           borderColor: theme.palette.primary.main,
                           backgroundColor: theme.palette.action.hover, // Default hover or customize
                       },
                  }),
                  // Example: Make secondary outlined buttons use the green
                  // ...(ownerState.color === 'secondary' && {
                  //      color: customGreen, // Use direct value if not primary/secondary
                  //      borderColor: customGreen,
                  //      // ... hover ...
                  // }),
              }),
              // Target outlined buttons on dark backgrounds (like AppBar)
              // This is trickier and might need specific context or sx prop still
          }
      },
      MuiAppBar: {
          styleOverrides: {
              // Apply to the root AppBar element
              root: ({ theme }) => ({
                   backgroundColor: theme.palette.primary.main, // Use primary color
                   color: theme.palette.primary.contrastText, // Use contrast text for icons/text
              }),
          }
      }
    }
 }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Apply baseline styles */}
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);