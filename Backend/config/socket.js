const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Notification = require("../models/Notification");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ── Auth middleware ──────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  // ── Connection handler ───────────────────────────────────
  io.on("connection", (socket) => {
    console.log(
      `✅ Socket connected: ${socket.user.name} (${socket.user._id})`,
    );

    // Join personal room (for notifications)
    socket.join(`user_${socket.user._id}`);

    // ── Join conversation room ──────────────────────────
    socket.on("join_conversation", (conversationId) => {
      socket.join(`conv_${conversationId}`);
    });

    // ── Leave conversation room ─────────────────────────
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conv_${conversationId}`);
    });

    // ── Send message ────────────────────────────────────
    socket.on("send_message", async ({ conversationId, text }) => {
      try {
        // Save message to DB
        const message = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          text,
        });

        await message.populate("sender", "name avatar");

        // Update conversation last message
        const conversation = await Conversation.findById(conversationId);
        conversation.lastMessage = {
          text,
          sender: socket.user._id,
          createdAt: new Date(),
        };

        // Update unread count for other participants
        conversation.participants.forEach((participantId) => {
          if (participantId.toString() !== socket.user._id.toString()) {
            const current =
              conversation.unreadCount.get(participantId.toString()) || 0;
            conversation.unreadCount.set(participantId.toString(), current + 1);
          }
        });
        await conversation.save();

        // Emit message to all in conversation room
        io.to(`conv_${conversationId}`).emit("new_message", message);

        // Send notification to other participants
        for (const participantId of conversation.participants) {
          if (participantId.toString() !== socket.user._id.toString()) {
            const notification = await Notification.create({
              user: participantId,
              type: "new_message",
              title: `New message from ${socket.user.name}`,
              body: text.slice(0, 80),
              link: "/messages",
              refModel: "Message",
              refId: message._id,
            });
            // Real-time notification
            io.to(`user_${participantId}`).emit(
              "new_notification",
              notification,
            );
          }
        }
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ── Mark messages as read ───────────────────────────
    socket.on("mark_read", async (conversationId) => {
      try {
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: socket.user._id },
            isRead: false,
          },
          { isRead: true, readAt: new Date() },
        );
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          conversation.unreadCount.set(socket.user._id.toString(), 0);
          await conversation.save();
        }
        socket.to(`conv_${conversationId}`).emit("messages_read", {
          conversationId,
          readBy: socket.user._id,
        });
      } catch (err) {
        socket.emit("error", { message: err.message });
      }
    });

    // ── Typing indicator ────────────────────────────────
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(`conv_${conversationId}`).emit("user_typing", {
        userId: socket.user._id,
        name: socket.user.name,
        isTyping,
      });
    });

    // ── Disconnect ──────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
