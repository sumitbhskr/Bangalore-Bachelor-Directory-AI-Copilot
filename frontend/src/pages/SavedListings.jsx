// // src/pages/SavedListings.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// const typeColors = {
//   pg: "#6366f1",
//   tiffin: "#22c55e",
//   cook: "#f59e0b",
//   default: "#6b7280",
// };

// const typeLabels = {
//   pg: "PG / Hostel",
//   tiffin: "Tiffin Service",
//   cook: "Cook",
// };

// export default function SavedListings() {
//   const [saved, setSaved] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [removing, setRemoving] = useState(null);
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchSaved();
//   }, []);

//   async function fetchSaved() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API}/users/saved`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSaved(res.data.data || []);
//     } catch {
//       setError("Failed to load saved listings.");
//     }
//     setLoading(false);
//   }

//   async function handleRemove(id) {
//     setRemoving(id);
//     try {
//       await axios.delete(`${API}/users/saved/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSaved((prev) => prev.filter((item) => item._id !== id));
//     } catch {
//       setError("Could not remove. Try again.");
//     }
//     setRemoving(null);
//   }

//   const types = ["all", ...new Set(saved.map((s) => s.type).filter(Boolean))];
//   const filtered =
//     filter === "all" ? saved : saved.filter((s) => s.type === filter);

//   const cardStyle = {
//     background: "var(--bg2)",
//     border: "1px solid var(--border)",
//     borderRadius: "var(--radius)",
//     overflow: "hidden",
//     display: "flex",
//     flexDirection: "column",
//     transition: "transform 0.2s, box-shadow 0.2s",
//   };

//   if (loading) {
//     return (
//       <div
//         className="container"
//         style={{ paddingTop: 60, textAlign: "center" }}
//       >
//         <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
//         <p style={{ color: "var(--text2)" }}>Loading saved listings...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
//       {/* Header */}
//       <div style={{ marginBottom: 24 }}>
//         <h2
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: 28,
//             marginBottom: 4,
//           }}
//         >
//           Saved Listings
//           {saved.length > 0 && (
//             <span
//               style={{
//                 fontSize: 14,
//                 fontWeight: 600,
//                 color: "var(--text2)",
//                 marginLeft: 10,
//               }}
//             >
//               ({saved.length})
//             </span>
//           )}
//         </h2>
//         <p style={{ color: "var(--text2)", fontSize: 14 }}>
//           Your bookmarked PGs, tiffin services & cooks
//         </p>
//       </div>

//       {error && (
//         <div
//           style={{
//             background: "#ef444420",
//             border: "1px solid #ef4444",
//             color: "#ef4444",
//             padding: "10px 16px",
//             borderRadius: 8,
//             marginBottom: 16,
//             fontSize: 13,
//           }}
//         >
//           {error}
//         </div>
//       )}

//       {saved.length === 0 ? (
//         /* Empty state */
//         <div
//           style={{
//             textAlign: "center",
//             padding: "80px 20px",
//             background: "var(--bg2)",
//             border: "1px solid var(--border)",
//             borderRadius: "var(--radius)",
//           }}
//         >
//           <div style={{ fontSize: 56, marginBottom: 16 }}>🔖</div>
//           <h3
//             style={{
//               fontFamily: "var(--font-display)",
//               fontSize: 22,
//               marginBottom: 8,
//             }}
//           >
//             No Saved Listings Yet
//           </h3>
//           <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>
//             Tap the bookmark icon on any listing to save it here
//           </p>
//           <Link
//             to="/"
//             style={{
//               display: "inline-block",
//               padding: "12px 28px",
//               background: "var(--accent)",
//               color: "#0f0f0f",
//               borderRadius: "var(--radius)",
//               textDecoration: "none",
//               fontWeight: 700,
//               fontSize: 14,
//             }}
//           >
//             Explore Listings →
//           </Link>
//         </div>
//       ) : (
//         <>
//           {/* Filter Tabs */}
//           {types.length > 1 && (
//             <div
//               style={{
//                 display: "flex",
//                 gap: 8,
//                 marginBottom: 24,
//                 flexWrap: "wrap",
//               }}
//             >
//               {types.map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => setFilter(t)}
//                   style={{
//                     padding: "7px 16px",
//                     borderRadius: 999,
//                     border: `1px solid ${filter === t ? "var(--accent)" : "var(--border)"}`,
//                     background: filter === t ? "var(--accent)" : "transparent",
//                     color: filter === t ? "#0f0f0f" : "var(--text2)",
//                     cursor: "pointer",
//                     fontSize: 13,
//                     fontWeight: 600,
//                     transition: "all 0.2s",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   {t === "all" ? "All" : typeLabels[t] || t}
//                   <span
//                     style={{
//                       marginLeft: 6,
//                       background: filter === t ? "#0f0f0f30" : "var(--border)",
//                       padding: "1px 7px",
//                       borderRadius: 999,
//                       fontSize: 11,
//                     }}
//                   >
//                     {t === "all"
//                       ? saved.length
//                       : saved.filter((s) => s.type === t).length}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Grid */}
//           {filtered.length === 0 ? (
//             <p
//               style={{
//                 color: "var(--text2)",
//                 textAlign: "center",
//                 marginTop: 40,
//               }}
//             >
//               No {filter} listings saved.
//             </p>
//           ) : (
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//                 gap: 20,
//               }}
//             >
//               {filtered.map((item) => {
//                 const color = typeColors[item.type] || typeColors.default;
//                 const image = item.images?.[0];

