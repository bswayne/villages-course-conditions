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
const hoverGreenBackground = 'rgba(0, 73, 44, 0.08)';
const hoverGreenText = 'rgb(0, 100, 60)'; 
// Define a basic theme (optional, MUI has a default)
const theme = createTheme({
  // You can customize palette, typography, etc. here
  palette: {
    // Option A: Define it as the primary color
    primary: {
      main: customGreen,
      contrastText: '#ffffff', // Ensure text/icons on primary background are white
    },
    action: {
      // Override the default hover opacity/color if desired (affects many components)
      // hover: hoverGreenBackground,
    },
    components: {
      // --- Button Overrides ---
    MuiButton: {
      styleOverrides: {
        // Target contained buttons (primary color)
        containedPrimary: {
          '&:hover': {
            backgroundColor: hoverGreenText, // Darken slightly on hover
          },
        },
        // Target outlined buttons (primary color)
        outlinedPrimary: {
          '&:hover': {
            backgroundColor: hoverGreenBackground, // Use light background on hover
            borderColor: customGreen, // Keep border color consistent
          },
        },
        // Target text buttons (primary color)
        textPrimary: {
          '&:hover': {
            backgroundColor: hoverGreenBackground, // Use light background on hover
          },
        },
      },
    },
        // --- Link Overrides ---
        MuiLink: {
          styleOverrides: {
            root: ({ theme }) => ({ // Use theme object here
              color: theme.palette.primary.main, // Default link color is primary green
              '&:hover': {
                color: hoverGreenText, // Use the brighter green on hover
                textDecoration: 'underline', // Optional: ensure underline on hover
              },
            }),
          },
        },
        // --- AppBar Overrides (already looks okay, just confirming) ---
    MuiAppBar: {
      styleOverrides: {
          root: ({ theme }) => ({
               backgroundColor: theme.palette.primary.main,
               color: theme.palette.primary.contrastText,
          }),
      }
  },
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