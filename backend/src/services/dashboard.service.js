const prisma = require('../utils/prisma');

class DashboardService {
  // Get user's rank among all members
  async getUserRank(userId) {
    try {
      // Get user's total solved count (only user-added problems)
      const userSolvedCount = await prisma.problemSolve.count({
        where: {
          userId: userId,
          source: 'USER_ADDED'
        }
      });

      // Simple rank calculation: get all users with their solve counts
      const allUsersWithSolves = await prisma.user.findMany({
        where: {
          role: 'MEMBER'
        },
        select: {
          id: true,
          _count: {
            select: {
              solves: {
                where: {
                  source: 'USER_ADDED'
                }
              }
            }
          }
        },
        orderBy: {
          solves: {
            _count: 'desc'
          }
        }
      });

      // Find the user's rank
      const rank = allUsersWithSolves.findIndex(user => user.id === userId) + 1;

      return {
        rank: userSolvedCount > 0 ? rank : null,
        solvedCount: userSolvedCount
      };
    } catch (error) {
      throw new Error('Failed to calculate user rank');
    }
  }

  // Get practice streak (consecutive days with practice)
  async getPracticeStreak(userId) {
    try {
      const solves = await prisma.problemSolve.findMany({
        where: {
          userId: userId
        },
        select: {
          solvedAt: true
        },
        orderBy: {
          solvedAt: 'desc'
        }
      });

      if (solves.length === 0) {
        return 0;
      }

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Normalize to start of day

      // Create a Set of dates when user practiced
      const practiceDates = new Set();
      solves.forEach(solve => {
        const date = new Date(solve.solvedAt);
        date.setHours(0, 0, 0, 0);
        practiceDates.add(date.toISOString());
      });

      // Check consecutive days backwards from today
      while (practiceDates.has(currentDate.toISOString())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return streak;
    } catch (error) {
      throw new Error('Failed to calculate practice streak');
    }
  }

  // Get session timeline (session-based, not problem-level)
  async getSessionTimeline(userId) {
    try {
      const solves = await prisma.problemSolve.findMany({
        where: {
          userId: userId
        },
        select: {
          solvedAt: true,
          difficulty: true
        },
        orderBy: {
          solvedAt: 'asc'
        }
      });

      if (solves.length === 0) {
        return [];
      }

      // Group solves by date (sessions)
      const sessions = new Map();
      
      solves.forEach(solve => {
        const date = new Date(solve.solvedAt);
        date.setHours(0, 0, 0, 0); // Normalize to start of day
        const dateKey = date.toISOString();
        
        if (!sessions.has(dateKey)) {
          sessions.set(dateKey, {
            sessionDate: date.toISOString(),
            solvedCount: 0,
            difficulties: []
          });
        }
        
        const session = sessions.get(dateKey);
        session.solvedCount++;
        if (solve.difficulty) {
          session.difficulties.push(solve.difficulty);
        }
      });

      // Convert to array and sort by date
      return Array.from(sessions.values())
        .sort((a, b) => new Date(a.sessionDate) - new Date(b.sessionDate))
        .slice(-30); // Last 30 sessions
    } catch (error) {
      throw new Error('Failed to get session timeline');
    }
  }

  // Get difficulty breakdown
  async getDifficultyBreakdown(userId) {
    try {
      const breakdown = await prisma.problemSolve.groupBy({
        by: ['difficulty'],
        where: {
          userId: userId,
          difficulty: {
            not: null
          }
        },
        _count: {
          id: true
        }
      });

      const result = {
        EASY: 0,
        MEDIUM: 0,
        HARD: 0
      };

      breakdown.forEach(item => {
        if (item.difficulty) {
          result[item.difficulty] = item._count.id;
        }
      });

      return result;
    } catch (error) {
      throw new Error('Failed to get difficulty breakdown');
    }
  }

  // Get weak areas (rule-based only)
  async getWeakAreas(userId) {
    try {
      // Get all solves with failures (submissions that weren't accepted)
      const contestSubmissions = await prisma.contestSubmission.findMany({
        where: {
          userId: userId,
          status: {
            not: 'ACCEPTED'
          }
        },
        select: {
          problemUrl: true,
          status: true
        }
      });

      // Get successful solves for comparison
      const successfulSolves = await prisma.problemSolve.findMany({
        where: {
          userId: userId
        },
        select: {
          problemUrl: true,
          difficulty: true
        }
      });

      // Create a map of problem URLs to track attempts vs successes
      const problemStats = new Map();
      
      // Count failures
      contestSubmissions.forEach(submission => {
        const url = submission.problemUrl;
        if (!problemStats.has(url)) {
          problemStats.set(url, { attempts: 0, successes: 0, difficulty: null });
        }
        problemStats.get(url).attempts++;
      });

      // Count successes
      successfulSolves.forEach(solve => {
        const url = solve.problemUrl;
        if (!problemStats.has(url)) {
          problemStats.set(url, { attempts: 0, successes: 0, difficulty: solve.difficulty });
        }
        problemStats.get(url).successes++;
        if (solve.difficulty) {
          problemStats.get(url).difficulty = solve.difficulty;
        }
      });

      // Calculate failure rates and filter for weak areas
      const weakAreas = [];
      
      problemStats.forEach((stats, problemUrl) => {
        const totalAttempts = stats.attempts + stats.successes;
        if (totalAttempts >= 3) { // Only consider problems with multiple attempts
          const failureRate = stats.attempts / totalAttempts;
          
          // Rule-based: failure rate >= 30% indicates weak area
          if (failureRate >= 0.3 && stats.difficulty) {
            weakAreas.push({
              difficulty: stats.difficulty,
              failureRate: failureRate
            });
          }
        }
      });

      // Sort by failure rate and return top areas
      return weakAreas
        .sort((a, b) => b.failureRate - a.failureRate)
        .slice(0, 5); // Top 5 weak areas
    } catch (error) {
      throw new Error('Failed to get weak areas');
    }
  }

  // Get top 5 leaderboard
  async getTop5Leaderboard() {
    try {
      const topUsers = await prisma.user.findMany({
        where: {
          role: 'MEMBER'
        },
        select: {
          id: true,
          name: true
        },
        orderBy: {
          solves: {
            _count: 'desc'
          }
        },
        take: 5
      });

      // Get solve counts for each user
      const leaderboard = await Promise.all(
        topUsers.map(async (user, index) => {
          const solvedCount = await prisma.problemSolve.count({
            where: {
              userId: user.id
            }
          });

          return {
            userId: user.id,
            name: user.name,
            solvedCount: solvedCount,
            rank: index + 1
          };
        })
      );

      return leaderboard;
    } catch (error) {
      throw new Error('Failed to get leaderboard');
    }
  }

  // Get user's practice goals
  async getGoals(userId) {
    try {
      // Get user's practice goals
      const goals = await prisma.practiceGoal.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return goals;
    } catch (error) {
      console.error('Goals service error:', error);
      throw new Error('Failed to fetch goals');
    }
  }

  // Get activity feed
  async getActivityFeed(userId) {
    try {
      const activities = [];
      
      // Get recent practice sessions (last 20)
      const recentSolves = await prisma.problemSolve.findMany({
        where: {
          userId: userId
        },
        select: {
          solvedAt: true,
          difficulty: true,
          problemUrl: true
        },
        orderBy: {
          solvedAt: 'desc'
        },
        take: 20
      });

      // Group by date for session-based entries
      const sessionMap = new Map();
      recentSolves.forEach(solve => {
        const date = new Date(solve.solvedAt);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.toISOString();
        
        if (!sessionMap.has(dateKey)) {
          sessionMap.set(dateKey, {
            type: 'PRACTICE',
            message: `Practice session completed`,
            createdAt: solve.solvedAt,
            problemCount: 0
          });
        }
        sessionMap.get(dateKey).problemCount++;
      });

      activities.push(...Array.from(sessionMap.values()));

      // Get contest participations
      const contestSubmissions = await prisma.contestSubmission.findMany({
        where: {
          userId: userId
        },
        select: {
          submittedAt: true,
          status: true,
          contest: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          submittedAt: 'desc'
        },
        take: 10
      });

      contestSubmissions.forEach(submission => {
        activities.push({
          type: 'CONTEST',
          message: `Participated in ${submission.contest.name}`,
          createdAt: submission.submittedAt
        });
      });

      // Sort all activities by date and limit
      return activities
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20);
    } catch (error) {
      throw new Error('Failed to get activity feed');
    }
  }

