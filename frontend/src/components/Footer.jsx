// src/components/Footer.js
import React from "react";
import { useApp } from "../context/AppContext";

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 48,
        padding: "32px 0",
        color: "var(--text3)",
        textAlign: "center",
        fontSize: 13,
      }}
    >
      <div className="container">
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            color: "var(--accent)",
            marginBottom: 8,
          }}
        >
          Bangalore Bachelor Directory
        </div>
        <div>
          © 2024 · Built with React, Node.js, MongoDB, Cloudinary &amp; OpenAI
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            gap: 16,
            justifyContent: "center",
          }}
        >
          <button
            className="nav-btn ghost"
            style={{ fontSize: 12 }}
            onClick={() => navigate("browse", { type: "pg" })}
          >
            PG
          </button>
          <button
            className="nav-btn ghost"
            style={{ fontSize: 12 }}
            onClick={() => navigate("browse", { type: "tiffin" })}
          >
            Tiffin
          </button>
          <button
            className="nav-btn ghost"
            style={{ fontSize: 12 }}
            onClick={() => navigate("browse", { type: "cook" })}
          >
            Cook
          </button>
        </div>
      </div>
    </footer>
  );
}
