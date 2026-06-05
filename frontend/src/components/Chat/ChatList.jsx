// src/components/Chat/ChatList.jsx
import React from "react";
import { useChat } from "../../context/ChatContext";
import { useApp } from "../../context/AppContext";

export default function ChatList() {
  const { conversations, activeConversation, openConversation } = useChat();
  const { user } = useApp();

  if (!conversations.length) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "var(--text3)" }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
        <div>No conversations yet</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>
          Contact a listing owner to start chatting
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      {conversations.map((conv) => {
        const other = conv.participants?.find((p) => p._id !== user?._id);
        const unread = conv.unreadCount?.get?.(user?._id) || 0;
        const isActive = activeConversation?._id === conv._id;

        return (
          <div
            key={conv._id}
            onClick={() => openConversation(conv._id)}
            style={{
              padding: "14px 16px",
              cursor: "pointer",
              background: isActive ? "var(--accent-dim)" : "transparent",
              borderLeft: isActive
                ? "3px solid var(--accent)"
                : "3px solid transparent",
              borderBottom: "1px solid var(--border)",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Avatar */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "var(--accent-dim)",
                  border: "2px solid var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  color: "var(--accent)",
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                {(other?.name || "U").charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text)",
                    }}
                  >
                    {other?.name || "Unknown"}
                  </div>
                  {unread > 0 && (
                    <div
                      style={{
                        background: "var(--accent)",
                        color: "#0f0f0f",
                        borderRadius: "999px",
                        minWidth: 18,
                        height: 18,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 5px",
                      }}
                    >
                      {unread}
                    </div>
                  )}
                </div>

                {conv.listing && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      marginBottom: 2,
                    }}
                  >
                    Re: {conv.listing.title}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text3)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.lastMessage?.text || "No messages yet"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
