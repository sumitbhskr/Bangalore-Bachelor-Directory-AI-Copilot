// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import { MOCK_LISTINGS, AREAS, TYPE_ICONS } from "../data/mockData";

export default function Dashboard() {
  const { token, user, showToast } = useApp();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "pg",
    description: "",
    streetAddress: "",
    area: "",
    price: "",
    priceUnit: "month",
    contactPhone: "",
  });

  // ── Load owner's listings ────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api
      .get("/listings/owner/my", token)
      .then((d) => {
        if (d.success) setListings(d.listings);
      })
      .catch(() => setListings(MOCK_LISTINGS.slice(0, 3)))
      .finally(() => setLoading(false));
  }, [token]);

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Create listing ───────────────────────────────────────
  const handleCreate = async () => {
    const body = {
      title: form.title,
      type: form.type,
      description: form.description,
      address: {
        street: form.streetAddress,
        area: form.area,
        city: "Bangalore",
      },
      price: { amount: +form.price, unit: form.priceUnit },
      contactPhone: form.contactPhone,
    };
    const data = await api.post("/listings", body, token).catch(() => ({}));
    if (data.success) {
      setListings((l) => [data.listing, ...l]);
      setShowForm(false);
      setForm({
        title: "",
        type: "pg",
        description: "",
        streetAddress: "",
        area: "",
        price: "",
        priceUnit: "month",
        contactPhone: "",
      });
      showToast("Listing created successfully!");
    } else {
      showToast(data.message || "Failed to create listing", "error");
    }
  };

  // ── Delete listing ───────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    const data = await api.delete(`/listings/${id}`, token).catch(() => ({}));
    if (data.success) {
      setListings((l) => l.filter((x) => x._id !== id));
      showToast("Listing deleted");
    } else {
      showToast(data.message || "Failed to delete", "error");
    }
  };

  // ── Derived stats ────────────────────────────────────────
  const totalReviews = listings.reduce((s, l) => s + l.reviewCount, 0);
  const avgRating = listings.length
    ? (listings.reduce((s, l) => s + l.rating, 0) / listings.length).toFixed(1)
    : "0";

  return (
    <div className="container dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            marginBottom: 8,
          }}
        >
          My Dashboard
        </h2>
        <p style={{ color: "var(--text2)" }}>
          Manage your listings, {user?.name}
        </p>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        <div className="dash-stat">
          <div className="dash-stat-num">{listings.length}</div>
          <div className="dash-stat-label">Total Listings</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-num">
            {listings.filter((l) => l.isActive).length}
          </div>
          <div className="dash-stat-label">Active Listings</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-num">{totalReviews}</div>
          <div className="dash-stat-label">Total Reviews</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-num">{avgRating}</div>
          <div className="dash-stat-label">Avg Rating</div>
        </div>
      </div>

      {/* Listings header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>
          My Listings
        </h3>
        <button
          className="nav-btn primary"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? "✕ Cancel" : "+ Add Listing"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="detail-content fade-in" style={{ marginBottom: 24 }}>
          <h3
            style={{
              marginBottom: 16,
              fontFamily: "var(--font-display)",
              fontSize: 22,
            }}
          >
            New Listing
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                placeholder="e.g. Sunrise PG for Men"
                value={form.title}
                onChange={(e) => setF("title", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select
                className="form-input"
                value={form.type}
                onChange={(e) => setF("type", e.target.value)}
              >
                <option value="pg">PG Accommodation</option>
                <option value="tiffin">Tiffin Service</option>
                <option value="cook">Personal Cook</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-input"
              rows="3"
              style={{ width: "100%", resize: "vertical" }}
              placeholder="Describe your listing..."
              value={form.description}
              onChange={(e) => setF("description", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                className="form-input"
                placeholder="123, MG Road"
                value={form.streetAddress}
                onChange={(e) => setF("streetAddress", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Area *</label>
              <select
                className="form-input"
                value={form.area}
                onChange={(e) => setF("area", e.target.value)}
              >
                <option value="">Select Area</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                className="form-input"
                type="number"
                placeholder="5000"
                value={form.price}
                onChange={(e) => setF("price", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Per</label>
              <select
                className="form-input"
                value={form.priceUnit}
                onChange={(e) => setF("priceUnit", e.target.value)}
              >
                <option value="month">Month</option>
                <option value="meal">Meal</option>
                <option value="day">Day</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              className="form-input"
              placeholder="Your phone number"
              value={form.contactPhone}
              onChange={(e) => setF("contactPhone", e.target.value)}
            />
          </div>

          <button className="btn-primary btn-full" onClick={handleCreate}>
            Create Listing
          </button>
        </div>
      )}

      {/* Listings list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {listings.map((l) => (
            <div
              key={l._id}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 32 }}>{TYPE_ICONS[l.type]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {l.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>
                  {l.address.area} · ₹{l.price.amount}/{l.price.unit} ·{" "}
                  {l.rating} ★ ({l.reviewCount} reviews)
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="nav-btn ghost" style={{ fontSize: 13 }}>
                  Edit
                </button>
                <button
                  className="nav-btn ghost"
                  style={{ fontSize: 13, color: "var(--danger)" }}
                  onClick={() => handleDelete(l._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🏠</div>
              <h3>No listings yet</h3>
              <p>Create your first listing to start receiving inquiries</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
