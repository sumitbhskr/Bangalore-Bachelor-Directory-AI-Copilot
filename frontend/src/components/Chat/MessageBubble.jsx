// src/components/Chat/MessageBubble.jsx
import React from "react";
import { useApp } from "../../context/AppContext";

export default function MessageBubble({ message }) {
  const { user } = useApp();
  const isMine =
    message.sender?._id === user?._id || message.sender === user?._id;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      {!isMine && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent)",
            marginRight: 8,
            flexShrink: 0,
            alignSelf: "flex-end",
          }}
        >
          {(message.sender?.name || "U").charAt(0).toUpperCase()}
        </div>
      )}

      <div style={{ maxWidth: "72%" }}>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            background: isMine ? "var(--accent)" : "var(--bg3)",
            color: isMine ? "#0f0f0f" : "var(--text)",
            fontSize: 14,
            lineHeight: 1.5,
            border: isMine ? "none" : "1px solid var(--border)",
          }}
        >
          {message.text}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text3)",
            marginTop: 3,
            textAlign: isMine ? "right" : "left",
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isMine && (
            <span style={{ marginLeft: 4 }}>
              {message.isRead ? " ✓✓" : " ✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