  // Get mentor notes for user
  async getMentorNotes(userId) {
    try {
      // For now, return empty array until mentor_notes table is created
      return [];
    } catch (error) {
      throw new Error('Failed to get mentor notes');
    }
  }

  // Get announcements (mock for now - could be implemented as a separate table)
  async getAnnouncements() {
    try {
      // For v1.1, return empty array
      // This could be extended to a proper announcements table later
      return [];
    } catch (error) {
      throw new Error('Failed to get announcements');
    }
  }

  // Get weekly progress data for the last 7 days
  async getWeeklyProgress(userId) {
    try {
      // Get the last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      today.setHours(23, 59, 59, 999);

      // Get problem solves for the last 7 days (only user-added)
      const solves = await prisma.problemSolve.findMany({
        where: {
          userId: userId,
          source: 'USER_ADDED',
          solvedAt: {
            gte: sevenDaysAgo,
            lte: today
          }
        },
        select: {
          solvedAt: true
        },
        orderBy: {
          solvedAt: 'asc'
        }
      });

      // Group solves by date and count them
      const solvesByDate = {};
      solves.forEach(solve => {
        const date = new Date(solve.solvedAt);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toISOString().split('T')[0];
        solvesByDate[dateStr] = (solvesByDate[dateStr] || 0) + 1;
      });

      // Generate the last 7 days with day names and solved counts
      const weeklyData = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dateStr = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];
        
        weeklyData.push({
          date: date.toISOString(),
          day: dayName,
          solvedCount: solvesByDate[dateStr] || 0
        });
      }

