const express = require("express");
const router = express.Router();
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  toggleSave,
} = require("../controllers/listingController");
const { addReview, getReviews } = require("../controllers/reviewController");
const { protect, authorize, ownerOrAdmin } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");
const Listing = require("../models/Listing");

// Public routes
router.get("/", getListings);
router.get("/my", protect, authorize("owner", "admin"), getMyListings);
router.get("/:id", getListing);
router.get("/:listingId/reviews", getReviews);

// Protected routes
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 5),
  createListing,
);
router.put(
  "/:id",
  protect,
  ownerOrAdmin(Listing),
  upload.array("images", 5),
  updateListing,
);
router.delete("/:id", protect, ownerOrAdmin(Listing), deleteListing);
router.put("/:id/save", protect, toggleSave);

// Reviews
router.post("/:listingId/reviews", protect, addReview);

module.exports = router;
