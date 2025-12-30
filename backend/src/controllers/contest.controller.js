const prisma = require("../utils/prisma");

async function createContest(req, res) {
  try {
    const { title, startTime, endTime, isTeamBased } = req.body;
    const name = title;
    if (!name || !startTime || !endTime) {
      return res.status(400).json({
        message: "Name, startTime and endTime are required",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "endTime must be after startTime",
      });
    }

    const contest = await prisma.contest.create({
      data: {
        name,
        startTime: start,
        endTime: end,
        isTeamBased: Boolean(isTeamBased),
      },
    });

    res.status(201).json({
      message: "Contest created successfully",
      contest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create contest",
    });
  }
}

async function addProblemToContest(req, res) {
  try {
    const { contestId } = req.params;
    const { problemUrl, points } = req.body;

    if (!problemUrl) {
      return res.status(400).json({
        message: "problemUrl is required",
      });
    }

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const existing = await prisma.contestProblem.findFirst({
      where: {
        contestId,
        problemUrl,
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Problem already added to contest",
      });
    }

    const problem = await prisma.contestProblem.create({
      data: {
        contestId,
        problemUrl,
        points,
      },
    });

    res.status(201).json({
      message: "Problem added to contest",
      problem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add problem",
    });
  }
}

function getContestStatus(contest) {
  const now = new Date();

  if (now < contest.startTime) return "UPCOMING";
  if (now > contest.endTime) return "FINISHED";
  return "RUNNING";
}

async function listContests(req, res) {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { startTime: "desc" },
    });

    const result = contests.map((contest) => ({
      ...contest,
      status: getContestStatus(contest),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
}

async function getContestById(req, res) {
  try {
    const { contestId } = req.params;

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        problems: true,
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    res.json({
      ...contest,
      status: getContestStatus(contest),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch contest",
    });
  }
}

async function submitContestSolution(req, res) {
  try {
    const { contestId } = req.params;
    const { problemUrl, status } = req.body;
    const userId = req.user.id;

    if (!problemUrl || !status) {
      return res.status(400).json({
        message: "problemUrl and status are required",
      });
    }

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const now = new Date();
    if (now < contest.startTime || now > contest.endTime) {
      return res.status(400).json({
        message: "Contest is not running",
      });
    }

    const problem = await prisma.contestProblem.findFirst({
      where: {
        contestId,
        problemUrl,
      },
    });

    if (!problem) {
      return res.status(400).json({
        message: "Problem does not belong to this contest",
      });
    }

    // Base submission data
    const submissionData = {
      contestId,
      problemUrl,
      status,
    };

    if (contest.isTeamBased) {
      // Find user's team for this contest
      const membership = await prisma.teamMember.findFirst({
        where: {
          userId,
          team: {
            contestId,
          },
        },
      });

      if (!membership) {
        return res.status(400).json({
          message: "User is not part of any team in this contest",
        });
      }

      const teamId = membership.teamId;

      const existingTeamSubmission =
        await prisma.contestSubmission.findFirst({
          where: {
            contestId,
            teamId,
            problemUrl,
          },
        });

      if (existingTeamSubmission) {
        return res.status(409).json({
          message: "Team has already submitted for this problem",
        });
      }

      submissionData.teamId = teamId;
    } else {
      // Individual contest
      const existingUserSubmission =
        await prisma.contestSubmission.findFirst({
          where: {
            contestId,
            userId,
            problemUrl,
          },
        });

      if (existingUserSubmission) {
        return res.status(409).json({
          message: "Submission already exists for this problem",
        });
      }

      submissionData.userId = userId;
    }

    const submission = await prisma.contestSubmission.create({
      data: submissionData,
    });

    res.status(201).json({
      message: "Submission recorded",
      submission,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to submit solution",
    });
  }
}


async function getContestLeaderboard(req, res) {
  try {
    const { contestId } = req.params;

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // Optional: hide leaderboard before contest starts
    const now = new Date();
    if (now < contest.startTime) {
      return res.status(400).json({
        message: "Leaderboard not available before contest starts",
      });
    }

    let leaderboard = [];

    if (contest.isTeamBased) {
      // ===== TEAM-BASED LEADERBOARD =====
      const submissions = await prisma.contestSubmission.findMany({
        where: {
          contestId,
          status: "ACCEPTED",
          teamId: { not: null },
        },
        select: {
          teamId: true,
          problemUrl: true,
        },
      });

      const scoreMap = new Map();

      for (const sub of submissions) {
        if (!scoreMap.has(sub.teamId)) {
          scoreMap.set(sub.teamId, new Set());
        }
        scoreMap.get(sub.teamId).add(sub.problemUrl);
      }

      const teamIds = Array.from(scoreMap.keys());

      const teams = await prisma.team.findMany({
        where: { id: { in: teamIds } },
        select: {
          id: true,
          name: true,
        },
      });

      const teamMap = new Map(teams.map((t) => [t.id, t]));

      leaderboard = Array.from(scoreMap.entries())
        .map(([teamId, problems]) => ({
          team: teamMap.get(teamId),
          solves: problems.size,
        }))
        .sort((a, b) => b.solves - a.solves)
        .map((entry, index) => ({
          rank: index + 1,
          ...entry,
        }));
    } else {
      // ===== INDIVIDUAL LEADERBOARD =====
      const submissions = await prisma.contestSubmission.findMany({
        where: {
          contestId,
          status: "ACCEPTED",
          userId: { not: null },
        },
        select: {
          userId: true,
          problemUrl: true,
        },
      });

      const scoreMap = new Map();

      for (const sub of submissions) {
        if (!scoreMap.has(sub.userId)) {
          scoreMap.set(sub.userId, new Set());
        }
        scoreMap.get(sub.userId).add(sub.problemUrl);
      }

      const userIds = Array.from(scoreMap.keys());

      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      const userMap = new Map(users.map((u) => [u.id, u]));

      leaderboard = Array.from(scoreMap.entries())
        .map(([userId, problems]) => ({
          user: userMap.get(userId),
          solves: problems.size,
        }))
        .sort((a, b) => b.solves - a.solves)
        .map((entry, index) => ({
          rank: index + 1,
          ...entry,
        }));
    }

    res.json({
      contestId,
      leaderboard,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch contest leaderboard",
    });
  }
}



module.exports = {
  createContest,
  addProblemToContest,
  getContestById,
  listContests,
  submitContestSolution,
  getContestLeaderboard
};
