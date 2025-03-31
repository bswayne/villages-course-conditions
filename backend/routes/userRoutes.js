const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyFirebaseToken = require('../middleware/auth'); // Auth middleware

// All user routes require authentication
router.use(verifyFirebaseToken);

// GET /api/user/profile - Fetch current user's profile
router.get('/profile', userController.getUserProfile);

// PUT /api/user/profile - Update current user's profile
router.put('/profile', userController.updateUserProfile);

module.exports = router;