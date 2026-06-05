// src/components/AiCopilot.js
import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import { MOCK_LISTINGS, AI_SUGGESTIONS, TYPE_ICONS } from "../data/mockData";

export default function AiCopilot() {
  const { navigate } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your Bangalore Bachelor AI Copilot 🤖\n\nAsk me anything about PG accommodations, tiffin services, or cooks in Bangalore. I'll find the best options for you!",
      citations: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const messagesRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesRef.current)
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  // ── Send query ───────────────────────────────────────────
  const sendQuery = async (query) => {
    if (!query.trim() || loading) return;
    setInput("");

    setMessages((m) => [...m, { role: "user", text: query }]);
    setMessages((m) => [
      ...m,
      {
        role: "ai",
        text: "Searching listings...",
        citations: [],
        loading: true,
      },
    ]);
    setLoading(true);

    try {
      const data = await api.post("/ai/query", { query, sessionId });
      setMessages((m) => {
        const msgs = [...m];
        msgs[msgs.length - 1] = {
          role: "ai",
          text: data.answer || data.message || "No response received.",
          citations: data.citations || [],
          feedbackId: data.feedbackId,
          usedFallback: data.usedFallback,
          loading: false,
        };
        return msgs;
      });
    } catch {
      // Client-side keyword fallback (backend not running)
      const keywords = query.toLowerCase().split(" ");
      const typeMatch = keywords.find((w) =>
        ["pg", "tiffin", "cook"].includes(w),
      );
      let results = MOCK_LISTINGS;
      if (typeMatch) results = results.filter((l) => l.type === typeMatch);
      results = results
        .filter((l) =>
          keywords.some(
            (kw) =>
              l.title.toLowerCase().includes(kw) ||
              l.address.area.toLowerCase().includes(kw),
          ),
        )
        .slice(0, 3);
      if (!results.length) results = MOCK_LISTINGS.slice(0, 3);

      const answer =
        `Based on your query, here are some great options I found! I found ${results.length} matching listing(s). ` +
        `(Note: Backend not connected — showing demo results)`;

      setMessages((m) => {
        const msgs = [...m];
        msgs[msgs.length - 1] = {
          role: "ai",
          text: answer,
          citations: results.map((l) => ({ ...l, area: l.address.area })),
          loading: false,
        };
        return msgs;
      });
    }
    setLoading(false);
  };

  // ── Submit feedback ──────────────────────────────────────
  const submitFeedback = async (feedbackId, wasHelpful) => {
    if (!feedbackId) return;
    await api
      .post(`/ai/feedback/${feedbackId}`, { wasHelpful })
      .catch(() => {});
    setMessages((m) =>
      m.map((msg) =>
        msg.feedbackId === feedbackId
          ? { ...msg, feedbackGiven: wasHelpful }
          : msg,
      ),
    );
  };

  return (
    <>
      {/* ── Chat window ───────────────────────────────────── */}
      {open && (
        <div className="copilot-window fade-in">
          {/* Header */}
          <div className="copilot-header">
            <div className="copilot-avatar">🤖</div>
            <div className="copilot-info">
              <h4>AI Copilot</h4>
              <p>Powered by RAG + Vector Search</p>
            </div>
            <button
              style={{
                marginLeft: "auto",
                color: "var(--text3)",
                fontSize: 18,
              }}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="copilot-messages" ref={messagesRef}>
            {messages.map((m, i) => (
              <div key={i}>
                {/* Bubble */}
                <div className={`msg ${m.role} ${m.loading ? "loading" : ""}`}>
                  {m.text.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>

                {/* Citation cards */}
                {m.citations?.length > 0 && (
                  <div className="citation-cards">
                    {m.citations.map((c) => (
                      <div
                        key={c._id}
                        className="citation-card"
                        onClick={() => navigate("detail", c)}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div className="citation-card-title">
                            {TYPE_ICONS[c.type]} {c.title}
                          </div>
                          {c.score && (
                            <span
                              style={{ fontSize: 11, color: "var(--text3)" }}
                            >
                              {Math.round(c.score * 100)}% match
                            </span>
                          )}
                        </div>
                        <div className="citation-card-meta">
                          📍 {c.area || c.address?.area} · ₹{c.price?.amount}/
                          {c.price?.unit}
                          {c.rating > 0 && ` · ★ ${c.rating}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Feedback buttons */}
                {m.feedbackId && m.feedbackGiven === undefined && (
                  <div className="feedback-btns">
                    <button
                      className="feedback-btn"
                      onClick={() => submitFeedback(m.feedbackId, true)}
                    >
                      👍 Helpful
                    </button>
                    <button
                      className="feedback-btn no"
                      onClick={() => submitFeedback(m.feedbackId, false)}
                    >
                      👎 Not helpful
                    </button>
                  </div>
                )}
                {m.feedbackGiven !== undefined && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text3)",
                      marginTop: 4,
                    }}
                  >
                    {m.feedbackGiven
                      ? "✓ Thanks for the feedback!"
                      : "✓ Noted, we'll improve!"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggestion chips (only on fresh chat) */}
          {messages.length <= 1 && (
            <div className="copilot-suggestions">
              {AI_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="suggestion"
                  onClick={() => sendQuery(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="copilot-input">
            <input
              placeholder="Ask about PG, tiffin, cook..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendQuery(input)}
              disabled={loading}
            />
            <button
              className="copilot-send"
              onClick={() => sendQuery(input)}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* ── Floating toggle button ─────────────────────────── */}
      <div className="copilot-panel">
        <button
          className="copilot-toggle"
          onClick={() => setOpen((o) => !o)}
          title="AI Copilot"
        >
          {open ? "✕" : "🤖"}
        </button>
      </div>
    </>
  );
}
