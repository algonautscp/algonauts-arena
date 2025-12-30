const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: false,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
app.use(express.json());

// Inital route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Algonauts Arena backend running" });
});

// Authorization routes
app.use("/api/auth", authRoutes);

// Admin routes
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// Practice questions routes
const practiceRoutes = require("./routes/practice.routes");
app.use("/api/practice", practiceRoutes);

// Contest routes
const contestRoutes = require("./routes/contest.routes");
app.use("/api/contests", contestRoutes);

// User routes
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);


module.exports = app;
