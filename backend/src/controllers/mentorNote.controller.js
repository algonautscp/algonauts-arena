const mentorNoteService = require('../services/mentorNote.service');

class MentorNoteController {
  // POST /api/mentor-notes
  async createNote(req, res) {
    try {
      const mentorId = req.user.id;
      const { userId, content } = req.body;

      // Validate required fields
      if (!userId || !content) {
        return res.status(400).json({
          message: 'userId and content are required'
        });
      }

      // Create the note
      const note = await mentorNoteService.createNote(mentorId, userId, content);

      res.status(201).json({
        message: 'Mentor note created successfully',
        note: note
      });
    } catch (error) {
      console.error('Mentor note creation error:', error);
      
      if (error.message.includes('Content is required')) {
        return res.status(400).json({
          message: error.message
        });
      }
      
      if (error.message.includes('less than 1000 characters')) {
        return res.status(400).json({
          message: error.message
        });
      }
      
      if (error.message.includes('Target user not found')) {
        return res.status(404).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Failed to create mentor note',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/mentor-notes/:userId
  async getNotesForUser(req, res) {
    try {
      const requesterId = req.user.id;
      const { userId } = req.params;

      const notes = await mentorNoteService.getNotesForUser(requesterId, userId);

      res.json({
        notes: notes
      });
    } catch (error) {
      console.error('Mentor notes fetch error:', error);
      
      if (error.message.includes('Access denied')) {
        return res.status(403).json({
          message: error.message
        });
      }
      
      if (error.message.includes('Requester not found')) {
        return res.status(404).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Failed to fetch mentor notes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/mentor-notes
  async getNotesByMentor(req, res) {
    try {
      const mentorId = req.user.id;

      const notes = await mentorNoteService.getNotesByMentor(mentorId);

      res.json({
        notes: notes
      });
    } catch (error) {
      console.error('Mentor notes fetch error:', error);
      res.status(500).json({
        message: 'Failed to fetch mentor notes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // DELETE /api/mentor-notes/:noteId
  async deleteNote(req, res) {
    try {
      const requesterId = req.user.id;
      const requesterRole = req.user.role;
      const { noteId } = req.params;

      const result = await mentorNoteService.deleteNote(noteId, requesterId, requesterRole);

      res.json(result);
    } catch (error) {
      console.error('Mentor note deletion error:', error);
      
      if (error.message.includes('Note not found')) {
        return res.status(404).json({
          message: error.message
        });
      }
      
      if (error.message.includes('Access denied')) {
        return res.status(403).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Failed to delete mentor note',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new MentorNoteController();
