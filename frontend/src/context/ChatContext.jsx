// src/context/ChatContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getSocket } from "../services/socket";
import api from "../services/api";
import { useApp } from "./AppContext";

const ChatCtx = createContext(null);

export function ChatProvider({ children }) {
  const { token } = useApp();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState({});
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // ── Load conversations ───────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!token) return;
    const data = await api
      .get("/messages/conversations", token)
      .catch(() => ({}));
    if (data.success) setConversations(data.conversations);
  }, [token]);

  // ── Unread count ─────────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    const data = await api
      .get("/messages/unread-count", token)
      .catch(() => ({}));
    if (data.success) setUnreadCount(data.unreadCount);
  }, [token]);

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
  }, [fetchConversations, fetchUnreadCount]);

  // ── Open a conversation ──────────────────────────────────
  const openConversation = useCallback(
    async (conversationId) => {
      setLoadingMsgs(true);
      const socket = getSocket();

      // Leave previous room
      if (activeConversation)
        socket?.emit("leave_conversation", activeConversation._id);

      const data = await api
        .get(`/messages/conversations/${conversationId}`, token)
        .catch(() => ({}));
      if (data.success) {
        setMessages(data.messages);
        const conv = conversations.find((c) => c._id === conversationId);
        setActiveConversation(conv || null);
      }

      // Join new room
      socket?.emit("join_conversation", conversationId);
      socket?.emit("mark_read", conversationId);
      setLoadingMsgs(false);
    },
    [token, activeConversation, conversations],
  );

  // ── Start or get conversation ────────────────────────────
  const startConversation = useCallback(
    async (recipientId, listingId) => {
      const data = await api.post(
        "/messages/conversations",
        { recipientId, listingId },
        token,
      );
      if (data.success) {
        await fetchConversations();
        await openConversation(data.conversation._id);
        return data.conversation;
      }
      return null;
    },
    [token, fetchConversations, openConversation],
  );

  // ── Socket: receive new message ──────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      // Update conversation last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === message.conversation
            ? {
                ...c,
                lastMessage: {
                  text: message.text,
                  createdAt: message.createdAt,
                },
              }
            : c,
        ),
      );
      // If not in active conversation, increment unread
      if (message.conversation !== activeConversation?._id) {
        setUnreadCount((n) => n + 1);
      }
    };

    const onTyping = ({ userId, name, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [userId]: isTyping ? name : null }));
    };

    socket.on("new_message", onNewMessage);
    socket.on("user_typing", onTyping);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("user_typing", onTyping);
    };
  }, [activeConversation]);

  // ── Send message via socket ──────────────────────────────
  const sendMessage = useCallback(
    (text) => {
      const socket = getSocket();
      if (!socket || !activeConversation || !text.trim()) return;
      socket.emit("send_message", {
        conversationId: activeConversation._id,
        text,
      });
    },
    [activeConversation],
  );

  // ── Typing indicator ─────────────────────────────────────
  const emitTyping = useCallback(
    (isTyping) => {
      const socket = getSocket();
      if (!socket || !activeConversation) return;
      socket.emit("typing", {
        conversationId: activeConversation._id,
        isTyping,
      });
    },
    [activeConversation],
  );

  return (
    <ChatCtx.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        unreadCount,
        typingUsers,
        loadingMsgs,
        fetchConversations,
        openConversation,
        startConversation,
        sendMessage,
        emitTyping,
      }}
    >
      {children}
    </ChatCtx.Provider>
  );
}

export const useChat = () => useContext(ChatCtx);
