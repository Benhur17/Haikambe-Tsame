const mongoose = require("mongoose");

const ClanHistorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Timeline Information
  year: Number,
  date: Date,
  period: String, // e.g., "Pre-Colonial Era", "1900s"
  
  // Content
  content: String,
  images: [String],
  documents: [String],
  audioFiles: [String],
  videoFiles: [String],
  
  // Related Members
  relatedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  
  // Categorization
  category: { 
    type: String, 
    enum: ["Origin", "Migration", "Leadership", "Traditions", "Achievements", "Other"],
    default: "Other"
  },
  
  // Display
  featured: { type: Boolean, default: false },
  displayOrder: Number,
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

ClanHistorySchema.index({ year: 1, date: 1 });
ClanHistorySchema.index({ category: 1 });

module.exports = mongoose.model("ClanHistory", ClanHistorySchema);
