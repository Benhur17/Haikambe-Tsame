const express = require("express");
const router = express.Router();
const NewbornRequest = require("../models/NewbornRequest");
const Member = require("../models/Member");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createNewbornSchema } = require("../middleware/validate");
const { NotFoundError, AppError } = require("../utils/errors");
const logger = require("../utils/logger");

// @route   GET /api/newborn-requests
router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const requests = await NewbornRequest.find(query)
    .populate("father mother createdBy reviewedBy")
    .sort({ createdAt: -1 });
  res.json(requests);
}));

// @route   GET /api/newborn-requests/:id
router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const request = await NewbornRequest.findById(req.params.id)
    .populate("father mother createdBy reviewedBy");
  if (!request) throw new NotFoundError("Newborn request");
  res.json(request);
}));

// @route   POST /api/newborn-requests
router.post("/", authMiddleware, validate(createNewbornSchema), asyncHandler(async (req, res) => {
  const newbornRequest = new NewbornRequest({ ...req.body, createdBy: req.user._id });
  await newbornRequest.save();
  logger.info(`Newborn request created: ${newbornRequest.fullName} by user ${req.user._id}`);
  res.status(201).json(newbornRequest);
}));

// @route   PUT /api/newborn-requests/:id/approve
router.put("/:id/approve", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const request = await NewbornRequest.findById(req.params.id);
  if (!request) throw new NotFoundError("Newborn request");
  if (request.status !== "Pending") throw new AppError("Request already processed", 400);

  const member = new Member({
    fullName: request.fullName, firstName: request.firstName, lastName: request.lastName,
    dateOfBirth: request.dateOfBirth, placeOfBirth: request.placeOfBirth, gender: request.gender,
    father: request.father, mother: request.mother, photos: request.photos,
    status: "Living", createdBy: req.user._id
  });
  await member.save();

  await Promise.all([
    Member.findByIdAndUpdate(request.father, { $addToSet: { children: member._id } }),
    Member.findByIdAndUpdate(request.mother, { $addToSet: { children: member._id } })
  ]);

  request.status = "Approved";
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();
  request.reviewNotes = req.body.reviewNotes || "";
  await request.save();

  logger.info(`Newborn request approved: ${request.fullName} by user ${req.user._id}`);
  res.json({ message: "Request approved and member created", member, request });
}));

// @route   PUT /api/newborn-requests/:id/reject
router.put("/:id/reject", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const request = await NewbornRequest.findById(req.params.id);
  if (!request) throw new NotFoundError("Newborn request");
  if (request.status !== "Pending") throw new AppError("Request already processed", 400);

  request.status = "Rejected";
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();
  request.reviewNotes = req.body.reviewNotes || "";
  await request.save();

  res.json({ message: "Request rejected", request });
}));

// @route   DELETE /api/newborn-requests/:id
router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const request = await NewbornRequest.findByIdAndDelete(req.params.id);
  if (!request) throw new NotFoundError("Newborn request");
  res.json({ message: "Request deleted successfully" });
}));

module.exports = router;
