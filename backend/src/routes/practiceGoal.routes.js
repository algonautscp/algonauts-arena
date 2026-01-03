const express = require('express');
const practiceGoalController = require('../controllers/practiceGoal.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validatePracticeGoal } = require('../middlewares/validation.middleware');

const router = express.Router();

// All practice goals routes require authentication
router.use(authMiddleware);

// POST /api/practice-goals
// Create or overwrite practice goal
router.post('/', validatePracticeGoal, practiceGoalController.createGoal);

// GET /api/practice-goals
// Get user's current practice goal and progress
router.get('/', practiceGoalController.getGoal);

module.exports = router;
