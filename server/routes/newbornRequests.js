const express = require("express");
const router = express.Router();
const NewbornRequestService =require("../services/newbornRequestService");
const MemberService = require("../services/memberService");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createNewbornSchema } = require("../middleware/validate");
const { NotFoundError, AppError } = require("../utils/errors");
const logger = require("../utils/logger");

// @route   GET /api/newborn-requests
router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const requests = await NewbornRequestService.findAll(filters);
  res.json(requests);
}));

// @route   GET /api/newborn-requests/:id
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const request = await NewbornRequestService.findById(req.params.id);
  if (!request) throw new NotFoundError("Newborn request");
  res.json(request);
}));

// @route   POST /api/newborn-requests
router.post("/", authMiddleware, validate(createNewbornSchema), asyncHandler(async (req, res) => {
  const newbornRequest = await NewbornRequestService.create({ ...req.body, createdBy: req.user.userId });
  logger.info(`Newborn request created: ${newbornRequest.fullName} by user ${req.user.userId}`);
  res.status(201).json(newbornRequest);
}));

// @route   PUT /api/newborn-requests/:id/approve
router.put("/:id/approve", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const request = await NewbornRequestService.findById(req.params.id);
  if (!request) throw new NotFoundError("Newborn request");
  if (request.status !== "Pending") throw new AppError("Request already processed", 400);

  const member = await MemberService.create({
    fullName: request.fullName, firstName: request.firstName, lastName: request.lastName,
    dateOfBirth: request.dateOfBirth, placeOfBirth: request.placeOfBirth, gender: request.gender,
    father: request.father, mother: request.mother, photos: request.photos,
    status: "Living", createdBy: req.user.userId
  });

  // Update parents
  if (request.father) {
    const father = await MemberService.findById(request.father);
    const fatherChildren = father.children || [];
    await MemberService.update(request.father, { children: [...fatherChildren, member.id] });
  }
  if (request.mother) {
    const mother = await MemberService.findById(request.mother);
    const motherChildren = mother.children || [];
    await MemberService.update(request.mother, { children: [...motherChildren, member.id] });
  }

  await NewbornRequestService.approve(req.params.id, req.user.userId);
  await NewbornRequestService.update(req.params.id, { reviewNotes: req.body.reviewNotes || "" });

  const updatedRequest = await NewbornRequestService.findById(req.params.id);
  logger.info(`Newborn request approved: ${request.fullName} by user ${req.user.userId}`);
  res.json({ message: "Request approved and member created", member, request: updatedRequest });
}));

// @route   PUT /api/newborn-requests/:id/reject
router.put("/:id/reject", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const request = await NewbornRequestService.findById(req.params.id);
  if (!request) throw new NotFoundError("Newborn request");
  if (request.status !== "Pending") throw new AppError("Request already processed", 400);

  await NewbornRequestService.reject(req.params.id, req.user.userId, req.body.reviewNotes || "");
  const updatedRequest = await NewbornRequestService.findById(req.params.id);

  res.json({ message: "Request rejected", request: updatedRequest });
}));

// @route   DELETE /api/newborn-requests/:id
router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const request = await NewbornRequestService.findById(req.params.id);
  if (!request) throw new NotFoundError("Newborn request");
  await NewbornRequestService.delete(req.params.id);
  res.json({ message: "Request deleted successfully" });
}));

module.exports = router;
