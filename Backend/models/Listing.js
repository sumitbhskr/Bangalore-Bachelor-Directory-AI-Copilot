const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["pg", "tiffin", "cook"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Location details
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, default: "Bangalore" },
      pincode: { type: String },
      landmark: { type: String },
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [77.5946, 12.9716] }, // [lng, lat]
    },

    // Pricing
    price: {
      amount: { type: Number, required: true, min: 0 },
      unit: {
        type: String,
        enum: ["month", "meal", "day", "hour"],
        default: "month",
      },
    },

    // Images (Cloudinary URLs)
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        caption: { type: String },
      },
    ],

    // PG-specific fields
    pgDetails: {
      roomType: {
        type: String,
        enum: ["single", "double", "triple", "dormitory"],
      },
      gender: { type: String, enum: ["male", "female", "co-ed"] },
      totalBeds: { type: Number },
      availableBeds: { type: Number },
      amenities: [{ type: String }], // WiFi, AC, Food, Laundry, etc.
      furnishing: {
        type: String,
        enum: ["furnished", "semi-furnished", "unfurnished"],
      },
    },

    // Tiffin-specific fields
    tiffinDetails: {
      mealsPerDay: { type: Number, min: 1, max: 3 },
      cuisineType: [{ type: String }], // North Indian, South Indian, etc.
      dietType: { type: String, enum: ["veg", "non-veg", "both"] },
      deliveryAvailable: { type: Boolean, default: false },
      deliveryRadius: { type: Number }, // in km
      sampleMenu: [{ type: String }],
    },

    // Cook-specific fields
    cookDetails: {
      experience: { type: Number }, // years
      specializations: [{ type: String }],
      availableTimings: [{ type: String }], // Morning, Evening, Full-day
      cookingFor: { type: Number }, // max people
      hasOwnVehicle: { type: Boolean, default: false },
    },

    // Ratings aggregated
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },

    // Vector embedding for AI search (stored as array of floats)
    embedding: { type: [Number], select: false },

    // Metadata
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    contactPhone: { type: String },
    contactEmail: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true },
);

// Indexes
listingSchema.index({ location: "2dsphere" });
listingSchema.index({ type: 1 });
listingSchema.index({
  "address.area": "text",
  title: "text",
  description: "text",
  tags: "text",
});
listingSchema.index({ "price.amount": 1 });
listingSchema.index({ rating: -1 });
listingSchema.index({ createdAt: -1 });

// Virtual: populate reviews count
listingSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "listing",
});

module.exports = mongoose.model("Listing", listingSchema);
