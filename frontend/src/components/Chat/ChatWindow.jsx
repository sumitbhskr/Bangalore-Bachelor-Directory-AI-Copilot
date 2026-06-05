// src/components/Chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { useApp } from "../../context/AppContext";
import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const {
    activeConversation,
    messages,
    sendMessage,
    emitTyping,
    typingUsers,
    loadingMsgs,
  } = useChat();
  const { user } = useApp();
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
    emitTyping(false);
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    emitTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => emitTyping(false), 1500);
  };

  const other = activeConversation?.participants?.find(
    (p) => p._id !== user?._id,
  );
  const typingNames = Object.entries(typingUsers)
    .filter(([, name]) => name)
    .map(([, name]) => name);

  if (!activeConversation) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text3)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <div style={{ fontSize: 16, color: "var(--text2)" }}>
            Select a conversation
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            Choose from the list or start a new chat
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "var(--bg2)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--accent-dim)",
            border: "2px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            color: "var(--accent)",
          }}
        >
          {(other?.name || "U").charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>
            {other?.name || "Unknown"}
          </div>
          {activeConversation.listing && (
            <div style={{ fontSize: 12, color: "var(--accent)" }}>
              Re: {activeConversation.listing.title}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {loadingMsgs ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble key={m._id} message={m} />
            ))}
            {typingNames.length > 0 && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text3)",
                  fontStyle: "italic",
                  padding: "4px 0",
                }}
              >
                {typingNames.join(", ")}{" "}
                {typingNames.length === 1 ? "is" : "are"} typing...
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 8,
          background: "var(--bg2)",
        }}
      >
        <input
          style={{
            flex: 1,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text)",
            fontSize: 14,
            padding: "10px 14px",
            outline: "none",
          }}
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <button
          onClick={handleSend}
          style={{
            background: "var(--accent)",
            color: "#0f0f0f",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "10px 18px",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
