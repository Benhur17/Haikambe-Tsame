const express = require("express");
const router = express.Router();
const MemberService = require("../services/memberService");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createMemberSchema, updateMemberSchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");

// @route   GET /api/members/stats/overview  (must be before /:id)
router.get("/stats/overview", authMiddleware, asyncHandler(async (req, res) => {
  const stats = await MemberService.getStats();
  
  // Calculate age groups for living members
  const allMembers = await MemberService.findAll({ status: "Living" });
  const currentYear = new Date().getFullYear();
  const ageGroups = {
    "0-18": 0,
    "18-30": 0,
    "30-45": 0,
    "45-60": 0,
    "60-100": 0
  };

  allMembers.forEach(member => {
    if (member.dateOfBirth) {
      const age = currentYear - new Date(member.dateOfBirth).getFullYear();
      if (age < 18) ageGroups["0-18"]++;
      else if (age < 30) ageGroups["18-30"]++;
      else if (age < 45) ageGroups["30-45"]++;
      else if (age < 60) ageGroups["45-60"]++;
      else ageGroups["60-100"]++;
    }
  });

  res.json({ 
    totalMembers: stats.total,
    livingMembers: stats.living,
    deceasedMembers: stats.deceased,
    maleCount: stats.male,
    femaleCount: stats.female,
    ageGroups,
    generations: Object.entries(stats.byGeneration).map(([gen, count]) => ({ _id: parseInt(gen), count }))
  });
}));

// @route   GET /api/members/family-tree/:id  (must be before /:id)
router.get("/family-tree/:id", authMiddleware, asyncHandler(async (req, res) => {
  const family = await MemberService.getFamily(req.params.id);
  if (!family) throw new NotFoundError("Member");
  res.json(family);
}));

// @route   GET /api/members
router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const { search, status, generation, limit = 50, page = 1 } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

  let members;
  
  if (search) {
    members = await MemberService.searchByName(search);
  } else {
    const filters = {};
    if (status) filters.status = status;
    if (generation) filters.generation = generation;
    members = await MemberService.findAll(filters);
  }

  // Apply pagination
  const total = members.length;
  const paginatedMembers = members.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    members: paginatedMembers,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) }
  });
}));

// @route   GET /api/members/:id
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const member = await MemberService.findById(req.params.id);
  if (!member) throw new NotFoundError("Member");
  res.json(member);
}));

// @route   POST /api/members
router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createMemberSchema), asyncHandler(async (req, res) => {
  const member = await MemberService.create({ ...req.body, createdBy: req.user.userId });

  // Update parent's children arrays if needed
  if (member.father) {
    const father = await MemberService.findById(member.father);
    const fatherChildren = father.children || [];
    if (!fatherChildren.includes(member.id)) {
      await MemberService.update(member.father, { children: [...fatherChildren, member.id] });
    }
  }
  if (member.mother) {
    const mother = await MemberService.findById(member.mother);
    const motherChildren = mother.children || [];
    if (!motherChildren.includes(member.id)) {
      await MemberService.update(member.mother, { children: [...motherChildren, member.id] });
    }
  }

  logger.info(`Member created: ${member.fullName} by user ${req.user.userId}`);
  res.status(201).json(member);
}));

// @route   PUT /api/members/:id
router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(updateMemberSchema), asyncHandler(async (req, res) => {
  const member = await MemberService.update(req.params.id, req.body);
  if (!member) throw new NotFoundError("Member");
  res.json(member);
}));

// @route   DELETE /api/members/:id
router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const member = await MemberService.findById(req.params.id);
  if (!member) throw new NotFoundError("Member");

  // Clean up all references to this member
  const allMembers = await MemberService.findAll();
  
  for (const m of allMembers) {
    let needsUpdate = false;
    const updates = {};

    // Remove from children arrays
    if (m.children && m.children.includes(member.id)) {
      updates.children = m.children.filter(id => id !== member.id);
      needsUpdate = true;
    }

    // Remove from spouse arrays
    if (m.spouse && m.spouse.includes(member.id)) {
      updates.spouse = m.spouse.filter(id => id !== member.id);
      needsUpdate = true;
    }

    // Remove from siblings arrays
    if (m.siblings && m.siblings.includes(member.id)) {
      updates.siblings = m.siblings.filter(id => id !== member.id);
      needsUpdate = true;
    }

    // Remove father reference
    if (m.father === member.id) {
      updates.father = null;
      needsUpdate = true;
    }

    // Remove mother reference
    if (m.mother === member.id) {
      updates.mother = null;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await MemberService.update(m.id, updates);
    }
  }

  await MemberService.delete(member.id);
  logger.info(`Member deleted: ${member.fullName} by user ${req.user.userId}`);
  res.json({ message: "Member deleted successfully" });
}));

module.exports = router;
