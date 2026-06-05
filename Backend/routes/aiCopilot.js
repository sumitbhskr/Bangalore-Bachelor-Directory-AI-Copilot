// routes/aiCopilot.js
const express = require("express");
const router = express.Router();
const {
  queryCopilot,
  submitFeedback,
  generateListingEmbedding,
  generateAllEmbeddings,
} = require("../controllers/aiCopilotController");
const { protect, authorize } = require("../middleware/auth");

router.post("/query", queryCopilot); // public (rate limited)
router.post("/feedback/:feedbackId", submitFeedback);

// Admin only — generate embeddings
router.post(
  "/embed/:listingId",
  protect,
  authorize("admin"),
  generateListingEmbedding,
);
router.post("/embed-all", protect, authorize("admin"), generateAllEmbeddings);

module.exports = router;
