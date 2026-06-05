// src/services/payment.js
import api from "./api";

// Load Razorpay script dynamically
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const initiatePayment = async ({
  listingId,
  months,
  startDate,
  notes,
  token,
  user,
  onSuccess,
  onFailure,
}) => {
  const loaded = await loadRazorpay();
  if (!loaded) {
    onFailure?.("Failed to load payment gateway");
    return;
  }

  // Create order on backend
  const orderData = await api.post(
    "/payments/create-order",
    { listingId, months, startDate, notes },
    token,
  );

  if (!orderData.success) {
    onFailure?.(orderData.message || "Failed to create order");
    return;
  }

  const options = {
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "Bangalore Bachelor Directory",
    description: orderData.listing.title,
    order_id: orderData.orderId,
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone || "",
    },
    theme: { color: "#e8a45a" },
    handler: async (response) => {
      // Verify on backend
      const verifyData = await api.post(
        "/payments/verify",
        {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          paymentId: orderData.paymentId,
        },
        token,
      );
      if (verifyData.success) onSuccess?.(verifyData.payment);
      else onFailure?.("Payment verification failed");
    },
    modal: {
      ondismiss: () => onFailure?.("Payment cancelled"),
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
