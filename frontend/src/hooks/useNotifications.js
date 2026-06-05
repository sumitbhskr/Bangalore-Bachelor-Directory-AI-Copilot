// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { getSocket } from "../services/socket";
import { useApp } from "../context/AppContext";

export default function useNotifications() {
  const { token } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const data = await api.get("/notifications", token).catch(() => ({}));
    if (data.success) {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    }
    setLoading(false);
  }, [token]);

  // Real-time new notifications via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    socket.on("new_notification", handler);
    return () => socket.off("new_notification", handler);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(
    async (id) => {
      await api.put(`/notifications/${id}/read`, {}, token).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    },
    [token],
  );

  const markAllRead = useCallback(async () => {
    await api.put("/notifications/mark-all-read", {}, token).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [token]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markRead,
    markAllRead,
  };
}
