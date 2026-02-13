const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    console.log("Register route hit, body:", req.body);
    const { username, email, password, fullName, role } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ 
        status: "error",
        message: "User with this email or username already exists" 
      });
    }

    const user = new User({ username, email, password, fullName, role: role || "Viewer" });
    await user.save();

    console.log(`New user registered: ${email} (${role || "Viewer"})`);

    res.status(201).json({
      status: "success",
      token: generateToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Registration failed",
      details: error.message
    });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ 
        status: "error",
        message: "Invalid credentials" 
      });
    }

    user.lastLogin = new Date();
    await user.save();

    console.log(`User logged in: ${email}`);

    res.json({
      status: "success",
      token: generateToken(user),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        memberProfile: user.memberProfile
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Login failed",
      details: error.message
    });
  }
});

module.exports = router;