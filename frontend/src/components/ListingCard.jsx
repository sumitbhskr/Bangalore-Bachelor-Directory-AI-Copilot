// src/components/ListingCard.js
import React from "react";
import { TYPE_ICONS } from "../data/mockData";

export default function ListingCard({ listing, onClick }) {
  const emoji = TYPE_ICONS[listing.type];

  return (
    <div className="card fade-in" onClick={() => onClick(listing)}>
      {/* Image / Emoji placeholder */}
      <div className="card-img">
        {listing.images && listing.images[0] ? (
          <img src={listing.images[0].url} alt={listing.title} loading="lazy" />
        ) : (
          <span>{emoji}</span>
        )}
      </div>

      {/* Body */}
      <div className="card-body">
        <div className={`card-type type-${listing.type}`}>
          {emoji} {listing.type.toUpperCase()}
        </div>

        <div className="card-title">{listing.title}</div>

        <div className="card-area">
          📍 {listing.address.area}, {listing.address.city}
        </div>

        <div className="card-footer">
          <div className="card-price">
            ₹{listing.price.amount.toLocaleString()}
            <span>/{listing.price.unit}</span>
          </div>

          <div className="card-rating">
            <span className="stars">
              {"★".repeat(Math.round(listing.rating))}
              {"☆".repeat(5 - Math.round(listing.rating))}
            </span>
            {listing.rating.toFixed(1)} ({listing.reviewCount})
            {listing.isVerified && (
              <span
                style={{ color: "#4a9e7f", fontSize: 11 }}
                title="Verified listing"
              >
                {" "}
                ✓
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
