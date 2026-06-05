const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { asyncHandler } = require("../middleware/errorHandler");

// @route GET /api/messages/conversations
// Get all conversations for logged-in user
exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate("participants", "name avatar")
    .populate("listing", "title type address images")
    .sort({ updatedAt: -1 });

  res.json({ success: true, conversations });
});

// @route POST /api/messages/conversations
// Start or get existing conversation
exports.getOrCreateConversation = asyncHandler(async (req, res) => {
  const { recipientId, listingId } = req.body;

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipientId] },
    listing: listingId || null,
  })
    .populate("participants", "name avatar")
    .populate("listing", "title type address images");

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
      listing: listingId || null,
    });
    await conversation.populate("participants", "name avatar");
    await conversation.populate("listing", "title type address images");
  }

  res.json({ success: true, conversation });
});

// @route GET /api/messages/conversations/:id
// Get messages in a conversation (paginated)
exports.getMessages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  // Verify user is a participant
  const conversation = await Conversation.findOne({
    _id: id,
    participants: req.user._id,
  });
  if (!conversation) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  const [messages, total] = await Promise.all([
    Message.find({ conversation: id })
      .populate("sender", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments({ conversation: id }),
  ]);

  // Mark messages as read
  await Message.updateMany(
    { conversation: id, sender: { $ne: req.user._id }, isRead: false },
    { isRead: true, readAt: new Date() },
  );
  conversation.unreadCount.set(req.user._id.toString(), 0);
  await conversation.save();

  res.json({
    success: true,
    messages: messages.reverse(), // oldest first
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// @route GET /api/messages/unread-count
// Total unread messages for logged-in user
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  });

  let totalUnread = 0;
  conversations.forEach((c) => {
    totalUnread += c.unreadCount.get(req.user._id.toString()) || 0;
  });

  res.json({ success: true, unreadCount: totalUnread });
});
