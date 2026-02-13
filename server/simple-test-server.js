require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Just basic middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/simple-auth"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;