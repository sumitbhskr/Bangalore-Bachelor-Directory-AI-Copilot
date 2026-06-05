const mongoose = require("mongoose");

const aiFeedbackSchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    response: { type: String },
    citations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    wasHelpful: { type: Boolean, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String }, // anonymous session
    confidence: { type: Number, min: 0, max: 1 },
    usedFallback: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AiFeedback", aiFeedbackSchema);
