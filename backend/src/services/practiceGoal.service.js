const prisma = require('../utils/prisma');

class PracticeGoalService {
  // Create or overwrite practice goal for user
  async createOrUpdateGoal(userId, weeklyTarget, minDifficulty) {
    try {
      // Validate inputs
      if (!weeklyTarget || weeklyTarget < 1 || weeklyTarget > 100) {
        throw new Error('Weekly target must be between 1 and 100');
      }

      if (!minDifficulty || !['EASY', 'MEDIUM', 'HARD'].includes(minDifficulty)) {
        throw new Error('Minimum difficulty must be EASY, MEDIUM, or HARD');
      }

      // For now, return a mock goal until practice_goals table is created
      return {
        id: 'mock-goal-id',
        userId: userId,
        weeklyTarget: weeklyTarget,
        minDifficulty: minDifficulty,
        createdAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to create practice goal: ${error.message}`);
    }
  }

  // Get user's current practice goal
  async getUserGoal(userId) {
    try {
      // For now, return null until practice_goals table is created
      return null;
    } catch (error) {
      throw new Error('Failed to get practice goal');
    }
  }

  // Get user's progress towards their goal
  async getGoalProgress(userId) {
    try {
      const goal = await this.getUserGoal(userId);
      
      if (!goal) {
        return {
          goal: null,
          progress: null
        };
      }

      // Get solves from the start of the current week
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);

      const weeklySolves = await prisma.problemSolve.count({
        where: {
          userId: userId,
          solvedAt: {
            gte: weekStart
          },
          difficulty: {
            gte: goal.minDifficulty
          }
        }
      });

      const progress = {
        weeklyTarget: goal.weeklyTarget,
        currentProgress: weeklySolves,
        percentage: Math.round((weeklySolves / goal.weeklyTarget) * 100),
        isCompleted: weeklySolves >= goal.weeklyTarget
      };

      return {
        goal: goal,
        progress: progress
      };
    } catch (error) {
      throw new Error('Failed to get goal progress');
    }
  }
}

module.exports = new PracticeGoalService();
