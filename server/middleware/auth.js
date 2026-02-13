const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UnauthorizedError, ForbiddenError } = require("../utils/errors");
const logger = require("../utils/logger");

/**
 * Verify JWT Token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No authentication token provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new UnauthorizedError("User account not found");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account has been deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(error);
    }
    next(error.statusCode ? error : new UnauthorizedError("Authentication failed"));
  }
};

/**
 * Role-based authorization middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user._id} (${req.user.role}) on ${req.method} ${req.originalUrl}`);
      return next(new ForbiddenError());
    }
    next();
  };
};

/** Permission levels for reference */
const permissions = {
  canCreateMember: ["Super Admin", "Clan Admin", "Editor"],
  canEditMember: ["Super Admin", "Clan Admin", "Editor"],
  canDeleteMember: ["Super Admin", "Clan Admin"],
  canApproveNewborn: ["Super Admin", "Clan Admin"],
  canManageUsers: ["Super Admin"],
  canManageHistory: ["Super Admin", "Clan Admin", "Editor"],
  canManageMedia: ["Super Admin", "Clan Admin", "Editor"]
};

module.exports = { authMiddleware, authorize, permissions };
