const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// Original consolidated routes
router.get('/overview', dashboardController.getOverview);
router.get('/progress', dashboardController.getProgress);
router.get('/competition-preview', dashboardController.getCompetitionPreview);
router.get('/activity', dashboardController.getActivity);

// Individual routes for frontend compatibility
router.get('/stats', dashboardController.getStats);
router.get('/weekly-progress', dashboardController.getWeeklyProgress);
router.get('/goals', dashboardController.getGoals);
router.get('/activity-feed', dashboardController.getActivityFeed);
router.get('/mentor-notes', dashboardController.getMentorNotes);
router.get('/mentor-announcements', dashboardController.getMentorAnnouncements);
router.get('/upcoming-contest', dashboardController.getUpcomingContest);
router.get('/contest-history', dashboardController.getContestHistory);
router.get('/leaderboard', dashboardController.getLeaderboard);
router.get('/primary-cta', dashboardController.getPrimaryCTA);

// Test endpoint to add a user-added problem
router.post('/add-test-problem', dashboardController.addTestProblem);

module.exports = router;
