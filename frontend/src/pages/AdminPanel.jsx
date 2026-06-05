// // src/pages/AdminPanel.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// const tabs = ["Dashboard", "Users", "Listings", "Verifications", "Payments"];

// export default function AdminPanel() {
//   const [activeTab, setActiveTab] = useState("Dashboard");
//   const [stats, setStats] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [listings, setListings] = useState([]);
//   const [verifications, setVerifications] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const token = localStorage.getItem("token");
//   const headers = { Authorization: `Bearer ${token}` };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   useEffect(() => {
//     if (activeTab === "Users") fetchUsers();
//     if (activeTab === "Listings") fetchListings();
//     if (activeTab === "Verifications") fetchVerifications();
//     if (activeTab === "Payments") fetchPayments();
//   }, [activeTab]);

//   async function fetchStats() {
//     try {
//       const res = await axios.get(`${API}/admin/stats`, { headers });
//       setStats(res.data.data);
//     } catch {
//       setStats({
//         totalUsers: 0,
//         totalListings: 0,
//         pendingVerifications: 0,
//         totalRevenue: 0,
//         activeListings: 0,
//         newUsersToday: 0,
//       });
//     }
//   }

//   async function fetchUsers() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API}/admin/users`, { headers });
//       setUsers(res.data.data || []);
//     } catch {
//       setUsers([]);
//     }
//     setLoading(false);
//   }

//   async function fetchListings() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API}/admin/listings`, { headers });
//       setListings(res.data.data || []);
//     } catch {
//       setListings([]);
//     }
//     setLoading(false);
//   }

//   async function fetchVerifications() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API}/admin/verifications`, { headers });
//       setVerifications(res.data.data || []);
//     } catch {
//       setVerifications([]);
//     }
//     setLoading(false);
//   }

//   async function fetchPayments() {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API}/admin/payments`, { headers });
//       setPayments(res.data.data || []);
//     } catch {
//       setPayments([]);
//     }
//     setLoading(false);
//   }

//   async function handleVerification(id, status) {
//     try {
//       await axios.put(
//         `${API}/admin/verifications/${id}`,
//         { status },
//         { headers },
//       );
//       setMsg(`Verification ${status} successfully`);
//       fetchVerifications();
//       fetchStats();
//       setTimeout(() => setMsg(""), 3000);
//     } catch {
//       setMsg("Action failed");
//     }
//   }

//   async function handleToggleUser(id, isActive) {
//     try {
//       await axios.put(
//         `${API}/admin/users/${id}/toggle`,
//         { isActive: !isActive },
//         { headers },
//       );
//       fetchUsers();
//     } catch {
//       setMsg("Failed to update user");
//     }
//   }

//   async function handleDeleteListing(id) {
//     if (!window.confirm("Delete this listing?")) return;
//     try {
//       await axios.delete(`${API}/admin/listings/${id}`, { headers });
//       fetchListings();
//     } catch {
//       setMsg("Delete failed");
//     }
//   }

//   const cardStyle = {
//     background: "var(--bg2)",
//     border: "1px solid var(--border)",
//     borderRadius: "var(--radius)",
//     padding: "20px 24px",
//   };

//   const badgeStyle = (color) => ({
//     background: color,
//     color: "#fff",
//     fontSize: 11,
//     padding: "2px 8px",
//     borderRadius: 999,
//     fontWeight: 600,
//   });

//   const btnStyle = (variant = "primary") => ({
//     padding: "6px 14px",
//     borderRadius: 8,
//     border: "none",
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: 600,
//     background:
//       variant === "primary"
//         ? "var(--accent)"
//         : variant === "danger"
//           ? "#ef4444"
//           : "#6b7280",
//     color: variant === "primary" ? "#0f0f0f" : "#fff",
//   });

//   return (
//     <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
//       {/* Header */}
//       <div style={{ marginBottom: 24 }}>
//         <h2
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: 28,
//             marginBottom: 4,
//           }}
//         >
//           Admin Panel
//         </h2>
//         <p style={{ color: "var(--text2)", fontSize: 14 }}>
//           Manage users, listings, verifications & payments
//         </p>
//       </div>

//       {msg && (
//         <div
//           style={{
//             background: "#22c55e20",
//             border: "1px solid #22c55e",
//             color: "#22c55e",
//             padding: "10px 16px",
//             borderRadius: 8,
//             marginBottom: 16,
//           }}
//         >
//           {msg}
//         </div>
//       )}

