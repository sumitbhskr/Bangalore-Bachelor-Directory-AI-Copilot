const Notification = require("../models/Notification");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/notifications
exports.getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ user: req.user._id }),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  res.json({ success: true, notifications, total, unreadCount });
});

// @route PUT /api/notifications/:id/read
exports.markRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true, readAt: new Date() },
  );
  res.json({ success: true });
});

// @route PUT /api/notifications/mark-all-read
exports.markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() },
  );
  res.json({ success: true, message: "All notifications marked as read" });
});

// @route DELETE /api/notifications/:id
exports.deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  res.json({ success: true, message: "Notification deleted" });
});
