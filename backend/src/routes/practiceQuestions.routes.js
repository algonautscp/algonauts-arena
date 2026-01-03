const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const practiceQuestionsController = require('../controllers/practiceQuestions.controller');

// Apply auth middleware to all routes
router.use(authMiddleware);

// SECTION 1 - TOPIC-WISE QUESTION BANK

// POST /api/practice-questions/topics (Admin/Mentor only)
router.post('/topics', practiceQuestionsController.createTopic);

// GET /api/practice-questions/topics
router.get('/topics', practiceQuestionsController.getTopics);

// GET /api/practice-questions/topics/:topicId/questions
router.get('/topics/:topicId/questions', practiceQuestionsController.getTopicQuestions);

// POST /api/practice-questions/questions/suggest
router.post('/questions/suggest', practiceQuestionsController.suggestQuestion);

// POST /api/practice-questions/attempt
router.post('/attempt', practiceQuestionsController.updateAttempt);

// SECTION 3 - ADMIN QUESTION MANAGEMENT (Admin/Mentor only)

// GET /api/practice-questions/admin/questions (Admin/Mentor only)
router.get('/admin/questions', practiceQuestionsController.getAllQuestionsAdmin);

// POST /api/practice-questions/admin/questions
router.post('/admin/questions', practiceQuestionsController.createQuestionAdmin);

// PUT /api/practice-questions/admin/questions/:id
router.put('/admin/questions/:id', practiceQuestionsController.updateQuestion);

// DELETE /api/practice-questions/admin/questions/:id
router.delete('/admin/questions/:id', practiceQuestionsController.deleteQuestion);

// PUT /api/practice-questions/admin/questions/:id/approve
router.put('/admin/questions/:id/approve', practiceQuestionsController.approveQuestion);

// PUT /api/practice-questions/admin/questions/:id/reject
router.put('/admin/questions/:id/reject', practiceQuestionsController.rejectQuestion);

// SECTION 2 - USER-SUBMITTED SOLVED QUESTIONS

// GET /api/practice-questions/my-solutions
router.get('/my-solutions', practiceQuestionsController.getMySolutions);

// POST /api/practice-questions/my-solutions
router.post('/my-solutions', practiceQuestionsController.addMySolution);

// PATCH /api/practice-questions/my-solutions/:id
router.patch('/my-solutions/:id', practiceQuestionsController.updateMySolution);

module.exports = router;