//                 return (
//                   <div key={item._id} style={cardStyle}>
//                     {/* Image */}
//                     <div
//                       style={{
//                         height: 180,
//                         background: image ? "none" : `${color}18`,
//                         position: "relative",
//                         overflow: "hidden",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {image ? (
//                         <img
//                           src={image}
//                           alt={item.title}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       ) : (
//                         <span style={{ fontSize: 48 }}>
//                           {item.type === "pg"
//                             ? "🏠"
//                             : item.type === "tiffin"
//                               ? "🍱"
//                               : "👨‍🍳"}
//                         </span>
//                       )}

//                       {/* Type badge */}
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: 10,
//                           left: 10,
//                           background: color,
//                           color: "#fff",
//                           fontSize: 11,
//                           fontWeight: 700,
//                           padding: "3px 10px",
//                           borderRadius: 999,
//                         }}
//                       >
//                         {typeLabels[item.type] || item.type}
//                       </div>

//                       {/* Remove button */}
//                       <button
//                         onClick={() => handleRemove(item._id)}
//                         disabled={removing === item._id}
//                         title="Remove from saved"
//                         style={{
//                           position: "absolute",
//                           top: 10,
//                           right: 10,
//                           background: "#0f0f0fcc",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: 999,
//                           width: 30,
//                           height: 30,
//                           cursor: "pointer",
//                           fontSize: 14,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         {removing === item._id ? "..." : "🗑"}
//                       </button>
//                     </div>

//                     {/* Info */}
//                     <div
//                       style={{
//                         padding: "14px 16px",
//                         flex: 1,
//                         display: "flex",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <h4
//                         style={{
//                           fontSize: 15,
//                           fontWeight: 700,
//                           marginBottom: 4,
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {item.title}
//                       </h4>

//                       {item.location?.area && (
//                         <p
//                           style={{
//                             fontSize: 12,
//                             color: "var(--text2)",
//                             marginBottom: 6,
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 4,
//                           }}
//                         >
//                           📍 {item.location.area},{" "}
//                           {item.location.city || "Bangalore"}
//                         </p>
//                       )}

//                       {item.price && (
//                         <p
//                           style={{
//                             fontSize: 16,
//                             fontWeight: 800,
//                             color: color,
//                             marginBottom: 8,
//                           }}
//                         >
//                           ₹{item.price.toLocaleString()}
//                           <span
//                             style={{
//                               fontSize: 12,
//                               fontWeight: 500,
//                               color: "var(--text2)",
//                             }}
//                           >
//                             {item.type === "pg" ? "/mo" : "/mo"}
//                           </span>
//                         </p>
//                       )}

//                       {item.rating && (
//                         <p
//                           style={{
//                             fontSize: 13,
//                             color: "var(--text2)",
//                             marginBottom: 12,
//                           }}
//                         >
//                           ⭐ {item.rating.toFixed(1)}
//                           {item.reviewCount
//                             ? ` (${item.reviewCount} reviews)`
//                             : ""}
//                         </p>
//                       )}

