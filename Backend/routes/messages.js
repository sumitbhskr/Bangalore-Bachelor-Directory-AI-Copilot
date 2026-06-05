const express = require("express");
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  getUnreadCount,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.use(protect); // all message routes need auth

router.get("/conversations", getConversations);
router.post("/conversations", getOrCreateConversation);
router.get("/conversations/:id", getMessages);
router.get("/unread-count", getUnreadCount);

module.exports = router;
