const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyPayments,
  getPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/my", getMyPayments);
router.get("/:id", getPayment);

module.exports = router;
