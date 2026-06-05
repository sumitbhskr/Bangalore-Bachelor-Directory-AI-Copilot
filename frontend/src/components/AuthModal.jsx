// src/components/AuthModal.js
import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function AuthModal() {
  const { showAuth, setShowAuth, login, register } = useApp();
  const [mode, setMode] = useState(showAuth || "login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  if (!showAuth) return null;

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    if (mode === "login") await login(form.email, form.password);
    else await register(form);
    setLoading(false);
  };

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && setShowAuth(null)}
    >
      <div className="modal fade-in" style={{ position: "relative" }}>
        {/* Close */}
        <button className="modal-close" onClick={() => setShowAuth(null)}>
          ✕
        </button>

        <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p>
          {mode === "login"
            ? "Sign in to your Bangalore Bachelor account"
            : "Join thousands of bachelors finding their perfect setup"}
        </p>

        {/* Register-only fields */}
        {mode === "register" && (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setF("name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                placeholder="10-digit number"
                value={form.phone}
                onChange={(e) => setF("phone", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setF("email", e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={(e) => setF("password", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Role selector (register only) */}
        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              className="form-input"
              value={form.role}
              onChange={(e) => setF("role", e.target.value)}
            >
              <option value="user">
                Tenant / Customer (Looking for PG, food, cook)
              </option>
              <option value="owner">
                Owner / Provider (Listing PG, tiffin, cook services)
              </option>
            </select>
          </div>
        )}

        <button
          className="btn-full btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>

        <div className="modal-switch">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => setMode("register")}>Sign up</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
