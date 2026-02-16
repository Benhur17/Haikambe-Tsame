const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserService = require("../services/userService");
const logger = require("../utils/logger");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    // Input validation
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required"
      });
    }

    // Check for existing user
    const existingUser = await UserService.findByEmailOrUsername(email, username);
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email or username already exists"
      });
    }

    // Create new user
    const user = await UserService.create({ 
      username, 
      email, 
      password, 
      fullName, 
      role: role || "Viewer"
    });
    
    logger.info(`New user registered: ${email} (${user.role})`, { 
      userId: user.id, 
      username,
      role: user.role 
    });

    res.status(201).json({
      status: "success",
      token: generateToken(user),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        memberProfile: user.memberProfile
      }
    });
  } catch (error) {
    logger.error("Registration error:", error);
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

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await UserService.findByEmail(email);
    if (!user || !(await UserService.comparePassword(password, user.password))) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    // Update last login
    await UserService.updateLastLogin(user.id);

    logger.info(`User logged in: ${email}`, { userId: user.id });

    res.json({
      status: "success",
      token: generateToken(user),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        memberProfile: user.memberProfile
      }
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Login failed",
      details: error.message
    });
  }
});

// @route   GET /api/auth/profile
router.get("/profile", async (req, res) => {
  try {
    // Simple auth check - get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token"
      });
    }

    res.json({
      status: "success",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        memberProfile: user.memberProfile
      }
    });
  } catch (error) {
    logger.error("Profile fetch error:", error);
    res.status(401).json({
      status: "error",
      message: "Invalid token"
    });
  }
});

// @route   PUT /api/auth/profile
router.put("/profile", async (req, res) => {
  try {
    // Simple auth check
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token"
      });
    }

    // Update profile fields
    const { fullName, memberProfile } = req.body;
    
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (memberProfile && user.role === "Member") {
      updates.memberProfile = { ...user.memberProfile, ...memberProfile };
    }

    const updatedUser = await UserService.update(user.id, updates);

    logger.info(`User profile updated: ${user.email}`, { userId: user.id });

    res.json({
      status: "success",
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        memberProfile: updatedUser.memberProfile
      }
    });
  } catch (error) {
    logger.error("Profile update error:", error);
    res.status(500).json({
      status: "error",
      message: "Profile update failed"
    });
  }
});

module.exports = router;