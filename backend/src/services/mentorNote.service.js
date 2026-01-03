const prisma = require('../utils/prisma');

class MentorNoteService {
  // Create mentor note for user
  async createNote(mentorId, userId, content) {
    try {
      // Validate inputs
      if (!content || content.trim().length === 0) {
        throw new Error('Content is required');
      }

      if (content.length > 1000) {
        throw new Error('Content must be less than 1000 characters');
      }

      // For now, return a mock note until mentor_notes table is created
      return {
        id: 'mock-note-id',
        mentorId: mentorId,
        userId: userId,
        content: content.trim(),
        createdAt: new Date(),
        mentor: {
          name: 'Test Mentor'
        },
        user: {
          name: 'Test User'
        }
      };
    } catch (error) {
      throw new Error(`Failed to create mentor note: ${error.message}`);
    }
  }

  // Get mentor notes for a user (with visibility rules)
  async getNotesForUser(requesterId, targetUserId) {
    try {
      // For now, return empty array until mentor_notes table is created
      return [];
    } catch (error) {
      throw new Error(`Failed to get mentor notes: ${error.message}`);
    }
  }

  // Get notes written by a mentor
  async getNotesByMentor(mentorId) {
    try {
      // For now, return empty array until mentor_notes table is created
      return [];
    } catch (error) {
      throw new Error('Failed to get mentor notes');
    }
  }

  // Delete mentor note (only by the mentor who wrote it or admin)
  async deleteNote(noteId, requesterId, requesterRole) {
    try {
      // For now, return success until mentor_notes table is created
      return { message: 'Note deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete mentor note: ${error.message}`);
    }
  }
}

module.exports = new MentorNoteService();
