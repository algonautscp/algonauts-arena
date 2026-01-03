const express = require('express');
const mentorNoteController = require('../controllers/mentorNote.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');
const { validateMentorNote } = require('../middlewares/validation.middleware');

const router = express.Router();

// All mentor notes routes require authentication
router.use(authMiddleware);

// POST /api/mentor-notes
// Create mentor note (MENTOR or ADMIN only)
router.post('/', requireRole('MENTOR', 'ADMIN'), validateMentorNote, mentorNoteController.createNote);

// GET /api/mentor-notes/:userId
// Get mentor notes for a user (with visibility rules)
router.get('/:userId', mentorNoteController.getNotesForUser);

// GET /api/mentor-notes
// Get notes written by the authenticated mentor
router.get('/', mentorNoteController.getNotesByMentor);

// DELETE /api/mentor-notes/:noteId
// Delete mentor note (by author or admin)
router.delete('/:noteId', mentorNoteController.deleteNote);

module.exports = router;
