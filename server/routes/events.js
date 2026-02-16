const express = require("express");
const router = express.Router();
const EventService = require("../services/eventService");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createEventSchema, updateEventSchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  let events;
  
  if (req.query.upcoming === "true") {
    events = await EventService.getUpcoming();
  } else {
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.status) filters.status = req.query.status;
    events = await EventService.findAll(filters);
  }
  
  res.json(events);
}));

router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const event = await EventService.findById(req.params.id);
  if (!event) throw new NotFoundError("Event");
  res.json(event);
}));

router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createEventSchema), asyncHandler(async (req, res) => {
  const event = await EventService.create({ ...req.body, createdBy: req.user.userId });
  res.status(201).json(event);
}));

router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(updateEventSchema), asyncHandler(async (req, res) => {
  const event = await EventService.update(req.params.id, req.body);
  if (!event) throw new NotFoundError("Event");
  res.json(event);
}));

router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const event = await EventService.findById(req.params.id);
  if (!event) throw new NotFoundError("Event");
  await EventService.delete(req.params.id);
  res.json({ message: "Event deleted successfully" });
}));

module.exports = router;
