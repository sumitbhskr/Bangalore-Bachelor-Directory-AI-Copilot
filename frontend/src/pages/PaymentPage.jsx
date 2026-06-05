// // src/pages/PaymentPage.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// const plans = [
//   {
//     id: "basic",
//     name: "Basic",
//     price: 199,
//     duration: "1 Month",
//     features: [
//       "1 Active Listing",
//       "Standard Visibility",
//       "Email Support",
//       "Basic Analytics",
//     ],
//     color: "#6b7280",
//     popular: false,
//   },
//   {
//     id: "pro",
//     name: "Pro",
//     price: 499,
//     duration: "3 Months",
//     features: [
//       "5 Active Listings",
//       "Priority Visibility",
//       "Phone + Email Support",
//       "Advanced Analytics",
//       "Verified Badge",
//     ],
//     color: "var(--accent)",
//     popular: true,
//   },
//   {
//     id: "premium",
//     name: "Premium",
//     price: 999,
//     duration: "6 Months",
//     features: [
//       "Unlimited Listings",
//       "Top Search Placement",
//       "Dedicated Support",
//       "Full Analytics",
//       "Verified Badge",
//       "Featured on Homepage",
//     ],
//     color: "#6366f1",
//     popular: false,
//   },
// ];

// export default function PaymentPage() {
//   const [selected, setSelected] = useState("pro");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const selectedPlan = plans.find((p) => p.id === selected);

//   async function handlePayment() {
//     setLoading(true);
//     setError("");

//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       // Step 1: Create Razorpay order
//       const orderRes = await axios.post(
//         `${API}/payments/create-order`,
//         { plan: selected },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       const { orderId, amount, currency, keyId } = orderRes.data.data;

//       // Step 2: Open Razorpay checkout
//       const options = {
//         key: keyId,
//         amount,
//         currency,
//         name: "Bangalore Bachelor",
//         description: `${selectedPlan.name} Plan — ${selectedPlan.duration}`,
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             // Step 3: Verify payment
//             await axios.post(
//               `${API}/payments/verify`,
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 plan: selected,
//               },
//               { headers: { Authorization: `Bearer ${token}` } },
//             );
//             navigate("/payment-success");
//           } catch {
//             setError("Payment verification failed. Please contact support.");
//           }
//         },
//         prefill: {
//           name: "",
//           email: "",
//         },
//         theme: {
//           color: "#f5c518",
//         },
//         modal: {
//           ondismiss: () => setLoading(false),
//         },
//       };

//       if (!window.Razorpay) {
//         setError("Payment gateway not loaded. Please refresh.");
//         setLoading(false);
//         return;
//       }

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       setError(err.response?.data?.message || "Payment failed. Try again.");
//     }

//     setLoading(false);
//   }

//   return (
//     <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
//       {/* Header */}
//       <div style={{ textAlign: "center", marginBottom: 40 }}>
//         <h2
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: 32,
//             marginBottom: 8,
//           }}
//         >
//           Choose Your Plan
//         </h2>
//         <p style={{ color: "var(--text2)", fontSize: 15 }}>
//           Boost your listings and reach more bachelors in Bangalore
//         </p>
//       </div>

//       {/* Plans Grid */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//           gap: 20,
//           maxWidth: 900,
//           margin: "0 auto 40px",
//         }}
//       >
//         {plans.map((plan) => {
//           const isSelected = selected === plan.id;
//           return (
//             <div
//               key={plan.id}
//               onClick={() => setSelected(plan.id)}
//               style={{
//                 background: "var(--bg2)",
//                 border: `2px solid ${isSelected ? plan.color : "var(--border)"}`,
//                 borderRadius: "var(--radius)",
//                 padding: "28px 24px",
//                 cursor: "pointer",
//                 position: "relative",
//                 transition: "all 0.2s",
//                 transform: isSelected ? "translateY(-4px)" : "none",
//                 boxShadow: isSelected ? `0 8px 30px ${plan.color}30` : "none",
//               }}
//             >
//               {plan.popular && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     top: -12,
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                     background: plan.color,
//                     color: "#0f0f0f",
//                     fontSize: 11,
//                     fontWeight: 700,
//                     padding: "3px 14px",
//                     borderRadius: 999,
//                     whiteSpace: "nowrap",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   Most Popular
//                 </div>
//               )}

