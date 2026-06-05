// src/pages/HomePage.js
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";
import { MOCK_LISTINGS, TYPE_ICONS, TYPE_LABELS } from "../data/mockData";

export default function HomePage() {
  const { navigate } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const featuredListings = MOCK_LISTINGS.slice(0, 6);

  const handleSearch = () =>
    navigate("browse", {
      search,
      type: typeFilter !== "all" ? typeFilter : "",
    });

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="hero">
        <div className="container">
          <h1>
            Find your <em>perfect</em>
            <br />
            Bangalore setup
          </h1>
          <p>
            Discover PG accommodations, tiffin services, and personal cooks —
            everything a bachelor needs in Bangalore.
          </p>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">2,400+</div>
              <div className="stat-label">Listings</div>
            </div>
            <div className="stat">
              <div className="stat-num">50+</div>
              <div className="stat-label">Areas</div>
            </div>
            <div className="stat">
              <div className="stat-num">15k+</div>
              <div className="stat-label">Happy Tenants</div>
            </div>
          </div>

          {/* Search bar */}
          <div className="search-bar">
            <input
              placeholder="Search by area, name, amenity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="pg">PG</option>
              <option value="tiffin">Tiffin</option>
              <option value="cook">Cook</option>
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>

          {/* Type pills */}
          <div className="type-pills">
            {["all", "pg", "tiffin", "cook"].map((t) => (
              <button
                key={t}
                className={`pill ${t} ${typeFilter === t ? "active" : ""}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === "all"
                  ? "🔍 All"
                  : `${TYPE_ICONS[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Listings ─────────────────────────────── */}
      <div className="container">
        <div className="section">
          <div className="section-header">
            <div className="section-title">Featured Listings</div>
            <button className="section-link" onClick={() => navigate("browse")}>
              View all →
            </button>
          </div>
          <div className="grid">
            {featuredListings.map((l) => (
              <ListingCard
                key={l._id}
                listing={l}
                onClick={(listing) => navigate("detail", listing)}
              />
            ))}
          </div>
        </div>

        {/* ── Browse by Category ─────────────────────────── */}
        <div className="section">
          <div className="section-title" style={{ marginBottom: 24 }}>
            Browse by Category
          </div>
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {[
              {
                type: "pg",
                desc: "Safe, affordable PG rooms across Bangalore with meals, WiFi, and more.",
              },
              {
                type: "tiffin",
                desc: "Home-cooked meals delivered to your door. Veg and non-veg options.",
              },
              {
                type: "cook",
                desc: "Hire a personal cook for morning and evening meals at your place.",
              },
            ].map(({ type, desc }) => (
              <div
                key={type}
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("browse", { type })}
              >
                <div style={{ padding: "28px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>
                    {TYPE_ICONS[type]}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      marginBottom: 8,
                    }}
                  >
                    {TYPE_LABELS[type]}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "var(--text2)",
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      color: "var(--accent)",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Explore →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
