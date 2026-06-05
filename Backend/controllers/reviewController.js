const Review = require("../models/Review");
const Listing = require("../models/Listing");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/listings/:listingId/reviews
exports.getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ listing: req.params.listingId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, reviews });
});

// @route POST /api/listings/:listingId/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.listingId);
  if (!listing)
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });

  // Prevent owner from reviewing own listing
  if (listing.owner.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .json({ success: false, message: "You cannot review your own listing" });
  }

  const review = await Review.create({
    listing: req.params.listingId,
    user: req.user._id,
    rating: req.body.rating,
    title: req.body.title,
    body: req.body.body,
  });
  await review.populate("user", "name avatar");
  res.status(201).json({ success: true, review });
});

// @route PUT /api/reviews/:id
exports.updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { rating: req.body.rating, title: req.body.title, body: req.body.body },
    { new: true, runValidators: true },
  ).populate("user", "name avatar");

  if (!review)
    return res
      .status(404)
      .json({ success: false, message: "Review not found or not yours" });
  res.json({ success: true, review });
});

// @route DELETE /api/reviews/:id
exports.deleteReview = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };
  const review = await Review.findOneAndDelete(query);
  if (!review)
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  await Review.calcAverageRating(review.listing);
  res.json({ success: true, message: "Review deleted" });
});
