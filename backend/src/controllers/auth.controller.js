const { createUser } = require("../services/auth.service");
const prisma = require("../utils/prisma");
const { comparePassword } = require("../utils/password");
const { signToken } = require("../utils/jwt");

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const user = await createUser({ name, email, password });

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  signup,
  login
};
