const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
require("dotenv").config();

const logger = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// ==========================================
// Security Middleware
// ==========================================
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting - general API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many requests, please try again later" }
});
app.use("/api", generalLimiter);

// Rate limiting - auth (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "fail", message: "Too many login attempts, please try again later" }
});
app.use("/api/auth", authLimiter);

// Body parsers with size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Sanitize data against NoSQL injection (temporarily disabled for debugging)
// app.use(mongoSanitize());

// Compression
app.use(compression());

// HTTP request logging (temporarily disabled for debugging)
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev", { stream: logger.stream }));
// } else {
//   app.use(morgan("combined", { stream: logger.stream }));
// }

// ==========================================
// Database Connection
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => logger.error("MongoDB runtime error:", err));
mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));

// ==========================================
// API Routes
// ==========================================
app.use("/api/auth", require("./routes/auth-fixed"));
app.use("/api/members", require("./routes/members"));
app.use("/api/newborn-requests", require("./routes/newbornRequests"));
app.use("/api/history", require("./routes/history"));
app.use("/api/media", require("./routes/media"));
app.use("/api/events", require("./routes/events"));

// ==========================================
// Health Check
// ==========================================
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus[dbState] || "unknown",
    version: require("./package.json").version,
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/", (req, res) => {
  res.json({
    name: "Haikambe Tsame Clan Digital Archive API",
    version: "1.0.0",
    status: "running",
    documentation: "/health for health check"
  });
});

// ==========================================
// Error Handling (temporarily disabled for debugging)
// ==========================================
// app.use(notFoundHandler);
// app.use(errorHandler);

// ==========================================
// Graceful Shutdown
// ==========================================
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  mongoose.connection.close(false).then(() => {
    logger.info("MongoDB connection closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("unhandledRejection", (err) => logger.error("Unhandled Promise Rejection:", err));
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

// ==========================================
// Start Server
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;

