const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    // Razorpay IDs
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    amount: { type: Number, required: true }, // in paise (INR * 100)
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    // Booking details
    bookingType: {
      type: String,
      enum: ["pg", "tiffin", "cook"],
      required: true,
    },
    months: { type: Number, default: 1 },
    startDate: { type: Date },
    notes: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
