// src/components/Navbar.js
import React from "react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { user, logout, setShowAuth, navigate } = useApp();

  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* Logo */}
        <div onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
          <div className="nav-logo">
            Bangalore Bachelor
            <span>PG · Tiffin · Cook Directory</span>
          </div>
        </div>

        {/* Links */}
        <div className="nav-links">
          <button className="nav-btn ghost" onClick={() => navigate("browse")}>
            Browse
          </button>

          {user && (user.role === "owner" || user.role === "admin") && (
            <button
              className="nav-btn ghost"
              onClick={() => navigate("dashboard")}
            >
              Dashboard
            </button>
          )}

          {user ? (
            <>
              <div
                className="nav-avatar"
                title={user.name}
                onClick={() => navigate("profile")}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="nav-btn ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="nav-btn ghost"
                onClick={() => setShowAuth("login")}
              >
                Login
              </button>
              <button
                className="nav-btn primary"
                onClick={() => setShowAuth("register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
