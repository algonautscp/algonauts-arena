const practiceGoalService = require('../services/practiceGoal.service');

class PracticeGoalController {
  // POST /api/practice-goals
  async createGoal(req, res) {
    try {
      const userId = req.user.id;
      const { weeklyTarget, minDifficulty } = req.body;

      // Validate required fields
      if (!weeklyTarget || !minDifficulty) {
        return res.status(400).json({
          message: 'weeklyTarget and minDifficulty are required'
        });
      }

      // Create or update goal
      const goal = await practiceGoalService.createOrUpdateGoal(
        userId,
        weeklyTarget,
        minDifficulty
      );

      res.status(201).json({
        message: 'Practice goal created successfully',
        goal: goal
      });
    } catch (error) {
      console.error('Practice goal creation error:', error);
      
      if (error.message.includes('between 1 and 100')) {
        return res.status(400).json({
          message: error.message
        });
      }
      
      if (error.message.includes('EASY, MEDIUM, or HARD')) {
        return res.status(400).json({
          message: error.message
        });
      }

      res.status(500).json({
        message: 'Failed to create practice goal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/practice-goals (for completeness)
  async getGoal(req, res) {
    try {
      const userId = req.user.id;
      
      const goalProgress = await practiceGoalService.getGoalProgress(userId);

      res.json(goalProgress);
    } catch (error) {
      console.error('Practice goal fetch error:', error);
      res.status(500).json({
        message: 'Failed to fetch practice goal',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new PracticeGoalController();
