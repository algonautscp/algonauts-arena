const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const app = express();


app.use(cors());
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

// Practice questions & attempts routes (new feature)
const practiceQuestionsRoutes = require("./routes/practiceQuestions.routes");
app.use("/api/practice-questions", practiceQuestionsRoutes);

// Contest routes
const contestRoutes = require("./routes/contest.routes");
app.use("/api/contests", contestRoutes);

// User routes
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

// Dashboard routes (v1.1)
const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/dashboard", dashboardRoutes);

// Practice goals routes (v1.1)
const practiceGoalRoutes = require("./routes/practiceGoal.routes");
app.use("/api/practice-goals", practiceGoalRoutes);

// Mentor notes routes (v1.1)
const mentorNoteRoutes = require("./routes/mentorNote.routes");
app.use("/api/mentor-notes", mentorNoteRoutes);


module.exports = app;
