const Verification = require("../models/Verification");
const Listing = require("../models/Listing");
const { asyncHandler } = require("../middleware/errorHandler");
const { upload } = require("../config/cloudinary");
const sendEmail = require("../utils/sendEmail");

// @route POST /api/verification/:listingId/submit
exports.submitVerification = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({
    _id: req.params.listingId,
    owner: req.user._id,
  });
  if (!listing)
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });

  // Check if already submitted
  const existing = await Verification.findOne({ listing: listing._id });
  if (existing && ["pending", "under_review"].includes(existing.status)) {
    return res
      .status(400)
      .json({ success: false, message: "Verification already submitted" });
  }

  // Build documents array from uploaded files
  const documents = (req.files || []).map((file, i) => ({
    type: req.body.docTypes?.[i] || "other",
    url: file.path,
    publicId: file.filename,
    name: file.originalname,
  }));

  if (!documents.length) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload at least one document" });
  }

  const verification = await Verification.create({
    listing: listing._id,
    owner: req.user._id,
    documents,
    status: "pending",
  });

  res.status(201).json({ success: true, verification });
});

// @route GET /api/verification/my
exports.getMyVerifications = asyncHandler(async (req, res) => {
  const verifications = await Verification.find({
    owner: req.user._id,
  }).populate("listing", "title type address");
  res.json({ success: true, verifications });
});

// ── Admin routes ─────────────────────────────────────────

// @route GET /api/verification/pending  (admin)
exports.getPending = asyncHandler(async (req, res) => {
  const verifications = await Verification.find({
    status: { $in: ["pending", "under_review"] },
  })
    .populate("listing", "title type address owner")
    .populate("owner", "name email phone")
    .sort({ createdAt: 1 });
  res.json({ success: true, verifications });
});

// @route PUT /api/verification/:id/review  (admin)
exports.reviewVerification = asyncHandler(async (req, res) => {
  const { status, adminNote } = req.body;
  if (!["approved", "rejected", "under_review"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const verification = await Verification.findByIdAndUpdate(
    req.params.id,
    {
      status,
      adminNote,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
    },
    { new: true },
  )
    .populate("listing")
    .populate("owner", "name email");

  if (!verification) {
    return res
      .status(404)
      .json({ success: false, message: "Verification not found" });
  }

  // If approved, mark listing as verified
  if (status === "approved") {
    await Listing.findByIdAndUpdate(verification.listing._id, {
      isVerified: true,
    });
    await sendEmail({
      to: verification.owner.email,
      templateName: "listingVerified",
      templateData: [verification.owner.name, verification.listing.title],
    });
  }

  res.json({ success: true, verification });
});