      return weeklyData;
    } catch (error) {
      console.error('Weekly progress service error:', error);
      throw new Error('Failed to get weekly progress');
    }
  }

  // Add a test problem solve for testing
  async addTestProblem(userId) {
    try {
      const testProblem = await prisma.problemSolve.create({
        data: {
          userId: userId,
          platform: 'OTHER',
          problemUrl: 'https://example.com/test-problem',
          difficulty: 'EASY',
          source: 'USER_ADDED'
        }
      });

      return testProblem;
    } catch (error) {
      console.error('Add test problem error:', error);
      throw new Error('Failed to add test problem');
    }
  }

  // Get leaderboard with scope support
  async getLeaderboard(userId, scope = 'all-time') {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      // Get top 4 users based on scope
      const topUsers = await prisma.user.findMany({
        where: {
          // Only include users with problem solves
          solves: {
            some: {
              source: 'USER_ADDED',
              ...(scope === 'weekly' && {
                solvedAt: {
                  gte: sevenDaysAgo
                }
              })
            }
          }
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              solves: {
                where: {
                  source: 'USER_ADDED',
                  ...(scope === 'weekly' && {
                    solvedAt: {
                      gte: sevenDaysAgo
                    }
                  })
                }
              }
            }
          }
        },
        orderBy: {
          solves: {
            _count: 'desc'
          }
        },
        take: 4
      });

      // Get current user's data
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              solves: {
                where: {
                  source: 'USER_ADDED',
                  ...(scope === 'weekly' && {
                    solvedAt: {
                      gte: sevenDaysAgo
                    }
                  })
                }
              }
            }
          }
        }
      });

      // Calculate rank for all users
      const allUsers = await prisma.user.findMany({
        where: {
          solves: {
            some: {
              source: 'USER_ADDED',
              ...(scope === 'weekly' && {
                solvedAt: {
                  gte: sevenDaysAgo
                }
              })
            }
          }
        },
        select: {
          id: true,
          _count: {
            select: {
              solves: {
                where: {
                  source: 'USER_ADDED',
                  ...(scope === 'weekly' && {
                    solvedAt: {
                      gte: sevenDaysAgo
                    }
                  })
                }
              }
            }
          }
        },
        orderBy: {
          solves: {
            _count: 'desc'
          }
        }
      });

      // Find current user's rank
      const currentUserRank = allUsers.findIndex(user => user.id === userId) + 1;

      // Calculate weekly delta for each user
      const topUsersWithDelta = await Promise.all(
        topUsers.map(async (user) => {
          const weeklyDelta = await this.calculateWeeklyDelta(user.id);
          const streak = await this.calculateStreak(user.id);
          
          return {
            userId: user.id,
            name: user.name,
            solvedCount: user._count.solves,
            weeklyDelta,
            streak
          };
        })
      );

      // Calculate current user's weekly delta and streak
      const currentUserWeeklyDelta = await this.calculateWeeklyDelta(userId);
      const currentUserStreak = await this.calculateStreak(userId);

      // Check if current user is in top 4
      const isCurrentUserInTop4 = topUsers.some(user => user.id === userId);

      // Prepare response
      const response = {
        top: topUsersWithDelta
      };

      // Add current user if not in top 4
      if (!isCurrentUserInTop4 && currentUser) {
        response.me = {
          rank: currentUserRank,
          solvedCount: currentUser._count.solves,
          weeklyDelta: currentUserWeeklyDelta,
          streak: currentUserStreak
        };
      }

      return response;
    } catch (error) {
      console.error('Leaderboard service error:', error);
      throw new Error('Failed to get leaderboard');
    }
  }

  // Calculate weekly delta (problems solved in last 7 days)
  async calculateWeeklyDelta(userId) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const weeklySolves = await prisma.problemSolve.count({
        where: {
          userId,
          source: 'USER_ADDED',
          solvedAt: {
            gte: sevenDaysAgo
          }
        }
      });

      return weeklySolves;
    } catch (error) {
      console.error('Calculate weekly delta error:', error);
      return 0;
    }
  }

  // Calculate streak (consecutive days with solves)
  async calculateStreak(userId) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);

      const solves = await prisma.problemSolve.findMany({
        where: {
          userId,
          source: 'USER_ADDED',
          solvedAt: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: {
          solvedAt: 'desc'
        }
      });

      if (solves.length === 0) return 0;

      // Group solves by date
      const solvesByDate = {};
      solves.forEach(solve => {
        const date = new Date(solve.solvedAt);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toISOString().split('T')[0];
        solvesByDate[dateStr] = true;
      });

      // Calculate streak
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (solvesByDate[dateStr]) {
          streak++;
        } else if (i > 0) {
          // Break streak if we miss a day (but allow today to be missed)
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Calculate streak error:', error);
      return 0;
    }
  }
}

module.exports = new DashboardService();
