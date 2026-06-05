// src/pages/BrowsePage.js
import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../context/AppContext";
import ListingCard from "../components/ListingCard";
import api from "../services/api";
import { MOCK_LISTINGS, AREAS, TYPE_ICONS } from "../data/mockData";

export default function BrowsePage({ initialFilters }) {
  const { navigate } = useApp();
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(MOCK_LISTINGS.length);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: initialFilters?.type || "",
    area: initialFilters?.area || "",
    search: initialFilters?.search || "",
    minPrice: "",
    maxPrice: "",
    gender: "",
    diet: "",
    sort: "newest",
    page: 1,
  });

  // ── Apply filters (calls backend, falls back to mock) ────
  const applyFilters = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    api
      .get(`/listings?${params.toString()}`)
      .then((data) => {
        if (data.success) {
          setListings(data.listings);
          setTotalPages(data.pages);
          setTotal(data.total);
        } else {
          applyMockFilters();
        }
      })
      .catch(() => applyMockFilters())
      .finally(() => setLoading(false));
  }, [filters]); // eslint-disable-line

  const applyMockFilters = () => {
    let filtered = MOCK_LISTINGS;
    if (filters.type)
      filtered = filtered.filter((l) => l.type === filters.type);
    if (filters.search)
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          l.address.area.toLowerCase().includes(filters.search.toLowerCase()),
      );
    if (filters.area)
      filtered = filtered.filter((l) =>
        l.address.area.toLowerCase().includes(filters.area.toLowerCase()),
      );
    if (filters.minPrice)
      filtered = filtered.filter((l) => l.price.amount >= +filters.minPrice);
    if (filters.maxPrice)
      filtered = filtered.filter((l) => l.price.amount <= +filters.maxPrice);
    if (filters.gender)
      filtered = filtered.filter((l) => l.pgDetails?.gender === filters.gender);
    if (filters.diet)
      filtered = filtered.filter(
        (l) => l.tiffinDetails?.dietType === filters.diet,
      );
    setListings(filtered);
    setTotal(filtered.length);
    setLoading(false);
  };

  useEffect(() => {
    applyFilters();
  }, [filters.type, filters.sort, filters.page]); // eslint-disable-line

  const setFilter = (key, val) =>
    setFilters((f) => ({ ...f, [key]: val, page: 1 }));

  const resetFilters = () =>
    setFilters({
      type: "",
      area: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      gender: "",
      diet: "",
      sort: "newest",
      page: 1,
    });

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            marginBottom: 4,
          }}
        >
          Browse Listings
        </h2>
        <div style={{ color: "var(--text2)", fontSize: 14 }}>
          {total} listings found
        </div>
      </div>

      {/* Type pills */}
      <div
        className="type-pills"
        style={{ justifyContent: "flex-start", marginBottom: 20 }}
      >
        {["", "pg", "tiffin", "cook"].map((t) => (
          <button
            key={t}
            className={`pill ${t} ${filters.type === t ? "active" : ""}`}
            onClick={() => setFilter("type", t)}
          >
            {!t
              ? "🔍 All"
              : `${TYPE_ICONS[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}`}
          </button>
        ))}
      </div>

      <div className="browse-layout">
        {/* ── Sidebar Filters ─────────────────────────────── */}
        <aside className="filters">
          <div className="filter-title">Filters</div>

          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">Search</label>
            <input
              className="filter-input"
              placeholder="Name, area..."
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>

          {/* Area */}
          <div className="filter-group">
            <label className="filter-label">Area</label>
            <select
              className="filter-input"
              value={filters.area}
              onChange={(e) => setFilter("area", e.target.value)}
            >
              <option value="">All Areas</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="filter-group">
            <label className="filter-label">Price Range (₹/month)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="filter-input"
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilter("minPrice", e.target.value)}
              />
              <input
                className="filter-input"
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilter("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select
              className="filter-input"
              value={filters.sort}
              onChange={(e) => setFilter("sort", e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* PG gender filter */}
          {(!filters.type || filters.type === "pg") && (
            <div className="filter-group">
              <label className="filter-label">PG Gender</label>
              {["", "male", "female", "co-ed"].map((g) => (
                <label key={g} className="filter-check">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === g}
                    onChange={() => setFilter("gender", g)}
                  />
                  {!g ? "All" : g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          )}

          {/* Tiffin diet filter */}
          {(!filters.type || filters.type === "tiffin") && (
            <div className="filter-group">
              <label className="filter-label">Diet Type</label>
              {["", "veg", "non-veg", "both"].map((d) => (
                <label key={d} className="filter-check">
                  <input
                    type="radio"
                    name="diet"
                    checked={filters.diet === d}
                    onChange={() => setFilter("diet", d)}
                  />
                  {!d ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                </label>
              ))}
            </div>
          )}

          <button className="filter-btn" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="filter-reset" onClick={resetFilters}>
            Reset All
          </button>
        </aside>

        {/* ── Listings grid ───────────────────────────────── */}
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div className="spinner" />
            </div>
          ) : listings.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <h3>No listings found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid">
                {listings.map((l) => (
                  <ListingCard
                    key={l._id}
                    listing={l}
                    onClick={(listing) => navigate("detail", listing)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={filters.page <= 1}
                    onClick={() => setFilter("page", filters.page - 1)}
                  >
                    ‹
                  </button>
                  {Array.from(
                    { length: Math.min(totalPages, 7) },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${filters.page === p ? "active" : ""}`}
                      onClick={() => setFilter("page", p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={filters.page >= totalPages}
                    onClick={() => setFilter("page", filters.page + 1)}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
