const Joi = require("joi");
const { ValidationError } = require("../utils/errors");

/**
 * Middleware factory that validates request body against a Joi schema
 */
const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationError = new ValidationError(
        "Validation failed",
        error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message.replace(/"/g, "")
        }))
      );
      return next(validationError);
    }

    req[property] = value;
    next();
  };
};

// ==========================================
// Auth Schemas
// ==========================================
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required()
    .messages({ "string.min": "Username must be at least 3 characters" }),
  email: Joi.string().email().required()
    .messages({ "string.email": "Please provide a valid email address" }),
  password: Joi.string().min(6).max(128).required()
    .messages({
      "string.min": "Password must be at least 6 characters"
    }),
  fullName: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid("Super Admin", "Clan Admin", "Editor", "Viewer").default("Viewer")
});

const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({ "string.email": "Please provide a valid email address" }),
  password: Joi.string().required()
    .messages({ "any.required": "Password is required" })
});

const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  username: Joi.string().alphanum().min(3).max(30)
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.min": "New password must be at least 8 characters",
      "string.pattern.base": "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    })
});

// ==========================================
// Member Schemas
// ==========================================
const createMemberSchema = Joi.object({
  fullName: Joi.string().min(2).max(200).required(),
  firstName: Joi.string().max(100).allow(""),
  lastName: Joi.string().max(100).allow(""),
  dateOfBirth: Joi.date().iso().max("now").allow(null),
  dateOfDeath: Joi.date().iso().allow(null),
  placeOfBirth: Joi.string().max(200).allow(""),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  email: Joi.string().email().allow("", null),
  phone: Joi.string().max(20).allow("", null),
  address: Joi.string().max(500).allow("", null),
  occupation: Joi.string().max(200).allow("", null),
  education: Joi.string().max(200).allow("", null),
  achievements: Joi.array().items(Joi.string().max(500)),
  biography: Joi.string().max(5000).allow("", null),
  nickname: Joi.string().max(100).allow("", null),
  interests: Joi.array().items(Joi.string().max(200)),
  father: Joi.string().hex().length(24).allow(null),
  mother: Joi.string().hex().length(24).allow(null),
  spouse: Joi.array().items(Joi.string().hex().length(24)),
  children: Joi.array().items(Joi.string().hex().length(24)),
  siblings: Joi.array().items(Joi.string().hex().length(24)),
  status: Joi.string().valid("Living", "Deceased").default("Living"),
  generation: Joi.number().integer().min(1).max(50).default(1),
  profileImage: Joi.string().uri().allow("", null),
  photos: Joi.array().items(Joi.string().uri()),
  documents: Joi.array().items(Joi.string().uri())
});

const updateMemberSchema = createMemberSchema.fork(
  ["fullName", "gender"],
  (schema) => schema.optional()
);

// ==========================================
// Newborn Request Schemas
// ==========================================
const createNewbornSchema = Joi.object({
  fullName: Joi.string().min(2).max(200).required(),
  firstName: Joi.string().max(100).allow(""),
  lastName: Joi.string().max(100).allow(""),
  dateOfBirth: Joi.date().iso().max("now").required(),
  placeOfBirth: Joi.string().max(200).allow(""),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  father: Joi.string().hex().length(24).required(),
  mother: Joi.string().hex().length(24).required(),
  birthCertificate: Joi.string().uri().allow("", null),
  photos: Joi.array().items(Joi.string().uri()),
  notes: Joi.string().max(2000).allow("", null)
});

// ==========================================
// History Schemas
// ==========================================
const createHistorySchema = Joi.object({
  title: Joi.string().min(2).max(300).required(),
  description: Joi.string().min(10).max(5000).required(),
  year: Joi.number().integer().min(0).max(new Date().getFullYear()),
  date: Joi.date().iso().allow(null),
  period: Joi.string().max(200).allow("", null),
  content: Joi.string().max(50000).allow("", null),
  images: Joi.array().items(Joi.string().uri()),
  documents: Joi.array().items(Joi.string().uri()),
  audioFiles: Joi.array().items(Joi.string().uri()),
  videoFiles: Joi.array().items(Joi.string().uri()),
  relatedMembers: Joi.array().items(Joi.string().hex().length(24)),
  category: Joi.string().valid("Origin", "Migration", "Leadership", "Traditions", "Achievements", "Other").default("Other"),
  featured: Joi.boolean().default(false),
  displayOrder: Joi.number().integer()
});

const updateHistorySchema = createHistorySchema.fork(
  ["title", "description"],
  (schema) => schema.optional()
);

// ==========================================
// Media Schemas
// ==========================================
const createAlbumSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000).allow("", null),
  category: Joi.string().valid("Events", "Ceremonies", "Portraits", "Historical", "Gatherings", "Other").default("Other"),
  coverImage: Joi.string().uri().allow("", null),
  isPublic: Joi.boolean().default(true),
  displayOrder: Joi.number().integer(),
  eventDate: Joi.date().iso().allow(null),
  location: Joi.string().max(200).allow("", null)
});

const addMediaItemSchema = Joi.object({
  title: Joi.string().max(200).allow(""),
  description: Joi.string().max(2000).allow(""),
  url: Joi.string().uri().required(),
  type: Joi.string().valid("image", "video", "audio").required(),
  relatedMembers: Joi.array().items(Joi.string().hex().length(24)),
  tags: Joi.array().items(Joi.string().max(50))
});

// ==========================================
// Event Schemas
// ==========================================
const createEventSchema = Joi.object({
  title: Joi.string().min(2).max(300).required(),
  description: Joi.string().max(5000).allow("", null),
  eventDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().allow(null),
  location: Joi.string().max(300).allow("", null),
  venue: Joi.string().max(300).allow("", null),
  type: Joi.string().valid("Annual Gathering", "Wedding", "Funeral", "Ceremony", "Meeting", "Other").default("Other"),
  organizers: Joi.array().items(Joi.string().hex().length(24)),
  attendees: Joi.array().items(Joi.string().hex().length(24)),
  images: Joi.array().items(Joi.string().uri()),
  videos: Joi.array().items(Joi.string().uri()),
  mediaAlbum: Joi.string().hex().length(24).allow(null),
  status: Joi.string().valid("Planned", "Ongoing", "Completed", "Cancelled").default("Planned")
});

const updateEventSchema = createEventSchema.fork(
  ["title", "eventDate"],
  (schema) => schema.optional()
);

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  createMemberSchema,
  updateMemberSchema,
  createNewbornSchema,
  createHistorySchema,
  updateHistorySchema,
  createAlbumSchema,
  addMediaItemSchema,
  createEventSchema,
  updateEventSchema
};
