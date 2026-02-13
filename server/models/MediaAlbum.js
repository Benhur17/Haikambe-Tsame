const mongoose = require("mongoose");

const MediaItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video", "audio"], required: true },
  uploadDate: { type: Date, default: Date.now },
  relatedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  tags: [String]
});

const MediaAlbumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  
  // Album Type
  category: { 
    type: String, 
    enum: ["Events", "Ceremonies", "Portraits", "Historical", "Gatherings", "Other"],
    default: "Other"
  },
  
  // Media Items
  items: [MediaItemSchema],
  
  // Album Settings
  coverImage: String,
  isPublic: { type: Boolean, default: true },
  displayOrder: Number,
  
  // Event Association
  eventDate: Date,
  location: String,
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

MediaAlbumSchema.index({ category: 1 });
MediaAlbumSchema.index({ createdBy: 1 });
MediaAlbumSchema.index({ isPublic: 1 });

module.exports = mongoose.model("MediaAlbum", MediaAlbumSchema);
