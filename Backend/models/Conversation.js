const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Two participants — tenant and owner
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Related listing (optional context)
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
    // Last message preview
    lastMessage: {
      text: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
    },
    // Unread count per user
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true },
);

// Each pair of users has only one conversation per listing
conversationSchema.index({ participants: 1, listing: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
