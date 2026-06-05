const express = require("express");
const router = express.Router();
const {
  submitVerification,
  getMyVerifications,
  getPending,
  reviewVerification,
} = require("../controllers/verificationController");
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.post(
  "/:listingId/submit",
  protect,
  authorize("owner", "admin"),
  upload.array("documents", 5),
  submitVerification,
);
router.get("/my", protect, getMyVerifications);
router.get("/pending", protect, authorize("admin"), getPending);
router.put("/:id/review", protect, authorize("admin"), reviewVerification);

module.exports = router;
