const prisma = require("../utils/prisma");

const PLATFORM_FIELD_MAP = {
  codeforces: "codeforcesHandle",
  leetcode: "leetcodeHandle",
  // CODECHEF, ATCODER can be added later
};

async function updatePlatformHandle(req, res) {
  try {
    const userId = req.user.id;
    const { platform, handle } = req.body;

    if (!platform || !handle) {
      return res.status(400).json({
        message: "platform and handle are required",
      });
    }

    const field = PLATFORM_FIELD_MAP[platform];

    if (!field) {
      return res.status(400).json({
        message: "Unsupported platform",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        [field]: handle,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        codeforcesHandle: true,
        leetcodeHandle: true,
      },
    });

    res.json({
      message: "Platform handle updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update platform handle",
    });
  }
}

module.exports = {
  updatePlatformHandle,
};
