const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "new_message",
        "listing_saved",
        "review_added",
        "listing_verified",
        "payment_success",
        "payment_failed",
        "new_listing",
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    link: { type: String }, // frontend route to navigate
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    // Reference to related document
    refModel: {
      type: String,
      enum: ["Listing", "Message", "Review", "Payment"],
    },
    refId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
