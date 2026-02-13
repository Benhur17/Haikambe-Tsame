const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  dateOfDeath: Date,
  placeOfBirth: String,
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  
  // Contact Information
  email: String,
  phone: String,
  address: String,
  
  // Professional Information
  occupation: String,
  education: String,
  achievements: [String],
  
  // Personal Information
  biography: String,
  nickname: String,
  interests: [String],
  
  // Family Relationships
  father: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  mother: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  spouse: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  siblings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  
  // Status
  status: { type: String, enum: ["Living", "Deceased"], default: "Living" },
  generation: { type: Number, default: 1 },
  
  // Media
  profileImage: String,
  photos: [String],
  documents: [String],
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes for better query performance
MemberSchema.index({ fullName: 'text', firstName: 'text', lastName: 'text' });
MemberSchema.index({ status: 1 });
MemberSchema.index({ generation: 1 });
MemberSchema.index({ father: 1 });
MemberSchema.index({ mother: 1 });
MemberSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Member", MemberSchema);
