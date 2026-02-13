const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createMemberSchema, updateMemberSchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");

// @route   GET /api/members/stats/overview  (must be before /:id)
router.get("/stats/overview", authMiddleware, asyncHandler(async (req, res) => {
  const [totalMembers, livingMembers, deceasedMembers, maleCount, femaleCount] = await Promise.all([
    Member.countDocuments(),
    Member.countDocuments({ status: "Living" }),
    Member.countDocuments({ status: "Deceased" }),
    Member.countDocuments({ gender: "Male" }),
    Member.countDocuments({ gender: "Female" })
  ]);

  const currentYear = new Date().getFullYear();
  const [ageGroups, generations] = await Promise.all([
    Member.aggregate([
      { $match: { status: "Living", dateOfBirth: { $exists: true } } },
      { $project: { age: { $subtract: [currentYear, { $year: "$dateOfBirth" }] } } },
      { $bucket: { groupBy: "$age", boundaries: [0, 18, 30, 45, 60, 100], default: "Other", output: { count: { $sum: 1 } } } }
    ]),
    Member.aggregate([
      { $group: { _id: "$generation", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json({ totalMembers, livingMembers, deceasedMembers, maleCount, femaleCount, ageGroups, generations });
}));

// @route   GET /api/members/family-tree/:id  (must be before /:id)
router.get("/family-tree/:id", authMiddleware, asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
    .populate({
      path: "father mother spouse children",
      populate: { path: "father mother spouse children" }
    });

  if (!member) throw new NotFoundError("Member");
  res.json(member);
}));

// @route   GET /api/members
router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const { search, status, generation, limit = 50, page = 1 } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

  const query = {};
  if (search) query.$text = { $search: search };
  if (status) query.status = status;
  if (generation) query.generation = parseInt(generation);

  const [members, total] = await Promise.all([
    Member.find(query)
      .populate("father mother spouse children")
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ createdAt: -1 })
      .lean(),
    Member.countDocuments(query)
  ]);

  res.json({
    members,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) }
  });
}));

// @route   GET /api/members/:id
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id)
    .populate("father mother spouse children siblings createdBy");
  if (!member) throw new NotFoundError("Member");
  res.json(member);
}));

// @route   POST /api/members
router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createMemberSchema), asyncHandler(async (req, res) => {
  const member = new Member({ ...req.body, createdBy: req.user._id });
  await member.save();

  // Update parent's children arrays
  const parentUpdates = [];
  if (member.father) parentUpdates.push(Member.findByIdAndUpdate(member.father, { $addToSet: { children: member._id } }));
  if (member.mother) parentUpdates.push(Member.findByIdAndUpdate(member.mother, { $addToSet: { children: member._id } }));
  if (parentUpdates.length) await Promise.all(parentUpdates);

  logger.info(`Member created: ${member.fullName} by user ${req.user._id}`);
  res.status(201).json(member);
}));

// @route   PUT /api/members/:id
router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(updateMemberSchema), asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!member) throw new NotFoundError("Member");
  res.json(member);
}));

// @route   DELETE /api/members/:id
router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) throw new NotFoundError("Member");

  // Clean up all references to this member
  await Promise.all([
    Member.updateMany({ children: member._id }, { $pull: { children: member._id } }),
    Member.updateMany({ spouse: member._id }, { $pull: { spouse: member._id } }),
    Member.updateMany({ siblings: member._id }, { $pull: { siblings: member._id } }),
    Member.updateMany({ father: member._id }, { $unset: { father: "" } }),
    Member.updateMany({ mother: member._id }, { $unset: { mother: "" } })
  ]);

  await Member.findByIdAndDelete(member._id);
  logger.info(`Member deleted: ${member.fullName} by user ${req.user._id}`);
  res.json({ message: "Member deleted successfully" });
}));

module.exports = router;
