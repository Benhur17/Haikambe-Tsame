const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  
  // Event Details
  eventDate: { type: Date, required: true },
  endDate: Date,
  location: String,
  venue: String,
  
  // Event Type
  type: { 
    type: String, 
    enum: ["Annual Gathering", "Wedding", "Funeral", "Ceremony", "Meeting", "Other"],
    default: "Other"
  },
  
  // Participants
  organizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  
  // Media
  images: [String],
  videos: [String],
  mediaAlbum: { type: mongoose.Schema.Types.ObjectId, ref: "MediaAlbum" },
  
  // Status
  status: { 
    type: String, 
    enum: ["Planned", "Ongoing", "Completed", "Cancelled"],
    default: "Planned"
  },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

EventSchema.index({ eventDate: -1 });
EventSchema.index({ type: 1 });

module.exports = mongoose.model("Event", EventSchema);
