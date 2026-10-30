import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  Sparkles,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Navigation,
  Phone,
  LayoutDashboard,
  UserRound,
  Heart,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { PAYMENT_API_URL, formatImageUrl } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import heroFallback from "../../assets/my-account.webp";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken, logout } = useAuth();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch fresh order details from backend to ensure real-time status and checkpoints
    const fetchOrder = async () => {
      const targetId =
        orderId ||
        location.state?.order?.orderNumber ||
        location.state?.order?.id;
      if (!targetId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const headers = { "Content-Type": "application/json" };
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

        const res = await fetch(
          `${PAYMENT_API_URL}/order/${encodeURIComponent(targetId)}`,
          { headers }
        );
        const data = await res.json();

        if (data.success && data.order) {
          setOrder(data.order);
          setError("");
        } else if (!order) {
          setError(data.message || "Unable to locate order records.");
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
        if (!order) {
          setError("Failed to connect to order server.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, accessToken]);

  

  const getStepStatus = (stepName) => {
    let currentStatus = (order?.status || "Pending").toLowerCase();
    if (currentStatus === "confirmed" || currentStatus === "processing") {
      currentStatus = "pending";
    }
    const sequence = ["pending", "shipped", "out for delivery", "delivered"];
    const currentIdx = sequence.indexOf(currentStatus);
    const stepIdx = sequence.indexOf(stepName);

    if (currentStatus === "cancelled") {
      return stepName === "pending" ? "completed" : "cancelled";
    }

    if (currentIdx !== -1 && stepIdx <= currentIdx) return "completed";
    if (currentIdx !== -1 && stepIdx === currentIdx + 1) return "current";
    return "pending";
  };

  // User details for luxury account sidebar
  const displayName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : order?.customer?.fullName || order?.customer?.name || "Saroj Kumar";

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => (part[0] ? part[0].toUpperCase() : ""))
      .join("") || "SK";

  const userEmail =
    user?.email ||
    order?.customer?.email ||
    "sarojkumarmallik94@gmail.com";

  const userRole =
    user?.role === "admin" ? "Administrator" : "Art Collector";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "28 October 2026";

  if (loading) {
    return (
      <div className="OrderDetails-page">
        <div className="OrderDetails-container">
          <div className="OrderDetails-loading">
            <Loader2 className="OrderDetails-spin" size={42} />
            <h3>Loading Order Details...</h3>
            <p>Fetching purchase record from the collection archives.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="OrderDetails-page">
        <div className="OrderDetails-container">
          <div className="OrderDetails-error-card">
            <AlertCircle size={48} className="OrderDetails-error-icon" />
            <h2>Order Not Found</h2>
            <p>{error || "The requested artwork order could not be located."}</p>
            <div className="OrderDetails-error-actions">
              <Link to="/my-account?tab=orders" className="OrderDetails-primary-btn">
                <ArrowLeft size={16} />
                <span>Return to My Orders</span>
              </Link>
              <Link to="/shop" className="OrderDetails-secondary-btn">
                <Sparkles size={16} />
                <span>Explore Art Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const rawDate = order.createdAt || order.date || new Date().toISOString();
  const dateObj = new Date(rawDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : order.date || "Recent";
  const formattedTime = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : order.time || "";

  const items =
    order.items && order.items.length > 0
      ? order.items
      : order.products || [];

  const displayId =
    order.orderNumber ||
    order.id ||
    (order._id ? `AC-${order._id.slice(-8).toUpperCase()}` : "AC-ORDER");

  const isCaptured =
    order.payment?.status === "captured" ||
    order.payment?.status === "success" ||
    !order.payment?.status;

  return (
    <div className="OrderDetails-page">
      <div className="OrderDetails-shell">
        {/* ========================================================= */}
        {/* SIDEBAR NAVIGATION INTEGRATION */}
        {/* ========================================================= */}
        <aside className="OrderDetails-sidebar no-print">
          <div className="OrderDetails-sidebar-card">
            {/* User Profile Summary */}
            <div className="OrderDetails-sidebar-profile">
              <div className="OrderDetails-avatar-circle">{initials}</div>
              <div className="OrderDetails-sidebar-userinfo">
                <h3 className="OrderDetails-sidebar-name">{displayName}</h3>
                <p className="OrderDetails-sidebar-email">{userEmail}</p>
                <span className="OrderDetails-role-badge">{userRole}</span>
                <span className="OrderDetails-sidebar-joined">
                  Member since {joinedDate}
                </span>
              </div>
            </div>

            <div className="OrderDetails-sidebar-divider" />

            {/* Navigation Menu */}
            <nav className="OrderDetails-sidebar-nav" aria-label="Account Navigation">
              <button
                type="button"
                className="OrderDetails-sidebar-btn"
                onClick={() => navigate("/my-account?tab=dashboard")}
              >
                <div className="OrderDetails-sidebar-btn-content">
                  <LayoutDashboard size={18} className="OrderDetails-sidebar-btn-icon" />
                  <span className="OrderDetails-sidebar-btn-label">Dashboard</span>
                </div>
              </button>

              <button
                type="button"
                className="OrderDetails-sidebar-btn"
                onClick={() => navigate("/my-account?tab=profile")}
              >
                <div className="OrderDetails-sidebar-btn-content">
                  <UserRound size={18} className="OrderDetails-sidebar-btn-icon" />
                  <span className="OrderDetails-sidebar-btn-label">My Profile</span>
                </div>
              </button>

              <button
                type="button"
                className="OrderDetails-sidebar-btn OrderDetails-sidebar-btn--active"
                onClick={() => navigate("/my-account?tab=orders")}
              >
                <div className="OrderDetails-sidebar-btn-content">
                  <Package size={18} className="OrderDetails-sidebar-btn-icon" />
                  <span className="OrderDetails-sidebar-btn-label">My Orders</span>
                </div>
                <span className="OrderDetails-sidebar-badge">Active</span>
              </button>

              <button
                type="button"
                className="OrderDetails-sidebar-btn"
                onClick={() => navigate("/my-account?tab=addresses")}
              >
                <div className="OrderDetails-sidebar-btn-content">
                  <MapPin size={18} className="OrderDetails-sidebar-btn-icon" />
                  <span className="OrderDetails-sidebar-btn-label">Saved Addresses</span>
                </div>
              </button>

              <button
                type="button"
                className="OrderDetails-sidebar-btn"
                onClick={() => navigate("/my-account?tab=wishlist")}
              >
                <div className="OrderDetails-sidebar-btn-content">
                  <Heart size={18} className="OrderDetails-sidebar-btn-icon" />
                  <span className="OrderDetails-sidebar-btn-label">My Wishlist</span>
                </div>
              </button>

              <button
                type="button"
                className="OrderDetails-sidebar-btn"
                onClick={() => navigate("/cart")}
              >
                <div className="OrderDetails-sidebar-btn-content">
                  <ShoppingBag size={18} className="OrderDetails-sidebar-btn-icon" />
                  <span className="OrderDetails-sidebar-btn-label">Shopping Cart</span>
                </div>
              </button>
            </nav>

            <div className="OrderDetails-sidebar-divider" />

            {/* Sign Out Button */}
            <button
              type="button"
              className="OrderDetails-sidebar-logout"
              onClick={() => {
                if (logout) logout();
                navigate("/my-account");
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN ORDER DETAILS CONTENT AREA */}
        {/* ========================================================= */}
        <div className="OrderDetails-main-area">
          {/* Navigation Bar */}
          <div className="OrderDetails-nav no-print">
            <button
              type="button"
              onClick={() => navigate("/my-account?tab=orders")}
              className="OrderDetails-back-link"
            >
              <ArrowLeft size={18} />
              <span>Back to Order History</span>
            </button>

            
          </div>

          {/* Hero Header Card */}
          <div className="OrderDetails-hero-card">
            <div className="OrderDetails-hero-left">
              <span className="OrderDetails-eyebrow">ORIGINAL ARTWORK ACQUISITION</span>
              <h1 className="OrderDetails-order-title">
                Order #{displayId}
              </h1>
              <p className="OrderDetails-hero-meta">
                <Calendar size={14} />
                <span>Placed on {formattedDate} at {formattedTime}</span>
              </p>
            </div>

            <div className="OrderDetails-hero-right">
              {isCaptured && (
                <span className="OrderDetails-badge OrderDetails-badge--paid">
                  <CheckCircle2 size={14} />
                  <span>Paid via Razorpay</span>
                </span>
              )}
              <span
                className={`OrderDetails-badge OrderDetails-badge--status OrderDetails-badge--${(order.status || "pending").toLowerCase().replace(/\s+/g, "-")}`}
              >
                {order.status || "Pending"}
              </span>
            </div>
          </div>

          {/* Order Status Stepper Tracker */}
          <div className="OrderDetails-stepper-card no-print">
            <h3 className="OrderDetails-section-heading">Order &amp; Delivery Progress</h3>
            <div className="OrderDetails-stepper">
              <div className={`OrderDetails-step OrderDetails-step--${getStepStatus("pending")}`}>
                <div className="OrderDetails-step-icon">
                  <CheckCircle2 size={20} />
                </div>
                <div className="OrderDetails-step-content">
                  <strong>Order Confirmed</strong>
                  <span>Payment captured successfully</span>
                </div>
              </div>

              <div className="OrderDetails-step-line" />

              <div className={`OrderDetails-step OrderDetails-step--${getStepStatus("shipped")}`}>
                <div className="OrderDetails-step-icon">
                  <Truck size={20} />
                </div>
                <div className="OrderDetails-step-content">
                  <strong>Shipped / In Transit</strong>
                  <span>Specialized insured art courier</span>
                </div>
              </div>

              <div className="OrderDetails-step-line" />

              <div className={`OrderDetails-step OrderDetails-step--${getStepStatus("out for delivery")}`}>
                <div className="OrderDetails-step-icon">
                  <Navigation size={20} />
                </div>
                <div className="OrderDetails-step-content">
                  <strong>Out for Delivery</strong>
                  <span>Assigned to delivery agent</span>
                </div>
              </div>

              <div className="OrderDetails-step-line" />

              <div className={`OrderDetails-step OrderDetails-step--${getStepStatus("delivered")}`}>
                <div className="OrderDetails-step-icon">
                  <Package size={20} />
                </div>
                <div className="OrderDetails-step-content">
                  <strong>Delivered</strong>
                  <span>Safely handed over to collector</span>
                </div>
              </div>
            </div>
          </div>

          {/* OUT FOR DELIVERY AGENT HIGHLIGHT CARD */}
          {(order.status === "Out for Delivery" || order.shipment?.deliveryAgent?.name) && (
            <div className="OrderDetails-agent-card no-print">
              <div className="OrderDetails-agent-info">
                <div className="OrderDetails-agent-avatar">
                  <Truck size={24} />
                </div>
                <div>
                  <span className="OrderDetails-agent-tag">🚴 Live Delivery Executive</span>
                  <h4 className="OrderDetails-agent-name">
                    {order.shipment?.deliveryAgent?.name || "Assigned Delivery Executive"}
                  </h4>
                  <p className="OrderDetails-agent-meta">
                    {order.shipment?.deliveryAgent?.vehicleNumber && `Vehicle: ${order.shipment.deliveryAgent.vehicleNumber} · `}
                    {order.shipment?.estimatedDelivery ? `Expected: ${order.shipment.estimatedDelivery}` : "Handover scheduled today"}
                  </p>
                </div>
              </div>

              {order.shipment?.deliveryAgent?.phone && (
                <a
                  href={`tel:${order.shipment.deliveryAgent.phone}`}
                  className="OrderDetails-agent-call-btn"
                >
                  <Phone size={15} />
                  <span>Call Agent: {order.shipment.deliveryAgent.phone}</span>
                </a>
              )}
            </div>
          )}

          {/* MULTIPLE SHIPPED TRANSIT CHECKPOINTS TIMELINE */}
          {order.shipment?.transitLocations && order.shipment.transitLocations.length > 0 && (
            <div className="OrderDetails-card no-print" style={{ marginBottom: "24px" }}>
              <div className="OrderDetails-card-header" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={20} className="OrderDetails-header-icon" />
                  <h3 className="OrderDetails-card-title">Live Shipment Transit Journey</h3>
                </div>
                {order.shipment.trackingNumber && (
                  <span style={{ fontSize: "12px", fontFamily: "monospace", color: "#8c5b0c", fontWeight: "700" }}>
                    Tracking #{order.shipment.trackingNumber} ({order.shipment.carrier || "Blue Dart Express"})
                  </span>
                )}
              </div>

              <div className="OrderDetails-transit-timeline">
                {order.shipment.transitLocations.map((loc, idx) => (
                  <div key={idx} className="OrderDetails-transit-checkpoint">
                    <div className="OrderDetails-checkpoint-dot" />
                    <div className="OrderDetails-checkpoint-content">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                        <strong style={{ fontSize: "13.5px", color: "#2d241e" }}>{loc.location}</strong>
                        <span className="OrderDetails-checkpoint-status">{loc.status || "In Transit"}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#777", marginTop: "3px" }}>
                        {loc.city && <span>📍 {loc.city} · </span>}
                        <span>
                          {new Date(loc.timestamp).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      {loc.notes && (
                        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#8c5b0c", fontStyle: "italic" }}>
                          Note: {loc.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-Column Content Grid */}
          <div className="OrderDetails-grid">
            {/* LEFT COLUMN: Items & Delivery Address */}
            <div className="OrderDetails-main-col">
              {/* Artworks List Card */}
              <div className="OrderDetails-card">
                <div className="OrderDetails-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Package size={20} className="OrderDetails-header-icon" />
                    <h3 className="OrderDetails-card-title">Acquired Artworks ({items.length})</h3>
                  </div>
                  <span className="OrderDetails-verified-badge">
                    <ShieldCheck size={14} />
                    <span>Curated &amp; Authenticated</span>
                  </span>
                </div>

                <div className="OrderDetails-items-list">
                  {items.map((item, index) => {
                    const title = item.title || item.name || "Original Artwork";
                    const price = item.price || 0;
                    const qty = item.quantity || 1;
                    const img = formatImageUrl(item.image) || heroFallback;

                    return (
                      <div key={index} className="OrderDetails-item-row">
                        <div className="OrderDetails-item-image-wrap">
                          <img
                            src={img}
                            alt={title}
                            className="OrderDetails-item-image"
                            onError={(e) => {
                              e.currentTarget.src = heroFallback;
                            }}
                          />
                        </div>

                        <div className="OrderDetails-item-details">
                          <h4 className="OrderDetails-item-title">{title}</h4>
                          <p className="OrderDetails-item-artist">
                            By {item.artist || "Master Folk & Tribal Artisan"}
                          </p>
                          <div className="OrderDetails-item-meta">
                            <span className="OrderDetails-item-qty">Quantity: {qty}</span>
                            <span className="OrderDetails-item-unit-price">
                              ₹{price.toLocaleString("en-IN")} each
                            </span>
                          </div>
                        </div>

                        <div className="OrderDetails-item-total">
                          <span className="OrderDetails-item-subtotal-label">Subtotal</span>
                          <strong>₹{(price * qty).toLocaleString("en-IN")}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Details Card */}
              <div className="OrderDetails-card">
                <div className="OrderDetails-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin size={20} className="OrderDetails-header-icon" />
                    <h3 className="OrderDetails-card-title">Shipping &amp; Delivery Address</h3>
                  </div>
                </div>

                <div className="OrderDetails-address-content">
                  <strong className="OrderDetails-recipient-name">
                    {order.customer?.fullName || order.customer?.name || "Art Collector"}
                  </strong>
                  <p className="OrderDetails-address-text">
                    {order.customer?.address || order.shipment?.shippingAddress || "Address provided during checkout"}
                  </p>
                  <div className="OrderDetails-contact-pills">
                    {order.customer?.phone && (
                      <div className="OrderDetails-contact-pill">
                        <span>Phone:</span>
                        <strong>{order.customer.phone}</strong>
                      </div>
                    )}
                    {order.customer?.email && (
                      <div className="OrderDetails-contact-pill">
                        <span>Email:</span>
                        <strong>{order.customer.email}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Financial Summary & Payment */}
            <div className="OrderDetails-side-col">
              {/* Price Breakdown */}
              <div className="OrderDetails-card">
                <div className="OrderDetails-card-header">
                  <h3 className="OrderDetails-card-title">Order Financial Summary</h3>
                </div>

                <div className="OrderDetails-summary-list">
                  <div className="OrderDetails-summary-row">
                    <span>Artwork Subtotal</span>
                    <strong>₹{(order.subtotal || order.totalAmount || 0).toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="OrderDetails-summary-row">
                    <span>Standard Insured Shipping</span>
                    <span className="OrderDetails-text-free">FREE</span>
                  </div>
                  <div className="OrderDetails-summary-row">
                    <span>Transit Insurance</span>
                    <span className="OrderDetails-text-free">Complimentary</span>
                  </div>
                  <div className="OrderDetails-summary-row">
                    <span>Taxes (GST Included)</span>
                    <span>₹0</span>
                  </div>
                  <div className="OrderDetails-summary-divider" />
                  <div className="OrderDetails-summary-row OrderDetails-summary-row--total">
                    <span>Total Paid</span>
                    <strong>₹{(order.totalAmount || order.subtotal || 0).toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </div>

              {/* Payment Details Card */}
              <div className="OrderDetails-card">
                <div className="OrderDetails-card-header">
                  <h3 className="OrderDetails-card-title">Payment Information</h3>
                </div>

                <div className="OrderDetails-payment-box">
                  <div className="OrderDetails-payment-row">
                    <span>Payment Gateway</span>
                    <strong>{order.payment?.gateway || "Razorpay Secure"}</strong>
                  </div>
                  <div className="OrderDetails-payment-row">
                    <span>Payment Status</span>
                    <strong className="OrderDetails-text-success">
                      {order.payment?.status || "Captured"}
                    </strong>
                  </div>
                  {order.payment?.razorpayPaymentId && (
                    <div className="OrderDetails-payment-row">
                      <span>Payment ID</span>
                      <code className="OrderDetails-code">{order.payment.razorpayPaymentId}</code>
                    </div>
                  )}
                  {order.payment?.razorpayOrderId && (
                    <div className="OrderDetails-payment-row">
                      <span>Razorpay Order ID</span>
                      <code className="OrderDetails-code">{order.payment.razorpayOrderId}</code>
                    </div>
                  )}
                </div>
              </div>

              {/* Support / Guarantee Card */}
              <div className="OrderDetails-card OrderDetails-card--guarantee no-print">
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <ShieldCheck size={28} className="OrderDetails-gold-icon" />
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "#543810" }}>
                      Heritage Guarantee
                    </h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#7a5c2d", lineHeight: "1.4" }}>
                      Every artwork is handcrafted and verified for authentic folk art lineage with tamper-evident insured shipping.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
