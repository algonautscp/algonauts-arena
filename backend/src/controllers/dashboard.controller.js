const dashboardService = require('../services/dashboard.service');

class DashboardController {
  // GET /api/dashboard/overview
  async getOverview(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user's rank and solved count
      const rankData = await dashboardService.getUserRank(userId);
      
      // Get practice streak
      const practiceStreak = await dashboardService.getPracticeStreak(userId);

      res.json({
        rank: rankData.rank,
        practiceStreak: practiceStreak,
        solvedCount: rankData.solvedCount
      });
    } catch (error) {
      console.error('Dashboard overview error:', error);
      res.status(500).json({
        message: 'Failed to fetch dashboard overview',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/stats
  async getStats(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user's rank and solved count
      const rankData = await dashboardService.getUserRank(userId);
      
      // Get practice streak
      const practiceStreak = await dashboardService.getPracticeStreak(userId);

      res.json({
        rank: rankData.rank,
        streak: practiceStreak,
        problemsSolved: rankData.solvedCount,
        rating: rankData.solvedCount * 20 + 1000, // Mock rating calculation
        weeklyProgress: [65, 78, 82, 71, 89, 93, 87] // Mock weekly progress
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({
        message: 'Failed to fetch dashboard stats',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/weekly-progress
  async getWeeklyProgress(req, res) {
    try {
      const userId = req.user.id;
      
      // Get the last 7 days of practice data
      const weeklyData = await dashboardService.getWeeklyProgress(userId);
      
      res.json({
        days: weeklyData
      });
    } catch (error) {
      console.error('Weekly progress error:', error);
      res.status(500).json({
        message: 'Failed to fetch weekly progress',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/goals
  async getGoals(req, res) {
    try {
      const userId = req.user.id;
      
      const goals = await dashboardService.getGoals(userId);

      res.json(goals);
    } catch (error) {
      console.error('Goals error:', error);
      res.status(500).json({
        message: 'Failed to fetch goals',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/progress
  async getProgress(req, res) {
    try {
      const userId = req.user.id;
      
      // Get session timeline
      const sessionTimeline = await dashboardService.getSessionTimeline(userId);
      
      // Get difficulty breakdown
      const difficultyBreakdown = await dashboardService.getDifficultyBreakdown(userId);
      
      // Get weak areas
      const weakAreas = await dashboardService.getWeakAreas(userId);

      res.json({
        sessionTimeline: sessionTimeline,
        difficultyBreakdown: difficultyBreakdown,
        weakAreas: weakAreas
      });
    } catch (error) {
      console.error('Dashboard progress error:', error);
      res.status(500).json({
        message: 'Failed to fetch dashboard progress',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/competition-preview
  async getCompetitionPreview(req, res) {
    try {
      const userId = req.user.id;
      
      // Get top 5 leaderboard
      const top5 = await dashboardService.getTop5Leaderboard();
      
      // Get current user's rank
      const userRankData = await dashboardService.getUserRank(userId);

      const myRank = {
        rank: userRankData.rank,
        solvedCount: userRankData.solvedCount
      };

      res.json({
        top5: top5,
        myRank: myRank
      });
    } catch (error) {
      console.error('Dashboard competition preview error:', error);
      res.status(500).json({
        message: 'Failed to fetch competition preview',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/activity
  async getActivity(req, res) {
    try {
      const userId = req.user.id;
      
      // Get activity feed
      const activityFeed = await dashboardService.getActivityFeed(userId);
      
      // Get mentor notes
      const mentorNotes = await dashboardService.getMentorNotes(userId);
      
      // Get announcements
      const announcements = await dashboardService.getAnnouncements();

      res.json({
        activityFeed: activityFeed,
        mentorNotes: mentorNotes,
        announcements: announcements
      });
    } catch (error) {
      console.error('Dashboard activity error:', error);
      res.status(500).json({
        message: 'Failed to fetch dashboard activity',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/activity-feed
  async getActivityFeed(req, res) {
    try {
      const userId = req.user.id;
      
      const activityFeed = await dashboardService.getActivityFeed(userId);

      res.json(activityFeed);
    } catch (error) {
      console.error('Activity feed error:', error);
      res.status(500).json({
        message: 'Failed to fetch activity feed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/mentor-notes
  async getMentorNotes(req, res) {
    try {
      const userId = req.user.id;
      
      const mentorNotes = await dashboardService.getMentorNotes(userId);

      res.json(mentorNotes);
    } catch (error) {
      console.error('Mentor notes error:', error);
      res.status(500).json({
        message: 'Failed to fetch mentor notes',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/mentor-announcements
  async getMentorAnnouncements(req, res) {
    try {
      const announcements = await dashboardService.getAnnouncements();

      res.json(announcements);
    } catch (error) {
      console.error('Mentor announcements error:', error);
      res.status(500).json({
        message: 'Failed to fetch mentor announcements',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/upcoming-contest
  async getUpcomingContest(req, res) {
    try {
      // Mock upcoming contest data
      const upcomingContest = {
        id: 'mock-contest-id',
        name: 'Weekly Coding Challenge',
        date: '2024-01-07',
        time: '18:00 UTC',
        duration: '2 hours',
        type: 'Algorithmic',
        status: 'upcoming'
      };

      res.json(upcomingContest);
    } catch (error) {
      console.error('Upcoming contest error:', error);
      res.status(500).json({
        message: 'Failed to fetch upcoming contest',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/contest-history
  async getContestHistory(req, res) {
    try {
      // Mock contest history data
      const contestHistory = [
        {
          id: 'contest-1',
          name: 'New Year Contest',
          date: '2024-01-01',
          time: '16:00 UTC',
          duration: '3 hours',
          type: 'Marathon',
          status: 'completed'
        },
        {
          id: 'contest-2',
          name: 'Speed Round',
          date: '2023-12-28',
          time: '20:00 UTC',
          duration: '1 hour',
          type: 'Speed',
          status: 'completed'
        },
        {
          id: 'contest-3',
          name: 'Algorithm Masters',
          date: '2023-12-24',
          time: '18:00 UTC',
          duration: '2.5 hours',
          type: 'Algorithmic',
          status: 'completed'
        }
      ];

      res.json(contestHistory);
    } catch (error) {
      console.error('Contest history error:', error);
      res.status(500).json({
        message: 'Failed to fetch contest history',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/leaderboard
  async getLeaderboard(req, res) {
    try {
      const userId = req.user.id;
      const { scope = 'all-time' } = req.query;
      
      // Validate scope parameter
      if (!['all-time', 'weekly'].includes(scope)) {
        return res.status(400).json({
          message: 'Invalid scope. Must be "all-time" or "weekly"'
        });
      }
      
      // Get leaderboard data with scope
      const leaderboardData = await dashboardService.getLeaderboard(userId, scope);

      res.json(leaderboardData);
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({
        message: 'Failed to fetch leaderboard',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // GET /api/dashboard/primary-cta
  async getPrimaryCTA(req, res) {
    try {
      // Mock context-aware CTA logic
      const primaryCTA = {
        type: 'start_daily',
        title: "Start Today's Practice",
        description: 'Begin your daily practice session',
        actionUrl: '/practice/daily',
        priority: 90
      };

      res.json(primaryCTA);
    } catch (error) {
      console.error('Primary CTA error:', error);
      res.status(500).json({
        message: 'Failed to fetch primary CTA',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // POST /api/dashboard/add-test-problem
  async addTestProblem(req, res) {
    try {
      const userId = req.user.id;
      
      // Add a test problem solve
      const testProblem = await dashboardService.addTestProblem(userId);
      
      res.json({
        message: 'Test problem added successfully',
        problem: testProblem
      });
    } catch (error) {
      console.error('Add test problem error:', error);
      res.status(500).json({
        message: 'Failed to add test problem',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new DashboardController();
