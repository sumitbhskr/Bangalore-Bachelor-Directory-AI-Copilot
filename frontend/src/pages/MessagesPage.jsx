// src/pages/MessagesPage.jsx
import React from "react";
import { useChat } from "../context/ChatContext";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWindow";

export default function MessagesPage() {
  const { unreadCount } = useChat();

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            marginBottom: 4,
          }}
        >
          Messages{" "}
          {unreadCount > 0 && (
            <span
              style={{
                background: "var(--accent)",
                color: "#0f0f0f",
                fontSize: 14,
                padding: "2px 10px",
                borderRadius: 999,
                marginLeft: 8,
              }}
            >
              {unreadCount} new
            </span>
          )}
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>
          Chat with PG owners, tiffin providers, and cooks
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: 0,
          height: "65vh",
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        {/* Left: conversation list */}
        <div
          style={{ borderRight: "1px solid var(--border)", overflowY: "auto" }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--border)",
              fontWeight: 600,
              fontSize: 13,
              color: "var(--text2)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Conversations
          </div>
          <ChatList />
        </div>

        {/* Right: active chat */}
        <ChatWindow />
      </div>
    </div>
  );
}
