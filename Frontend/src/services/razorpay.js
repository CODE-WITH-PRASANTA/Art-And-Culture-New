import { PAYMENT_API_URL } from "../config/api";

/**
 * Ensures Razorpay checkout.js script is loaded on the page
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Calls backend to create a Razorpay order and MongoDB pending order
 */
export const createPaymentOrder = async ({
  customer,
  items,
  subtotal,
  shipping = 0,
  tax = 0,
  totalAmount,
  token,
}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${PAYMENT_API_URL}/create-order`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({
      customer,
      items,
      subtotal,
      shipping,
      tax,
      totalAmount,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to initiate payment gateway");
  }

  return data;
};

/**
 * Sends payment response details to backend for cryptographic signature verification
 */
export const verifyPaymentSignature = async ({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  token,
}) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${PAYMENT_API_URL}/verify`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Payment verification failed");
  }

  return data;
};

/**
 * Fetches order history for current user
 */
export const fetchMyOrders = async (token) => {
  if (!token) return [];
  const res = await fetch(`${PAYMENT_API_URL}/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const data = await res.json();
  return data.success && Array.isArray(data.orders) ? data.orders : [];
};

/**
 * Launches the Razorpay checkout overlay
 */
export const launchRazorpayCheckout = async ({
  orderData,
  onSuccess,
  onFailure,
  onDismiss,
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Could not load Razorpay payment SDK. Check your internet connection.");
  }

  const options = {
    key: orderData.keyId || "rzp_test_TppGgVggUkbJv4",
    amount: orderData.amount,
    currency: orderData.currency || "INR",
    name: "Art & Culture",
    description: `Artwork Order #${orderData.orderNumber}`,
    image: "/favicon.svg",
    order_id: orderData.razorpayOrderId,
    prefill: {
      name: orderData.customer?.fullName || "",
      email: orderData.customer?.email || "",
      contact: orderData.customer?.phone || "",
    },
    notes: {
      orderNumber: orderData.orderNumber,
      orderId: orderData.orderId,
    },
    theme: {
      color: "#d08a24",
    },
    handler: async function (response) {
      if (typeof onSuccess === "function") {
        onSuccess({
          orderId: orderData.orderId,
          orderNumber: orderData.orderNumber,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (typeof onDismiss === "function") {
          onDismiss();
        }
      },
      escape: true,
      backdropclose: false,
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", function (response) {
    if (typeof onFailure === "function") {
      onFailure(response.error);
    }
  });

  razorpay.open();
};

