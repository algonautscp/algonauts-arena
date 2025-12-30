const prisma = require("../utils/prisma");

async function createTeam(req, res) {
  try {
    const { contestId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Team name is required",
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

    if (!contest.isTeamBased) {
      return res.status(400).json({
        message: "This contest is not team-based",
      });
    }

    const team = await prisma.team.create({
      data: {
        name,
        contestId,
      },
    });

    res.status(201).json({
      message: "Team created",
      team,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create team",
    });
  }
}

async function addMemberToTeam(req, res) {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        contest: true,
      },
    });

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if user already in another team for same contest
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        userId,
        team: {
          contestId: team.contestId,
        },
      },
    });

    if (existingMembership) {
      return res.status(409).json({
        message: "User already assigned to a team in this contest",
      });
    }

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },
    });

    res.status(201).json({
      message: "Member added to team",
      member,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to add member to team",
    });
  }
}


module.exports = {
  createTeam,
  addMemberToTeam,
};
