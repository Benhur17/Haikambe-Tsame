const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require("../middleware/validate");
const { ConflictError, UnauthorizedError, AppError } = require("../utils/errors");
const logger = require("../utils/logger");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// @route   POST /api/auth/test  (temporary testing route)
router.post("/test", (req, res) => {
  console.log("Test route hit, body:", req.body);
  res.json({ status: "success", body: req.body });
});

// @route   POST /api/auth/register (simplified for testing)
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

    logger.info(`New user registered: ${email} (${role || "Viewer"})`);

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
router.post("/login", validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive. Contact an administrator.", 403);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  user.lastLogin = new Date();
  await user.save();

  logger.info(`User logged in: ${email}`);

  res.json({
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
}));

// @route   GET /api/auth/me
router.get("/me", authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("memberProfile");
  res.json(user);
}));

// @route   PUT /api/auth/update-profile
router.put("/update-profile", authMiddleware, validate(updateProfileSchema), asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;
  const user = await User.findById(req.user._id);

  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (username) user.username = username;

  await user.save();
  res.json({ message: "Profile updated successfully", user });
}));

// @route   PUT /api/auth/change-password
router.put("/change-password", authMiddleware, validate(changePasswordSchema), asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: "Password changed successfully" });
}));

module.exports = router;
