const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const {
  createContest,
} = require("../controllers/contest.controller");

router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  createContest
);

const {
  addProblemToContest,
} = require("../controllers/contest.controller");

router.post(
  "/:contestId/problems",
  authMiddleware,
  requireRole("ADMIN"),
  addProblemToContest
);

const {
  listContests,
  getContestById,
} = require("../controllers/contest.controller");

router.get(
  "/",
  authMiddleware,
  listContests
);

router.get(
  "/:contestId",
  authMiddleware,
  getContestById
);

const {
  submitContestSolution,
} = require("../controllers/contest.controller");

router.post(
  "/:contestId/submit",
  authMiddleware,
  submitContestSolution
);

const {
  getContestLeaderboard,
} = require("../controllers/contest.controller");

router.get(
  "/:contestId/leaderboard",
  authMiddleware,
  getContestLeaderboard
);


const {
  createTeam,
} = require("../controllers/team.controller");

router.post(
  "/:contestId/teams",
  authMiddleware,
  requireRole("ADMIN"),
  createTeam
);

const {
  addMemberToTeam,
} = require("../controllers/team.controller");

router.post(
  "/teams/:teamId/members",
  authMiddleware,
  requireRole("ADMIN"),
  addMemberToTeam
);


module.exports = router;
