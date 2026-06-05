// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const rateLimit = require("express-rate-limit");
// require("dotenv").config();

// const authRoutes = require("./routes/auth");
// const listingRoutes = require("./routes/listings");
// const reviewRoutes = require("./routes/reviews");
// const userRoutes = require("./routes/user");
// const aiCopilotRoutes = require("./routes/aiCopilot");
// const { errorHandler } = require("./middleware/errorHandler");

// const app = express();

// // ── Middlewares ────────────────────────────────────────
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   }),
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// // Global rate limiter
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
//   max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
//   message: {
//     success: false,
//     message: "Too many requests, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use("/api/", limiter);

// // Stricter limiter for AI Copilot (costs tokens)
// const aiLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 10,
//   message: {
//     success: false,
//     message: "AI Copilot rate limit reached. Please wait a minute.",
//   },
// });
// app.use("/api/ai", aiLimiter);

// // ── Routes ─────────────────────────────────────────────
// app.use("/api/auth", authRoutes);
// app.use("/api/listings", listingRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/ai", aiCopilotRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({
//     success: true,
//     message: "Bangalore Bachelor API is running!",
//     timestamp: new Date(),
//   });
// });

// // 404 handler
// app.use("*", (req, res) => {
//   res
//     .status(404)
//     .json({ success: false, message: `Route ${req.originalUrl} not found` });
// });

// // Centralized error handler
// app.use(errorHandler);

// // ── Database + Start ────────────────────────────────────
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection failed:", err.message);
//     process.exit(1);
//   });

// module.exports = app;

/////////////////////
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initSocket } = require("./config/socket");

const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const aiCopilotRoutes = require("./routes/aiCopilot");



const messagesRoutes = require("./routes/messages");
const notificationsRoutes = require("./routes/notifications");
const paymentsRoutes = require("./routes/payments");
const verificationRoutes = require("./routes/verification");

const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);

// Socket.io initialize
initSocket(server);

// ── Middlewares ────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// AI limiter
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "AI Copilot rate limit reached. Please wait a minute.",
  },
});

app.use("/api/ai", aiLimiter);

// ── Routes ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiCopilotRoutes);

app.use("/api/messages", messagesRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/verification", verificationRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Bangalore Bachelor API is running!",
    timestamp: new Date(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error Handler
app.use(errorHandler);

// ── Database + Start ────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket.io running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;
