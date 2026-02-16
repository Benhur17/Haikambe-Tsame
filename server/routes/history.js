const express = require("express");
const router = express.Router();
const ClanHistoryService = require("../services/clanHistoryService");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createHistorySchema, updateHistorySchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  let history;
  if (req.query.category) {
    history = await ClanHistoryService.getByCategory(req.query.category);
  } else {
    history = await ClanHistoryService.findAll();
  }
  
  // Filter by featured if requested
  if (req.query.featured === "true") {
    history = history.filter(h => h.featured);
  }
  
  res.json(history);
}));

router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const history = await ClanHistoryService.findById(req.params.id);
  if (!history) throw new NotFoundError("History entry");
  res.json(history);
}));

router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createHistorySchema), asyncHandler(async (req, res) => {
  const history = await ClanHistoryService.create({ ...req.body, createdBy: req.user.userId });
  res.status(201).json(history);
}));

router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(updateHistorySchema), asyncHandler(async (req, res) => {
  const history = await ClanHistoryService.update(req.params.id, req.body);
  if (!history) throw new NotFoundError("History entry");
  res.json(history);
}));

router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const history = await ClanHistoryService. findById(req.params.id);
  if (!history) throw new NotFoundError("History entry");
  await ClanHistoryService.delete(req.params.id);
  res.json({ message: "History entry deleted successfully" });
}));

module.exports = router;
