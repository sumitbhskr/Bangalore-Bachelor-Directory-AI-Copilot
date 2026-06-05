const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Uploaded documents (Cloudinary URLs)
    documents: [
      {
        type: {
          type: String,
          enum: ["id_proof", "address_proof", "ownership_proof", "other"],
        },
        url: { type: String, required: true },
        publicId: { type: String },
        name: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Verification", verificationSchema);
