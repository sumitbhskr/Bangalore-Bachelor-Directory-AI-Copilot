// src/pages/DetailPage.js
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import { TYPE_ICONS } from "../data/mockData";

const MOCK_REVIEWS = [
  {
    _id: "r1",
    rating: 5,
    title: "Excellent PG!",
    body: "Very clean and well maintained. The food is great and the staff is helpful.",
    user: { name: "Rahul M", avatar: "" },
    createdAt: "2024-01-10",
  },
  {
    _id: "r2",
    rating: 4,
    title: "Good value for money",
    body: "Nice place overall. WiFi could be faster but everything else is good.",
    user: { name: "Priya S", avatar: "" },
    createdAt: "2024-01-05",
  },
];

export default function DetailPage({ listing }) {
  const { user, token, showToast, setShowAuth } = useApp();
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    body: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const typeColor =
    listing.type === "pg"
      ? "var(--pg)"
      : listing.type === "tiffin"
        ? "var(--tiffin)"
        : "var(--cook)";

  // ── Add review ───────────────────────────────────────────
  const handleAddReview = async () => {
    if (!user) {
      setShowAuth("login");
      return;
    }
    if (!newReview.title || !newReview.body) {
      showToast("Please fill all review fields", "error");
      return;
    }
    setSubmitting(true);
    const data = await api
      .post(`/listings/${listing._id}/reviews`, newReview, token)
      .catch(() => ({}));
    if (data.success) {
      setReviews((r) => [data.review, ...r]);
      setNewReview({ rating: 5, title: "", body: "" });
      showToast("Review added successfully!");
    } else {
      showToast(data.message || "Failed to add review", "error");
    }
    setSubmitting(false);
  };

  // ── Save / unsave listing ────────────────────────────────
  const handleToggleSave = async () => {
    if (!user) {
      setShowAuth("login");
      return;
    }
    const data = await api
      .put(`/listings/${listing._id}/save`, {}, token)
      .catch(() => ({}));
    if (data.success) {
      setSaved((s) => !s);
      showToast(data.saved ? "Listing saved!" : "Removed from saved");
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* ── Hero image ──────────────────────────────────── */}
      <div className="detail-hero">
        {listing.images && listing.images[0] ? (
          <img src={listing.images[0].url} alt={listing.title} />
        ) : (
          <span>{TYPE_ICONS[listing.type]}</span>
        )}
      </div>

      <div className="detail-layout">
        {/* ── Left column ─────────────────────────────── */}
        <div>
          <div className="detail-content">
            {/* Meta row */}
            <div className="detail-meta">
              <div className={`card-type type-${listing.type}`}>
                {TYPE_ICONS[listing.type]} {listing.type.toUpperCase()}
              </div>
              {listing.isVerified && (
                <span
                  className="badge"
                  style={{
                    background: "rgba(74,158,127,0.15)",
                    color: "var(--pg)",
                  }}
                >
                  ✓ Verified
                </span>
              )}
              <div className="card-rating">
                <span className="stars">
                  {"★".repeat(Math.round(listing.rating))}
                </span>
                {listing.rating.toFixed(1)} · {listing.reviewCount} reviews
              </div>
            </div>

            <h1 className="detail-title">{listing.title}</h1>
            <div
              style={{
                color: "var(--text2)",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              📍 {listing.address.area}, {listing.address.city}
              {listing.address.landmark &&
                ` · Near ${listing.address.landmark}`}
            </div>

            {/* Description */}
            <div className="detail-section">
              <h3>About this listing</h3>
              <p
                style={{ color: "var(--text2)", lineHeight: 1.7, fontSize: 15 }}
              >
                {listing.description}
              </p>
            </div>

            {/* PG-specific details */}
            {listing.type === "pg" && listing.pgDetails && (
              <div className="detail-section">
                <h3>PG Details</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  {[
                    ["Room Type", listing.pgDetails.roomType],
                    ["Gender", listing.pgDetails.gender],
                    ["Furnishing", listing.pgDetails.furnishing],
                    [
                      "Available Beds",
                      listing.pgDetails.availableBeds ?? "Contact owner",
                    ],
                  ].map(
                    ([k, v]) =>
                      v && (
                        <div
                          key={k}
                          style={{
                            background: "var(--bg3)",
                            borderRadius: "var(--radius-sm)",
                            padding: "12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text3)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: 4,
                            }}
                          >
                            {k}
                          </div>
                          <div
                            style={{
                              fontWeight: 500,
                              textTransform: "capitalize",
                            }}
                          >
                            {v}
                          </div>
                        </div>
                      ),
                  )}
                </div>
                {listing.pgDetails.amenities?.length > 0 && (
                  <>
                    <h3 style={{ marginTop: 16 }}>Amenities</h3>
                    <div className="amenity-chips" style={{ marginTop: 8 }}>
                      {listing.pgDetails.amenities.map((a) => (
                        <div key={a} className="chip">
                          ✓ {a}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tiffin-specific details */}
            {listing.type === "tiffin" && listing.tiffinDetails && (
              <div className="detail-section">
                <h3>Tiffin Details</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  {[
                    ["Diet Type", listing.tiffinDetails.dietType],
                    ["Meals per Day", listing.tiffinDetails.mealsPerDay],
                    [
                      "Delivery",
                      listing.tiffinDetails.deliveryAvailable
                        ? "Available"
                        : "Pickup only",
                    ],
                    ["Cuisine", listing.tiffinDetails.cuisineType?.join(", ")],
                  ].map(
                    ([k, v]) =>
                      v && (
                        <div
                          key={k}
                          style={{
                            background: "var(--bg3)",
                            borderRadius: "var(--radius-sm)",
                            padding: "12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text3)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: 4,
                            }}
                          >
                            {k}
                          </div>
                          <div
                            style={{
                              fontWeight: 500,
                              textTransform: "capitalize",
                            }}
                          >
                            {v}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}

            {/* Cook-specific details */}
            {listing.type === "cook" && listing.cookDetails && (
              <div className="detail-section">
                <h3>Cook Details</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  {[
                    ["Experience", `${listing.cookDetails.experience} years`],
                    [
                      "Cooks for",
                      `Up to ${listing.cookDetails.cookingFor || "?"} people`,
                    ],
                    [
                      "Available",
                      listing.cookDetails.availableTimings?.join(", "),
                    ],
                    [
                      "Specializes in",
                      listing.cookDetails.specializations?.join(", "),
                    ],
                  ].map(
                    ([k, v]) =>
                      v && (
                        <div
                          key={k}
                          style={{
                            background: "var(--bg3)",
                            borderRadius: "var(--radius-sm)",
                            padding: "12px 14px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text3)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: 4,
                            }}
                          >
                            {k}
                          </div>
                          <div
                            style={{
                              fontWeight: 500,
                              textTransform: "capitalize",
                            }}
                          >
                            {v}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Reviews ──────────────────────────────────── */}
          <div className="detail-content" style={{ marginTop: 20 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                marginBottom: 20,
              }}
            >
              Reviews ({reviews.length})
            </h3>

            {reviews.map((r) => (
              <div key={r._id} className="review-item">
                <div className="review-header">
                  <div className="reviewer">
                    <div className="reviewer-avatar">
                      {r.user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>
                        {r.user.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text3)" }}>
                        {new Date(r.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="card-rating">
                    <span className="stars">{"★".repeat(r.rating)}</span>{" "}
                    {r.rating}/5
                  </div>
                </div>
                <div className="review-title">{r.title}</div>
                <div className="review-body">{r.body}</div>
              </div>
            ))}

            {/* Add review form */}
            <div className="add-review-form">
              <div style={{ fontWeight: 600, marginBottom: 12 }}>
                Write a Review
              </div>
              <div className="star-select">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className="star-btn"
                    onClick={() => setNewReview((r) => ({ ...r, rating: s }))}
                  >
                    <span
                      style={{
                        color:
                          s <= newReview.rating ? "#f0a030" : "var(--text3)",
                      }}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <input
                className="filter-input"
                style={{ width: "100%", marginBottom: 10 }}
                placeholder="Review title"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview((r) => ({ ...r, title: e.target.value }))
                }
              />
              <textarea
                className="filter-input"
                rows="3"
                style={{ width: "100%", resize: "vertical", marginBottom: 12 }}
                placeholder="Share your experience..."
                value={newReview.body}
                onChange={(e) =>
                  setNewReview((r) => ({ ...r, body: e.target.value }))
                }
              />
              <button
                className="btn-primary btn-full"
                onClick={handleAddReview}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : user
                    ? "Submit Review"
                    : "Login to Review"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ──────────────────────────────── */}
        <div>
          <div className="detail-sidebar">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                color: "var(--accent)",
                marginBottom: 4,
              }}
            >
              ₹{listing.price.amount.toLocaleString()}
            </div>
            <div
              style={{ color: "var(--text3)", fontSize: 14, marginBottom: 20 }}
            >
              per {listing.price.unit}
            </div>

            <button
              className="contact-btn btn-primary"
              style={{ background: typeColor, color: "#fff" }}
              onClick={() => {
                if (listing.owner?.phone) {
                  window.location.href = `tel:${listing.owner.phone}`;
                } else {
                  showToast("Owner phone not available", "error");
                }
              }}
            >
              📞 Contact Owner
            </button>
            <button
              className="contact-btn btn-outline"
              onClick={handleToggleSave}
            >
              {saved ? "❤️ Saved" : "🤍 Save Listing"}
            </button>
            <button className="contact-btn btn-outline">💬 Send Message</button>

            {/* Owner info */}
            <div
              style={{
                marginTop: 20,
                padding: "14px",
                background: "var(--bg3)",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 8,
                }}
              >
                Listed by
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="nav-avatar" style={{ width: 40, height: 40 }}>
                  {(listing.owner?.name || "O").charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>
                    {listing.owner?.name || "Owner"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    Member since 2023
                  </div>
                </div>
              </div>

              {/* Owner contact */}
              {listing.owner?.phone && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid var(--bg2)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text3)",
                      marginBottom: 6,
                    }}
                  >
                    📞 Phone
                  </div>
                  <a
                    href={`tel:${listing.owner.phone}`}
                    style={{
                      fontWeight: 600,
                      color: "var(--accent)",
                      textDecoration: "none",
                      fontSize: 15,
                    }}
                  >
                    {listing.owner.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Safety tips */}
            <div
              style={{
                marginTop: 20,
                padding: "14px",
                background: "rgba(74,158,127,0.08)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(74,158,127,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--pg)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                🛡️ Safety Tips
              </div>
              <div
                style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}
              >
                Always visit the property before paying. Never transfer money
                without signing an agreement.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
