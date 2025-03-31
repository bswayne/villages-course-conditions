const express = require('express');
const router = express.Router();
const conditionController = require('../controllers/conditionController');
const verifyFirebaseToken = require('../middleware/auth'); // Auth middleware

// Get conditions for a specific course (public)
router.get('/course/:courseId', conditionController.getConditionsByCourse);

// Add a new condition report (protected)
router.post('/', verifyFirebaseToken, conditionController.addCondition);

module.exports = router;