//       {/* Tabs */}
//       <div
//         style={{
//           display: "flex",
//           gap: 4,
//           marginBottom: 24,
//           background: "var(--bg2)",
//           border: "1px solid var(--border)",
//           borderRadius: "var(--radius)",
//           padding: 4,
//           width: "fit-content",
//         }}
//       >
//         {tabs.map((t) => (
//           <button
//             key={t}
//             onClick={() => setActiveTab(t)}
//             style={{
//               padding: "8px 18px",
//               borderRadius: 8,
//               border: "none",
//               cursor: "pointer",
//               fontSize: 14,
//               fontWeight: 600,
//               background: activeTab === t ? "var(--accent)" : "transparent",
//               color: activeTab === t ? "#0f0f0f" : "var(--text2)",
//               transition: "all 0.2s",
//             }}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* ── DASHBOARD ── */}
//       {activeTab === "Dashboard" && stats && (
//         <div>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//               gap: 16,
//               marginBottom: 32,
//             }}
//           >
//             {[
//               {
//                 label: "Total Users",
//                 value: stats.totalUsers,
//                 color: "#6366f1",
//               },
//               {
//                 label: "Total Listings",
//                 value: stats.totalListings,
//                 color: "#22c55e",
//               },
//               {
//                 label: "Pending Verifications",
//                 value: stats.pendingVerifications,
//                 color: "#f59e0b",
//               },
//               {
//                 label: "Active Listings",
//                 value: stats.activeListings,
//                 color: "#3b82f6",
//               },
//               {
//                 label: "New Users Today",
//                 value: stats.newUsersToday,
//                 color: "#ec4899",
//               },
//               {
//                 label: "Total Revenue",
//                 value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
//                 color: "#10b981",
//               },
//             ].map((s) => (
//               <div key={s.label} style={{ ...cardStyle, textAlign: "center" }}>
//                 <div
//                   style={{
//                     fontSize: 32,
//                     fontWeight: 800,
//                     color: s.color,
//                     fontFamily: "var(--font-display)",
//                   }}
//                 >
//                   {s.value}
//                 </div>
//                 <div
//                   style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}
//                 >
//                   {s.label}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div style={cardStyle}>
//             <h3 style={{ marginBottom: 12, fontSize: 16, fontWeight: 700 }}>
//               Quick Actions
//             </h3>
//             <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
//               <button
//                 style={btnStyle()}
//                 onClick={() => setActiveTab("Verifications")}
//               >
//                 Review Verifications ({stats.pendingVerifications})
//               </button>
//               <button
//                 style={btnStyle("secondary")}
//                 onClick={() => setActiveTab("Users")}
//               >
//                 Manage Users
//               </button>
//               <button
//                 style={btnStyle("secondary")}
//                 onClick={() => setActiveTab("Listings")}
//               >
//                 View Listings
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── USERS ── */}
//       {activeTab === "Users" && (
//         <div style={cardStyle}>
//           <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
//             All Users
//           </h3>
//           {loading ? (
//             <p style={{ color: "var(--text2)" }}>Loading...</p>
//           ) : users.length === 0 ? (
//             <p style={{ color: "var(--text2)" }}>No users found.</p>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: 14,
//                 }}
//               >
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid var(--border)" }}>
//                     {[
//                       "Name",
//                       "Email",
//                       "Role",
//                       "Status",
//                       "Joined",
//                       "Action",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           textAlign: "left",
//                           padding: "8px 12px",
//                           color: "var(--text2)",
//                           fontSize: 12,
//                           fontWeight: 600,
//                           textTransform: "uppercase",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((u) => (
//                     <tr
//                       key={u._id}
//                       style={{ borderBottom: "1px solid var(--border)" }}
//                     >
//                       <td style={{ padding: "10px 12px", fontWeight: 600 }}>
//                         {u.name}
//                       </td>
//                       <td
//                         style={{ padding: "10px 12px", color: "var(--text2)" }}
//                       >
//                         {u.email}
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <span
//                           style={badgeStyle(
//                             u.role === "admin"
//                               ? "#6366f1"
//                               : u.role === "provider"
//                                 ? "#3b82f6"
//                                 : "#6b7280",
//                           )}
//                         >
//                           {u.role}
//                         </span>
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <span
//                           style={badgeStyle(
//                             u.isActive !== false ? "#22c55e" : "#ef4444",
//                           )}
//                         >
//                           {u.isActive !== false ? "Active" : "Blocked"}
//                         </span>
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px 12px",
//                           color: "var(--text2)",
//                           fontSize: 12,
//                         }}
//                       >
//                         {new Date(u.createdAt).toLocaleDateString("en-IN")}
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <button
//                           style={btnStyle(
//                             u.isActive !== false ? "danger" : "secondary",
//                           )}
//                           onClick={() =>
//                             handleToggleUser(u._id, u.isActive !== false)
//                           }
//                         >
//                           {u.isActive !== false ? "Block" : "Unblock"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── LISTINGS ── */}
//       {activeTab === "Listings" && (
//         <div style={cardStyle}>
//           <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
//             All Listings
//           </h3>
//           {loading ? (
//             <p style={{ color: "var(--text2)" }}>Loading...</p>
//           ) : listings.length === 0 ? (
//             <p style={{ color: "var(--text2)" }}>No listings found.</p>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: 14,
//                 }}
//               >
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid var(--border)" }}>
//                     {[
//                       "Title",
//                       "Type",
//                       "Owner",
//                       "Price",
//                       "Status",
//                       "Action",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           textAlign: "left",
//                           padding: "8px 12px",
//                           color: "var(--text2)",
//                           fontSize: 12,
//                           fontWeight: 600,
//                           textTransform: "uppercase",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {listings.map((l) => (
//                     <tr
//                       key={l._id}
//                       style={{ borderBottom: "1px solid var(--border)" }}
//                     >
//                       <td
//                         style={{
//                           padding: "10px 12px",
//                           fontWeight: 600,
//                           maxWidth: 200,
//                         }}
//                       >
//                         {l.title}
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <span style={badgeStyle("#6366f1")}>{l.type}</span>
//                       </td>
//                       <td
//                         style={{ padding: "10px 12px", color: "var(--text2)" }}
//                       >
//                         {l.owner?.name || "—"}
//                       </td>
//                       <td style={{ padding: "10px 12px", fontWeight: 600 }}>
//                         ₹{l.price?.toLocaleString()}
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <span
//                           style={badgeStyle(l.isActive ? "#22c55e" : "#ef4444")}
//                         >
//                           {l.isActive ? "Active" : "Inactive"}
//                         </span>
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <button
//                           style={btnStyle("danger")}
//                           onClick={() => handleDeleteListing(l._id)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── VERIFICATIONS ── */}
//       {activeTab === "Verifications" && (
//         <div>
//           <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
//             Pending Verifications
//           </h3>
//           {loading ? (
//             <p style={{ color: "var(--text2)" }}>Loading...</p>
//           ) : verifications.length === 0 ? (
//             <div style={{ ...cardStyle, textAlign: "center", padding: 40 }}>
//               <p style={{ color: "var(--text2)" }}>
//                 No pending verifications 🎉
//               </p>
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//               {verifications.map((v) => (
//                 <div key={v._id} style={cardStyle}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       flexWrap: "wrap",
//                       gap: 12,
//                     }}
//                   >
//                     <div>
//                       <p style={{ fontWeight: 700, marginBottom: 4 }}>
//                         {v.user?.name || "Unknown User"}
//                       </p>
//                       <p
//                         style={{
//                           fontSize: 13,
//                           color: "var(--text2)",
//                           marginBottom: 4,
//                         }}
//                       >
//                         {v.user?.email} · {v.type}
//                       </p>
//                       <p style={{ fontSize: 12, color: "var(--text2)" }}>
//                         Submitted:{" "}
//                         {new Date(v.createdAt).toLocaleDateString("en-IN")}
//                       </p>
//                       {v.documents?.length > 0 && (
//                         <div
//                           style={{
//                             marginTop: 10,
//                             display: "flex",
//                             gap: 8,
//                             flexWrap: "wrap",
//                           }}
//                         >
//                           {v.documents.map((doc, i) => (
//                             <a
//                               key={i}
//                               href={doc}
//                               target="_blank"
//                               rel="noreferrer"
//                               style={{
//                                 fontSize: 12,
//                                 color: "var(--accent)",
//                                 textDecoration: "none",
//                                 border: "1px solid var(--accent)",
//                                 padding: "3px 10px",
//                                 borderRadius: 6,
//                               }}
//                             >
//                               Doc {i + 1} ↗
//                             </a>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <div style={{ display: "flex", gap: 10 }}>
//                       <button
//                         style={btnStyle()}
//                         onClick={() => handleVerification(v._id, "approved")}
//                       >
//                         ✓ Approve
//                       </button>
//                       <button
//                         style={btnStyle("danger")}
//                         onClick={() => handleVerification(v._id, "rejected")}
//                       >
//                         ✕ Reject
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── PAYMENTS ── */}
//       {activeTab === "Payments" && (
//         <div style={cardStyle}>
//           <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
//             Payment History
//           </h3>
//           {loading ? (
//             <p style={{ color: "var(--text2)" }}>Loading...</p>
//           ) : payments.length === 0 ? (
//             <p style={{ color: "var(--text2)" }}>No payments found.</p>
//           ) : (
//             <div style={{ overflowX: "auto" }}>
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   fontSize: 14,
//                 }}
//               >
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid var(--border)" }}>
//                     {[
//                       "User",
//                       "Plan",
//                       "Amount",
//                       "Status",
//                       "Date",
//                       "Order ID",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         style={{
//                           textAlign: "left",
//                           padding: "8px 12px",
//                           color: "var(--text2)",
//                           fontSize: 12,
//                           fontWeight: 600,
//                           textTransform: "uppercase",
//                         }}
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {payments.map((p) => (
//                     <tr
//                       key={p._id}
//                       style={{ borderBottom: "1px solid var(--border)" }}
//                     >
//                       <td style={{ padding: "10px 12px", fontWeight: 600 }}>
//                         {p.user?.name || "—"}
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <span style={badgeStyle("#6366f1")}>{p.plan}</span>
//                       </td>
//                       <td style={{ padding: "10px 12px", fontWeight: 700 }}>
//                         ₹{p.amount?.toLocaleString()}
//                       </td>
//                       <td style={{ padding: "10px 12px" }}>
//                         <span
//                           style={badgeStyle(
//                             p.status === "captured"
//                               ? "#22c55e"
//                               : p.status === "failed"
//                                 ? "#ef4444"
//                                 : "#f59e0b",
//                           )}
//                         >
//                           {p.status}
//                         </span>
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px 12px",
//                           color: "var(--text2)",
//                           fontSize: 12,
//                         }}
//                       >
//                         {new Date(p.createdAt).toLocaleDateString("en-IN")}
//                       </td>
//                       <td
//                         style={{
//                           padding: "10px 12px",
//                           color: "var(--text2)",
//                           fontSize: 11,
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         {p.orderId || "—"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

/////

// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useApp } from "../context/AppContext";

const tabs = ["Dashboard", "Users", "Listings", "Verifications", "Payments"];

export default function AdminPanel() {
  const { token } = useApp();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const stats = {
    totalUsers: users.length,
    totalListings: listings.length,
    pendingVerifications: verifications.filter((v) => v.status === "pending")
      .length,
    activeListings: listings.filter((l) => l.isActive).length,
    totalRevenue: payments
      .filter((p) => p.status === "paid")
      .reduce((s, p) => s + p.amount / 100, 0),
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [u, l, v, p] = await Promise.all([
      api.get("/users", token).catch(() => ({ users: [] })),
      api.get("/listings?limit=100", token).catch(() => ({ listings: [] })),
      api
        .get("/verification/pending", token)
        .catch(() => ({ verifications: [] })),
      api.get("/payments/my", token).catch(() => ({ payments: [] })),
    ]);
    setUsers(u.users || []);
    setListings(l.listings || []);
    setVerifications(v.verifications || []);
    setPayments(p.payments || []);
    setLoading(false);
  };

  const handleVerification = async (id, status) => {
    const data = await api
      .put(`/verification/${id}/review`, { status }, token)
      .catch(() => ({}));
    if (data.success) {
      setMsg(`Verification ${status}!`);
      fetchAll();
      setTimeout(() => setMsg(""), 3000);
    } else setMsg("Action failed");
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    const data = await api.delete(`/listings/${id}`, token).catch(() => ({}));
    if (data.success) setListings((l) => l.filter((x) => x._id !== id));
    else setMsg("Delete failed");
  };

  const handleToggleUser = async (id, isActive) => {
    await api.put(`/users/${id}/deactivate`, {}, token).catch(() => {});
    fetchAll();
  };

  const cardStyle = {
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px 24px",
  };
  const badge = (color) => ({
    background: color,
    color: "#fff",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 999,
    fontWeight: 600,
  });
  const btn = (v = "primary") => ({
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    background:
      v === "primary"
        ? "var(--accent)"
        : v === "danger"
          ? "#ef4444"
          : "#6b7280",
    color: v === "primary" ? "#0f0f0f" : "#fff",
  });

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            marginBottom: 4,
          }}
        >
          Admin Panel
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>
          Manage users, listings, verifications & payments
        </p>
      </div>

      {msg && (
        <div
          style={{
            background: "#22c55e20",
            border: "1px solid #22c55e",
            color: "#22c55e",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 4,
          width: "fit-content",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              background: activeTab === t ? "var(--accent)" : "transparent",
              color: activeTab === t ? "#0f0f0f" : "var(--text2)",
              transition: "all 0.2s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div className="spinner" />
        </div>
      )}

      {/* Dashboard */}
      {activeTab === "Dashboard" && !loading && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                color: "#6366f1",
              },
              {
                label: "Total Listings",
                value: stats.totalListings,
                color: "#22c55e",
              },
              {
                label: "Pending Verifications",
                value: stats.pendingVerifications,
                color: "#f59e0b",
              },
              {
                label: "Active Listings",
                value: stats.activeListings,
                color: "#3b82f6",
              },
              {
                label: "Total Revenue",
                value: `₹${stats.totalRevenue.toLocaleString()}`,
                color: "#10b981",
              },
            ].map((s) => (
              <div key={s.label} style={{ ...cardStyle, textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: s.color,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === "Users" && !loading && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
            All Users ({users.length})
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Name", "Email", "Role", "Status", "Joined", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          color: "var(--text2)",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                      {u.name}
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--text2)" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={badge(
                          u.role === "admin"
                            ? "#6366f1"
                            : u.role === "owner"
                              ? "#3b82f6"
                              : "#6b7280",
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={badge(u.isActive ? "#22c55e" : "#ef4444")}>
                        {u.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        color: "var(--text2)",
                        fontSize: 12,
                      }}
                    >
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button
                        style={btn("danger")}
                        onClick={() => handleToggleUser(u._id, u.isActive)}
                      >
                        {u.isActive ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Listings */}
      {activeTab === "Listings" && !loading && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
            All Listings ({listings.length})
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Title", "Type", "Area", "Price", "Status", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "8px 12px",
                          color: "var(--text2)",
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr
                    key={l._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      style={{
                        padding: "10px 12px",
                        fontWeight: 600,
                        maxWidth: 200,
                      }}
                    >
                      {l.title}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={badge("#6366f1")}>{l.type}</span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--text2)" }}>
                      {l.address?.area}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                      ₹{l.price?.amount?.toLocaleString()}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={badge(l.isActive ? "#22c55e" : "#ef4444")}>
                        {l.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <button
                        style={btn("danger")}
                        onClick={() => handleDeleteListing(l._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Verifications */}
      {activeTab === "Verifications" && !loading && (
        <div>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
            Pending Verifications ({verifications.length})
          </h3>
          {verifications.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: "center", padding: 40 }}>
              <p style={{ color: "var(--text2)" }}>
                No pending verifications 🎉
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {verifications.map((v) => (
                <div key={v._id} style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: 4 }}>
                        {v.owner?.name || "Unknown"}
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text2)",
                          marginBottom: 4,
                        }}
                      >
                        {v.listing?.title}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text2)" }}>
                        Submitted:{" "}
                        {new Date(v.submittedAt).toLocaleDateString("en-IN")}
                      </p>
                      {v.documents?.length > 0 && (
                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          {v.documents.map((doc, i) => (
                            <a
                              key={i}
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: 12,
                                color: "var(--accent)",
                                textDecoration: "none",
                                border: "1px solid var(--accent)",
                                padding: "3px 10px",
                                borderRadius: 6,
                              }}
                            >
                              {doc.type || `Doc ${i + 1}`} ↗
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        style={btn()}
                        onClick={() => handleVerification(v._id, "approved")}
                      >
                        ✓ Approve
                      </button>
                      <button
                        style={btn("danger")}
                        onClick={() => handleVerification(v._id, "rejected")}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payments */}
      {activeTab === "Payments" && !loading && (
        <div style={cardStyle}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
            Payment History ({payments.length})
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["User", "Listing", "Amount", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        color: "var(--text2)",
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>
                      {p.user?.name || "—"}
                    </td>
                    <td style={{ padding: "10px 12px", color: "var(--text2)" }}>
                      {p.listing?.title || "—"}
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                      ₹{(p.amount / 100).toLocaleString()}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={badge(
                          p.status === "paid"
                            ? "#22c55e"
                            : p.status === "failed"
                              ? "#ef4444"
                              : "#f59e0b",
                        )}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        color: "var(--text2)",
                        fontSize: 12,
                      }}
                    >
                      {new Date(p.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
