const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Listing = require("../models/Listing");
const { asyncHandler } = require("../middleware/errorHandler");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// @route POST /api/payments/create-order
exports.createOrder = asyncHandler(async (req, res) => {
  const { listingId, months = 1, startDate, notes } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing)
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });

  const amountInPaise = listing.price.amount * months * 100;

  const razorpay = getRazorpay();
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `bbd_${Date.now()}`,
    notes: {
      listingId: listingId.toString(),
      userId: req.user._id.toString(),
    },
  });

  // Save payment record
  const payment = await Payment.create({
    user: req.user._id,
    listing: listingId,
    razorpayOrderId: order.id,
    amount: amountInPaise,
    bookingType: listing.type,
    months,
    startDate,
    notes,
  });

  res.json({
    success: true,
    orderId: order.id,
    amount: amountInPaise,
    currency: "INR",
    paymentId: payment._id,
    key: process.env.RAZORPAY_KEY_ID,
    listing: {
      title: listing.title,
      type: listing.type,
      price: listing.price,
    },
  });
});

// @route POST /api/payments/verify
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } =
    req.body;

  // Verify signature
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSig = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSig !== razorpaySignature) {
    await Payment.findByIdAndUpdate(paymentId, { status: "failed" });
    return res
      .status(400)
      .json({ success: false, message: "Invalid payment signature" });
  }

  // Update payment record
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { razorpayPaymentId, razorpaySignature, status: "paid" },
    { new: true },
  )
    .populate("listing", "title type")
    .populate("user", "name email phone");

  // Send confirmation email + SMS
  await sendEmail({
    to: payment.user.email,
    templateName: "paymentSuccess",
    templateData: [payment.user.name, payment.listing.title, payment.amount],
  });

  if (payment.user.phone) {
    await sendSMS({
      to: payment.user.phone,
      templateName: "paymentSuccess",
      templateData: [(payment.amount / 100).toLocaleString()],
    });
  }

  res.json({ success: true, payment });
});

// @route GET /api/payments/my
exports.getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate("listing", "title type address images price")
    .sort({ createdAt: -1 });
  res.json({ success: true, payments });
});

// @route GET /api/payments/:id
exports.getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("listing", "title type address images price");
  if (!payment)
    return res
      .status(404)
      .json({ success: false, message: "Payment not found" });
  res.json({ success: true, payment });
});
