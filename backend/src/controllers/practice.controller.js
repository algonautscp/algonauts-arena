const prisma = require("../utils/prisma");
const {
  fetchSolvedProblems,
} = require("../services/platforms");

async function syncCodeforces(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user.codeforcesHandle) {
      return res.status(400).json({
        message: "Codeforces handle not set",
      });
    }

    const solvedProblems = await fetchSolvedProblems(
      "CODEFORCES",
      user.codeforcesHandle
    );

    let inserted = 0;

    for (const solve of solvedProblems) {
      try {
        await prisma.problemSolve.create({
          data: {
            userId,
            platform: solve.platform,
            problemUrl: solve.problemUrl,
            difficulty: solve.difficulty,
            solvedAt: solve.solvedAt,
          },
        });
        inserted++;
      } catch (err) {
        // Ignore duplicate entries
        if (err.code !== "P2002") {
          console.error(err);
        }
      }
    }

    res.json({
      message: "Codeforces sync completed",
      totalFetched: solvedProblems.length,
      newSolvesAdded: inserted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to sync Codeforces data",
    });
  }
}

async function getMySolves(req, res) {
  try {
    const userId = req.user.id;

    const solves = await prisma.problemSolve.findMany({
      where: { userId },
      orderBy: { solvedAt: "desc" },
    });

    res.json({
      total: solves.length,
      solves,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch solves",
    });
  }
}

async function getMyStats(req, res) {
  try {
    const userId = req.user.id;

    const stats = await prisma.problemSolve.groupBy({
      by: ["difficulty"],
      where: { userId },
      _count: true,
    });

    const formatted = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    };

    stats.forEach((s) => {
      if (s.difficulty) {
        formatted[s.difficulty] = s._count;
      }
    });

    res.json({
      total:
        formatted.EASY + formatted.MEDIUM + formatted.HARD,
      breakdown: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch stats",
    });
  }
}

async function getLeaderboard(req, res) {
  try {
    const leaderboard = await prisma.problemSolve.groupBy({
      by: ["userId"],
      _count: true,
      orderBy: {
        _count: {
          userId: "desc",
        },
      },
      take: 20,
    });

    const userIds = leaderboard.map((l) => l.userId);

    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const userMap = new Map(
      users.map((u) => [u.id, u])
    );

    const result = leaderboard.map((entry, index) => ({
      rank: index + 1,
      user: userMap.get(entry.userId),
      solves: entry._count,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch leaderboard",
    });
  }
}


module.exports = {
  syncCodeforces,
  getMySolves,
  getMyStats,
  getLeaderboard,
};
