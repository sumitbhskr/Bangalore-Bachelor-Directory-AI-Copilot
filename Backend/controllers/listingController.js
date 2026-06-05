const Listing = require("../models/Listing");
const { asyncHandler } = require("../middleware/errorHandler");
const { deleteImage } = require("../config/cloudinary");

// Build query filter from request query params
const buildFilter = (query) => {
  const filter = { isActive: true };
  if (query.type) filter.type = query.type;
  if (query.area) filter["address.area"] = new RegExp(query.area, "i");
  if (query.city) filter["address.city"] = new RegExp(query.city, "i");
  if (query.minPrice)
    filter["price.amount"] = {
      ...filter["price.amount"],
      $gte: +query.minPrice,
    };
  if (query.maxPrice)
    filter["price.amount"] = {
      ...filter["price.amount"],
      $lte: +query.maxPrice,
    };
  if (query.gender) filter["pgDetails.gender"] = query.gender;
  if (query.diet) filter["tiffinDetails.dietType"] = query.diet;
  if (query.verified === "true") filter.isVerified = true;
  return filter;
};

// @route   GET /api/listings
exports.getListings = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query);

  // Full-text search
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(20, parseInt(req.query.limit) || 12);
  const skip = (page - 1) * limit;

  // Sort
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    rating: { rating: -1 },
    "price-asc": { "price.amount": 1 },
    "price-desc": { "price.amount": -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .populate("owner", "name avatar phone")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-embedding"),
    Listing.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: listings.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    listings,
  });
});

// @route   GET /api/listings/:id
exports.getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner", "name avatar phone email createdAt")
    .populate({
      path: "reviews",
      populate: { path: "user", select: "name avatar" },
    })
    .select("-embedding");

  if (!listing || !listing.isActive) {
    return res
      .status(404)
      .json({ success: false, message: "Listing not found" });
  }
  res.json({ success: true, listing });
});

// @route   POST /api/listings
exports.createListing = asyncHandler(async (req, res) => {
  const body = { ...req.body, owner: req.user._id };

  // Parse images from multer upload
  if (req.files && req.files.length > 0) {
    body.images = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
  }

  const listing = await Listing.create(body);
  res.status(201).json({ success: true, listing });
});

// @route   PUT /api/listings/:id
exports.updateListing = asyncHandler(async (req, res) => {
  const body = { ...req.body };

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => ({
      url: f.path,
      publicId: f.filename,
    }));
    body.images = [...(req.resource.images || []), ...newImages];
  }

  const listing = await Listing.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, listing });
});

// @route   DELETE /api/listings/:id
exports.deleteListing = asyncHandler(async (req, res) => {
  const listing = req.resource;
  // Delete images from Cloudinary
  for (const img of listing.images) {
    if (img.publicId) await deleteImage(img.publicId);
  }
  await listing.deleteOne();
  res.json({ success: true, message: "Listing deleted successfully" });
});

// @route   DELETE /api/listings/:id/images/:imageId
exports.deleteListingImage = asyncHandler(async (req, res) => {
  const listing = req.resource;
  const img = listing.images.id(req.params.imageId);
  if (!img)
    return res.status(404).json({ success: false, message: "Image not found" });

  await deleteImage(img.publicId);
  img.remove();
  await listing.save();
  res.json({ success: true, message: "Image deleted" });
});

// @route   GET /api/listings/owner/my
exports.getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, count: listings.length, listings });
});

// @route   PUT /api/listings/:id/toggle-save   (user saves/unsaves)
exports.toggleSave = asyncHandler(async (req, res) => {
  const User = require("../models/User");
  const user = await User.findById(req.user._id);
  const idx = user.savedListings.indexOf(req.params.id);

  if (idx === -1) {
    user.savedListings.push(req.params.id);
  } else {
    user.savedListings.splice(idx, 1);
  }
  await user.save();
  res.json({ success: true, saved: idx === -1 });
});
