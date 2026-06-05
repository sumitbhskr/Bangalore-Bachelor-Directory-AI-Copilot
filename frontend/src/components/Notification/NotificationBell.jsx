// src/components/Notifications/NotificationBell.jsx
import React, { useState } from "react";
import { useNotif } from "../../context/NotificationContext";
import { useApp } from "../../context/AppContext";

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotif();
  const { navigate } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "relative",
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "var(--danger)",
              color: "#fff",
              borderRadius: "999px",
              minWidth: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            width: 320,
            maxHeight: 400,
            overflowY: "auto",
            background: "var(--bg2)",
            border: "1px solid var(--border2)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            zIndex: 200,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "var(--text3)",
                fontSize: 13,
              }}
            >
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => {
                  markRead(n._id);
                  if (n.link) navigate(n.link);
                  setOpen(false);
                }}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border)",
                  background: n.isRead
                    ? "transparent"
                    : "rgba(232,164,90,0.05)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <div
                  style={{
                    fontWeight: n.isRead ? 400 : 600,
                    fontSize: 13,
                    color: "var(--text)",
                    marginBottom: 2,
                  }}
                >
                  {n.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    marginBottom: 4,
                  }}
                >
                  {n.body}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {!n.isRead && (
                    <span
                      style={{
                        marginLeft: 6,
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      ● New
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 199 }}
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