//               {/* Plan name */}
//               <div
//                 style={{
//                   fontSize: 18,
//                   fontWeight: 800,
//                   marginBottom: 4,
//                   color: isSelected ? plan.color : "var(--text1)",
//                 }}
//               >
//                 {plan.name}
//               </div>
//               <div
//                 style={{
//                   fontSize: 12,
//                   color: "var(--text2)",
//                   marginBottom: 16,
//                 }}
//               >
//                 {plan.duration}
//               </div>

//               {/* Price */}
//               <div style={{ marginBottom: 20 }}>
//                 <span
//                   style={{
//                     fontSize: 36,
//                     fontWeight: 900,
//                     fontFamily: "var(--font-display)",
//                     color: plan.color,
//                   }}
//                 >
//                   ₹{plan.price}
//                 </span>
//                 <span style={{ color: "var(--text2)", fontSize: 13 }}>
//                   {" "}
//                   / {plan.duration}
//                 </span>
//               </div>

//               {/* Features */}
//               <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//                 {plan.features.map((f) => (
//                   <li
//                     key={f}
//                     style={{
//                       fontSize: 13,
//                       color: "var(--text2)",
//                       marginBottom: 8,
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 8,
//                     }}
//                   >
//                     <span style={{ color: "#22c55e", fontSize: 15 }}>✓</span>
//                     {f}
//                   </li>
//                 ))}
//               </ul>

//               {/* Selected indicator */}
//               {isSelected && (
//                 <div
//                   style={{
//                     marginTop: 20,
//                     textAlign: "center",
//                     fontSize: 13,
//                     fontWeight: 700,
//                     color: plan.color,
//                   }}
//                 >
//                   ✓ Selected
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Payment Summary */}
//       <div
//         style={{
//           maxWidth: 420,
//           margin: "0 auto",
//           background: "var(--bg2)",
//           border: "1px solid var(--border)",
//           borderRadius: "var(--radius)",
//           padding: "24px 28px",
//         }}
//       >
//         <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
//           Order Summary
//         </h3>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 10,
//             fontSize: 14,
//           }}
//         >
//           <span style={{ color: "var(--text2)" }}>
//             {selectedPlan.name} Plan
//           </span>
//           <span>₹{selectedPlan.price}</span>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 10,
//             fontSize: 14,
//           }}
//         >
//           <span style={{ color: "var(--text2)" }}>Duration</span>
//           <span>{selectedPlan.duration}</span>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 10,
//             fontSize: 14,
//           }}
//         >
//           <span style={{ color: "var(--text2)" }}>GST (18%)</span>
//           <span>₹{Math.round(selectedPlan.price * 0.18)}</span>
//         </div>

//         <div
//           style={{
//             borderTop: "1px solid var(--border)",
//             paddingTop: 12,
//             marginTop: 12,
//             display: "flex",
//             justifyContent: "space-between",
//             fontWeight: 800,
//             fontSize: 16,
//           }}
//         >
//           <span>Total</span>
//           <span style={{ color: "var(--accent)" }}>
//             ₹{selectedPlan.price + Math.round(selectedPlan.price * 0.18)}
//           </span>
//         </div>

//         {error && (
//           <div
//             style={{
//               background: "#ef444420",
//               border: "1px solid #ef4444",
//               color: "#ef4444",
//               padding: "10px 14px",
//               borderRadius: 8,
//               fontSize: 13,
//               marginTop: 16,
//             }}
//           >
//             {error}
//           </div>
//         )}

//         <button
//           onClick={handlePayment}
//           disabled={loading}
//           style={{
//             width: "100%",
//             marginTop: 20,
//             padding: "14px",
//             background: loading ? "var(--border)" : "var(--accent)",
//             color: "#0f0f0f",
//             border: "none",
//             borderRadius: "var(--radius)",
//             fontSize: 15,
//             fontWeight: 800,
//             cursor: loading ? "not-allowed" : "pointer",
//             transition: "all 0.2s",
//           }}
//         >
//           {loading
//             ? "Processing..."
//             : `Pay ₹${selectedPlan.price + Math.round(selectedPlan.price * 0.18)}`}
//         </button>

//         <p
//           style={{
//             fontSize: 12,
//             color: "var(--text2)",
//             textAlign: "center",
//             marginTop: 12,
//           }}
//         >
//           🔒 Secured by Razorpay · 100% Safe
//         </p>
//       </div>
//     </div>
//   );
// }

