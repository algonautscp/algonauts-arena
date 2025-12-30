const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const {
  updatePlatformHandle,
} = require("../controllers/user.controller");

router.post(
  "/platform-handle",
  authMiddleware,
  updatePlatformHandle
);

module.exports = router;
