const express = require("express");
const router = express.Router();
const MediaService = require("../services/mediaService");
const { authMiddleware, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");
const { validate, createAlbumSchema, addMediaItemSchema } = require("../middleware/validate");
const { NotFoundError } = require("../utils/errors");

router.get("/", authMiddleware, asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.category) filters.category = req.query.category;
  if (req.query.isPublic !== undefined) filters.isPublic = req.query.isPublic === "true";

  const albums = await MediaService.findAll(filters);
  res.json(albums);
}));

router.get("/:id", authMiddleware, asyncHandler(async (req, res) => {
  const album = await MediaService.findById(req.params.id);
  if (!album) throw new NotFoundError("Album");
  res.json(album);
}));

router.post("/", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(createAlbumSchema), asyncHandler(async (req, res) => {
  const album = await MediaService.create({ ...req.body, createdBy: req.user.userId });
  res.status(201).json(album);
}));

router.put("/:id", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), asyncHandler(async (req, res) => {
  const album = await MediaService.update(req.params.id, req.body);
  if (!album) throw new NotFoundError("Album");
  res.json(album);
}));

router.delete("/:id", authMiddleware, authorize("Super Admin", "Clan Admin"), asyncHandler(async (req, res) => {
  const album = await MediaService.findById(req.params.id);
  if (!album) throw new NotFoundError("Album");
  await MediaService.delete(req.params.id);
  res.json({ message: "Album deleted successfully" });
}));

router.post("/:id/items", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), validate(addMediaItemSchema), asyncHandler(async (req, res) => {
  const album = await MediaService.addMediaItem(req.params.id, req.body);
  if (!album) throw new NotFoundError("Album");
  res.json(album);
}));

router.delete("/:id/items/:itemId", authMiddleware, authorize("Super Admin", "Clan Admin", "Editor"), asyncHandler(async (req, res) => {
  const album = await MediaService.findById(req.params.id);
  if (!album) throw new NotFoundError("Album");
  const itemIndex = album.items?.findIndex(item => item.id === req.params.itemId || item._id === req.params.itemId);
  if (itemIndex === -1 || itemIndex === undefined) throw new NotFoundError("Media item");
  await MediaService.removeMediaItem(req.params.id, itemIndex);
  const updatedAlbum = await MediaService.findById(req.params.id);
  res.json(updatedAlbum);
}));

module.exports = router;
