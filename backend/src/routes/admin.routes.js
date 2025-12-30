const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.get(
  "/dashboard",
  authMiddleware,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

module.exports = router;
