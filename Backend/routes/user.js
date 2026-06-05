// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

// Admin: get all users
router.get(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ success: true, count: users.length, users });
  }),
);

// Admin: deactivate user
router.put(
  "/:id/deactivate",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deactivated" });
  }),
);

module.exports = router;
