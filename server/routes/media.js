const express = require("express");
const router = express.Router();
const MediaAlbum = require("../models/MediaAlbum");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createAlbumSchema, addMediaItemSchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.isPublic !== undefined) query.isPublic = req.query.isPublic === "true";

  const albums = await MediaAlbum.find(query)
    .populate("createdBy")
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
  res.json(albums);
}));

router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const album = await MediaAlbum.findById(req.params.id).populate("createdBy items.relatedMembers");
  if (!album) throw new NotFoundError("Album");
  res.json(album);
}));

router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createAlbumSchema), asyncHandler(async (req, res) => {
  const album = new MediaAlbum({ ...req.body, createdBy: req.user._id });
  await album.save();
  res.status(201).json(album);
}));

router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), asyncHandler(async (req, res) => {
  const album = await MediaAlbum.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!album) throw new NotFoundError("Album");
  res.json(album);
}));

router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const album = await MediaAlbum.findByIdAndDelete(req.params.id);
  if (!album) throw new NotFoundError("Album");
  res.json({ message: "Album deleted successfully" });
}));

router.post("/:id/items", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(addMediaItemSchema), asyncHandler(async (req, res) => {
  const album = await MediaAlbum.findById(req.params.id);
  if (!album) throw new NotFoundError("Album");
  album.items.push(req.body);
  await album.save();
  res.json(album);
}));

router.delete("/:id/items/:itemId", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), asyncHandler(async (req, res) => {
  const album = await MediaAlbum.findById(req.params.id);
  if (!album) throw new NotFoundError("Album");
  album.items = album.items.filter(item => item._id.toString() !== req.params.itemId);
  await album.save();
  res.json(album);
}));

module.exports = router;
