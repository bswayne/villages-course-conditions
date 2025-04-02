require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const verifyFirebaseToken = require('./middleware/auth'); // Keep for example protected route

// --- Route Imports ---
const courseRoutes = require('./routes/courseRoutes');
const conditionRoutes = require('./routes/conditionRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// --- Middleware ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use env variable
    credentials: true,
}));
app.use(express.json()); // Middleware to parse JSON bodies

// --- Basic Routes ---
app.get('/', (req, res) => {
    res.send('Hello from Villages Course Conditions API!');
});

// Example protected route (keep or remove as needed)
app.get('/protected', verifyFirebaseToken, (req, res) => {
    res.send(`Hello, ${req.user.email}. Your UID is ${req.user.uid}`);
});

// --- API Routes ---
app.use('/api/courses', courseRoutes);
app.use('/api/conditions', conditionRoutes);
app.use('/api/user', userRoutes); 

// --- Basic Error Handling (Add more specific handling later) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);
// --- Start Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (process.env.NODE_ENV !== 'production' && process.env.FRONTEND_URL) {
        console.log(`Allowing CORS for local development origin: ${process.env.FRONTEND_URL}`);
   }
});