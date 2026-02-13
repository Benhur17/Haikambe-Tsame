const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createEventSchema, updateEventSchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.type) query.type = req.query.type;
  if (req.query.status) query.status = req.query.status;
  if (req.query.upcoming === "true") query.eventDate = { $gte: new Date() };

  const events = await Event.find(query)
    .populate("organizers attendees mediaAlbum createdBy")
    .sort({ eventDate: -1 })
    .lean();
  res.json(events);
}));

router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("organizers attendees mediaAlbum createdBy");
  if (!event) throw new NotFoundError("Event");
  res.json(event);
}));

router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createEventSchema), asyncHandler(async (req, res) => {
  const event = new Event({ ...req.body, createdBy: req.user._id });
  await event.save();
  res.status(201).json(event);
}));

router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(updateEventSchema), asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) throw new NotFoundError("Event");
  res.json(event);
}));

router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new NotFoundError("Event");
  res.json({ message: "Event deleted successfully" });
}));

module.exports = router;
