// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Normalize CSS

import './index.css'; // Keep your Tailwind base styles (or remove if going fully MUI styling)
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext'; // Adjust path if needed

// Define a basic theme (optional, MUI has a default)
const theme = createTheme({
  // You can customize palette, typography, etc. here
  // palette: {
  //   primary: {
  //     main: '#1976d2', // Example blue color
  //   },
  // },
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