////
// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { initiatePayment } from "../services/payment";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 199,
    duration: "1 Month",
    features: [
      "1 Active Listing",
      "Standard Visibility",
      "Email Support",
      "Basic Analytics",
    ],
    color: "#6b7280",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    duration: "3 Months",
    features: [
      "5 Active Listings",
      "Priority Visibility",
      "Phone + Email Support",
      "Advanced Analytics",
      "Verified Badge",
    ],
    color: "var(--accent)",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    duration: "6 Months",
    features: [
      "Unlimited Listings",
      "Top Search Placement",
      "Dedicated Support",
      "Full Analytics",
      "Verified Badge",
      "Featured on Homepage",
    ],
    color: "#6366f1",
    popular: false,
  },
];

export default function PaymentPage() {
  const { user, token, showToast, navigate } = useApp();
  const [selected, setSelected] = useState("pro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = plans.find((p) => p.id === selected);
  const total = selectedPlan.price + Math.round(selectedPlan.price * 0.18);

  const handlePayment = async () => {
    if (!user) {
      navigate("login");
      return;
    }
    setLoading(true);
    setError("");
    await initiatePayment({
      listingId: null,
      months: 1,
      notes: `${selectedPlan.name} Plan`,
      token,
      user,
      onSuccess: (payment) => {
        showToast("Payment successful! 🎉");
        navigate("dashboard");
      },
      onFailure: (msg) => {
        setError(msg || "Payment failed. Try again.");
        setLoading(false);
      },
    });
    setLoading(false);
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            marginBottom: 8,
          }}
        >
          Choose Your Plan
        </h2>
        <p style={{ color: "var(--text2)", fontSize: 15 }}>
          Boost your listings and reach more bachelors in Bangalore
        </p>
      </div>

      {/* Plans Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          maxWidth: 900,
          margin: "0 auto 40px",
        }}
      >
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                background: "var(--bg2)",
                border: `2px solid ${isSelected ? plan.color : "var(--border)"}`,
                borderRadius: "var(--radius)",
                padding: "28px 24px",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s",
                transform: isSelected ? "translateY(-4px)" : "none",
                boxShadow: isSelected ? `0 8px 30px ${plan.color}30` : "none",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: plan.color,
                    color: "#0f0f0f",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 14px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Most Popular
                </div>
              )}
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  marginBottom: 4,
                  color: isSelected ? plan.color : "var(--text)",
                }}
              >
                {plan.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  marginBottom: 16,
                }}
              >
                {plan.duration}
              </div>
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    fontFamily: "var(--font-display)",
                    color: plan.color,
                  }}
                >
                  ₹{plan.price}
                </span>
                <span style={{ color: "var(--text2)", fontSize: 13 }}>
                  {" "}
                  / {plan.duration}
                </span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      fontSize: 13,
                      color: "var(--text2)",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#22c55e", fontSize: 15 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {isSelected && (
                <div
                  style={{
                    marginTop: 20,
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: plan.color,
                  }}
                >
                  ✓ Selected
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "24px 28px",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
          Order Summary
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          <span style={{ color: "var(--text2)" }}>
            {selectedPlan.name} Plan
          </span>
          <span>₹{selectedPlan.price}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          <span style={{ color: "var(--text2)" }}>Duration</span>
          <span>{selectedPlan.duration}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          <span style={{ color: "var(--text2)" }}>GST (18%)</span>
          <span>₹{Math.round(selectedPlan.price * 0.18)}</span>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 12,
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          <span>Total</span>
          <span style={{ color: "var(--accent)" }}>₹{total}</span>
        </div>

        {error && (
          <div
            style={{
              background: "#ef444420",
              border: "1px solid #ef4444",
              color: "#ef4444",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              marginTop: 16,
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "14px",
            background: loading ? "var(--border)" : "var(--accent)",
            color: "#0f0f0f",
            border: "none",
            borderRadius: "var(--radius)",
            fontSize: 15,
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Processing..." : `Pay ₹${total}`}
        </button>
        <p
          style={{
            fontSize: 12,
            color: "var(--text2)",
            textAlign: "center",
            marginTop: 12,
          }}
        >
          🔒 Secured by Razorpay · 100% Safe
        </p>
      </div>
    </div>
  );
}
