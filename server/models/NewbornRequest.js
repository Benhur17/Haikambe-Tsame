const mongoose = require("mongoose");

const NewbornRequestSchema = new mongoose.Schema({
  // Newborn Information
  fullName: { type: String, required: true },
  firstName: String,
  lastName: String,
  dateOfBirth: { type: Date, required: true },
  placeOfBirth: String,
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  
  // Parent Information
  father: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  mother: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  
  // Additional Information
  birthCertificate: String,
  photos: [String],
  notes: String,
  
  // Request Status
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
  },
  
  // Approval Information
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date,
  reviewNotes: String,
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

NewbornRequestSchema.index({ status: 1 });
NewbornRequestSchema.index({ createdBy: 1 });
NewbornRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("NewbornRequest", NewbornRequestSchema);
