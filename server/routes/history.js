const express = require("express");
const router = express.Router();
const ClanHistory = require("../models/ClanHistory");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createHistorySchema, updateHistorySchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.featured) query.featured = req.query.featured === "true";

  const history = await ClanHistory.find(query)
    .populate("relatedMembers createdBy")
    .sort({ year: 1, date: 1, displayOrder: 1 })
    .lean();
  res.json(history);
}));

router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const history = await ClanHistory.findById(req.params.id).populate("relatedMembers createdBy");
  if (!history) throw new NotFoundError("History entry");
  res.json(history);
}));

router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createHistorySchema), asyncHandler(async (req, res) => {
  const history = new ClanHistory({ ...req.body, createdBy: req.user._id });
  await history.save();
  res.status(201).json(history);
}));

router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(updateHistorySchema), asyncHandler(async (req, res) => {
  const history = await ClanHistory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!history) throw new NotFoundError("History entry");
  res.json(history);
}));

router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const history = await ClanHistory.findByIdAndDelete(req.params.id);
  if (!history) throw new NotFoundError("History entry");
  res.json({ message: "History entry deleted successfully" });
}));

module.exports = router;