//                       {/* Actions */}
//                       <div
//                         style={{ display: "flex", gap: 8, marginTop: "auto" }}
//                       >
//                         <Link
//                           to={`/${item.type}s/${item._id}`}
//                           style={{
//                             flex: 1,
//                             padding: "9px",
//                             background: "var(--accent)",
//                             color: "#0f0f0f",
//                             borderRadius: 8,
//                             textDecoration: "none",
//                             textAlign: "center",
//                             fontSize: 13,
//                             fontWeight: 700,
//                           }}
//                         >
//                           View Details
//                         </Link>
//                         <button
//                           onClick={() => handleRemove(item._id)}
//                           disabled={removing === item._id}
//                           style={{
//                             padding: "9px 12px",
//                             background: "transparent",
//                             border: "1px solid var(--border)",
//                             borderRadius: 8,
//                             cursor: "pointer",
//                             fontSize: 13,
//                             color: "var(--text2)",
//                           }}
//                         >
//                           {removing === item._id ? "..." : "Remove"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

////
// src/pages/SavedListings.jsx
import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import ListingCard from "../components/ListingCard";

export default function SavedListings() {
  const { token, user, navigate, setShowAuth } = useApp();
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setShowAuth("login");
      return;
    }
    fetchSaved();
  }, [token]);

  const fetchSaved = async () => {
    setLoading(true);
    const data = await api.get("/auth/me", token).catch(() => ({}));
    if (data.success) setSaved(data.user.savedListings || []);
    else setError("Failed to load saved listings.");
    setLoading(false);
  };

  const handleRemove = async (id) => {
    setRemoving(id);
    const data = await api
      .put(`/listings/${id}/save`, {}, token)
      .catch(() => ({}));
    if (data.success)
      setSaved((prev) => prev.filter((item) => (item._id || item) !== id));
    else setError("Could not remove. Try again.");
    setRemoving(null);
  };

  const types = ["all", ...new Set(saved.map((s) => s.type).filter(Boolean))];
  const filtered =
    filter === "all" ? saved : saved.filter((s) => s.type === filter);

  if (loading)
    return (
      <div
        className="container"
        style={{ paddingTop: 60, textAlign: "center" }}
      >
        <div className="spinner" />
        <p style={{ color: "var(--text2)", marginTop: 16 }}>
          Loading saved listings...
        </p>
      </div>
    );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            marginBottom: 4,
          }}
        >
          Saved Listings{" "}
          {saved.length > 0 && (
            <span
              style={{ fontSize: 14, color: "var(--text2)", marginLeft: 8 }}
            >
              ({saved.length})
            </span>
          )}
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>
          Your bookmarked PGs, tiffin services & cooks
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "#ef444420",
            border: "1px solid #ef4444",
            color: "#ef4444",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {saved.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔖</div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            No Saved Listings Yet
          </h3>
          <p style={{ color: "var(--text2)", marginBottom: 24, fontSize: 14 }}>
            Tap the bookmark icon on any listing to save it here
          </p>
          <button
            onClick={() => navigate("browse")}
            style={{
              padding: "12px 28px",
              background: "var(--accent)",
              color: "#0f0f0f",
              borderRadius: "var(--radius)",
              border: "none",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Explore Listings →
          </button>
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          {types.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 24,
                flexWrap: "wrap",
              }}
            >
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 999,
                    border: `1px solid ${filter === t ? "var(--accent)" : "var(--border)"}`,
                    background: filter === t ? "var(--accent)" : "transparent",
                    color: filter === t ? "#0f0f0f" : "var(--text2)",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}
                >
                  {t === "all" ? "All" : t}
                </button>
              ))}
            </div>
          )}

          <div className="grid">
            {filtered.map((item) => (
              <div key={item._id} style={{ position: "relative" }}>
                <ListingCard
                  listing={item}
                  onClick={(l) => navigate("detail", l)}
                />
                <button
                  onClick={() => handleRemove(item._id)}
                  disabled={removing === item._id}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "#0f0f0fcc",
                    color: "#fff",
                    border: "none",
                    borderRadius: 999,
                    width: 30,
                    height: 30,
                    cursor: "pointer",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {removing === item._id ? "..." : "🗑"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
