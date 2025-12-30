const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  syncCodeforces,
  getMySolves,
  getMyStats,
  getLeaderboard
} = require("../controllers/practice.controller");

router.post("/sync/codeforces", authMiddleware, syncCodeforces);
router.get("/me", authMiddleware, getMySolves);
router.get("/me/stats", authMiddleware, getMyStats);

const requireRole = require("../middlewares/role.middleware");

router.get(
  "/leaderboard",
  authMiddleware,
  requireRole("ADMIN", "MENTOR"),
  getLeaderboard
);



module.exports = router;
