import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Home, Briefcase, Sparkles, Check, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { ARTS_API_URL, formatImageUrl } from "../../config/api";
import {
  createPaymentOrder,
  launchRazorpayCheckout,
  verifyPaymentSignature,
} from "../../services/razorpay";
import "./CartMain.css";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatFullAddress = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") {
    return addr
      .replace(/undefined,\s*/gi, "")
      .replace(/\s*–\s*undefined/gi, "")
      .replace(/\s*-\s*undefined/gi, "")
      .replace(/undefined/gi, "")
      .trim();
  }
  const street = (addr.street || addr.addressLine1 || "").trim();
  const extra = (addr.addressLine2 || addr.landmark || "").trim();
  const city = (addr.city || "").trim();
  const state = (addr.state || "").trim();
  const pin = (addr.pinCode || addr.postalCode || addr.zip || "").trim();
  const country = (addr.country || "").trim();

  const parts = [];
  if (street && street !== "undefined") parts.push(street);
  if (extra && extra !== "undefined") parts.push(extra);
  if (city && city !== "undefined") parts.push(city);
  if (state && state !== "undefined") parts.push(state);

  let result = parts.join(", ");
  if (pin && pin !== "undefined") {
    result = result ? `${result} – ${pin}` : pin;
  }
  if (country && country !== "India" && country !== "undefined") {
    result = result ? `${result}, ${country}` : country;
  }
  return result;
};

const CartMainIcon = ({ name, size = 18 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 10v6M14 10v6" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    cart: (
      <>
        <path d="M3 3h2l2.4 12.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v11H3z" />
        <path d="M14 10h4l3 3v4h-7z" />
        <circle cx="7.5" cy="18" r="1.8" />
        <circle cx="17.5" cy="18" r="1.8" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    return: (
      <>
        <path d="M3 7v6h6" />
        <path d="M4 13a8 8 0 1 0 2-7L3 9" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="m8.2 13-1.2 9 5-3 5 3-1.2-9" />
        <path d="m10 8 1.4 1.4L14 7" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return <svg {...common}>{paths[name] || null}</svg>;
};

const CartMain = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, accessToken, getAddresses } = useAuth();
  const {
    cart: items,
    cartCount,
    selectedItems,
    subtotal,
    shipping,
    tax,
    total,
    removeFromCart,
    changeQuantity,
    toggleSelection,
    clearCart,
    addToCart,
  } = useCart();

  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [savedAddresses, setSavedAddresses] = useState(() => {
    return Array.isArray(user?.addresses) ? user.addresses : [];
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleSelectSavedAddress = (addr) => {
    const addrId = addr._id || addr.id;
    setSelectedAddressId(addrId);
    setCustomer((prev) => ({
      ...prev,
      name: addr.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      email: prev.email || user?.email || "",
      phone: addr.phone || user?.phone || prev.phone,
      address: formatFullAddress(addr),
    }));
  };

  // Pre-fill delivery details and load saved addresses if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const applyAddressList = (addrs) => {
        if (Array.isArray(addrs) && addrs.length > 0) {
          setSavedAddresses(addrs);
          const def = addrs.find((a) => a.isDefault) || addrs[0];
          if (def) {
            handleSelectSavedAddress(def);
            return;
          }
        }
        setCustomer((prev) => ({
          ...prev,
          name: prev.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: prev.email || user.email || "",
          phone: prev.phone || user.phone || "",
          address: formatFullAddress(prev.address || user.location || ""),
        }));
      };

      if (Array.isArray(user.addresses) && user.addresses.length > 0) {
        applyAddressList(user.addresses);
      }

      if (typeof getAddresses === "function") {
        getAddresses()
          .then((addrs) => {
            if (Array.isArray(addrs) && addrs.length > 0) {
              applyAddressList(addrs);
            }
          })
          .catch(() => {});
      }
    }
  }, [isAuthenticated, user]);

  // If redirected back from login with ?checkout=true, open checkout modal automatically
  useEffect(() => {
    if (searchParams.get("checkout") === "true") {
      if (isAuthenticated && items.length > 0) {
        setCheckoutOpen(true);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("checkout");
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [searchParams, isAuthenticated, items.length]);

  // Notice auto-dismiss timer
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Fetch live published artworks for recommendations
  useEffect(() => {
    let isMounted = true;
    fetch(`${ARTS_API_URL}?isPublished=true`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.arts)) {
          const formatted = data.arts.map((art) => ({
            id: String(art._id || art.id),
            _id: art._id,
            name: art.title,
            title: art.title,
            artist: art.artistName || "Art & Culture Artist",
            price: Number(art.price) || 0,
            image: formatImageUrl(
              art.photos?.[0]?.url || art.photos?.[0]?.dataUrl || ""
            ),
            tags: [art.category || "Artwork"],
            slug: art.slug || "",
          }));
          setRecommendations(formatted);
        }
      })
      .catch((err) => console.error("Error fetching recommendations:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const availableRecommendations = useMemo(() => {
    const cartIds = new Set(items.map((i) => String(i.id)));
    return recommendations.filter((rec) => !cartIds.has(String(rec.id)));
  }, [recommendations, items]);

  const visibleRecommendations = showAll
    ? availableRecommendations
    : availableRecommendations.slice(0, 4);

  const handleRemoveItem = (id) => {
    const item = items.find((i) => i.id === id || i._id === id);
    removeFromCart(id);
    setNotice(`"${item ? item.name || item.title : "Artwork"}" removed from your cart.`);
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    clearCart();
    setNotice("Your cart has been cleared.");
  };

  const handleAddRecommendation = (artwork) => {
    addToCart(artwork, 1);
    setNotice(`"${artwork.name}" added to your cart.`);
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      setNotice("Your cart is empty. Please add artworks before checking out.");
      return;
    }

    if (selectedItems.length === 0) {
      setNotice("Please select at least one artwork to continue.");
      return;
    }

    if (!isAuthenticated) {
      navigate("/my-account?redirect=/cart%3Fcheckout%3Dtrue", {
        state: {
          from: "/cart?checkout=true",
          message: "Please sign in or create an account to proceed to checkout.",
        },
      });
      return;
    }

    setCheckoutOpen(true);
  };

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (selectedItems.length === 0) {
      setNotice("Please select at least one artwork to continue.");
      return;
    }

    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      setNotice("Please fill in complete delivery details before proceeding.");
      return;
    }

    setIsPaying(true);
    setNotice("");

    try {
      const orderData = await createPaymentOrder({
        customer: {
          fullName: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
        },
        items: selectedItems,
        subtotal,
        shipping,
        tax,
        totalAmount: total,
        token: accessToken,
      });

      // Close the delivery details modal so Razorpay modal opens cleanly
      setCheckoutOpen(false);

      await launchRazorpayCheckout({
        orderData,
        onSuccess: async (payResponse) => {
          try {
            const verifyRes = await verifyPaymentSignature({
              orderId: payResponse.orderId,
              razorpayOrderId: payResponse.razorpayOrderId,
              razorpayPaymentId: payResponse.razorpayPaymentId,
              razorpaySignature: payResponse.razorpaySignature,
              token: accessToken,
            });

            // Payment succeeded and verified!
            clearCart();
            setOrderSuccess(verifyRes.order || orderData);
            setIsPaying(false);
          } catch (err) {
            console.error("Verification error:", err);
            setNotice(
              "Payment was completed, but verification encountered a delay. Please check your orders."
            );
            setIsPaying(false);
          }
        },
        onFailure: (err) => {
          console.error("Payment failed:", err);
          setNotice(
            err.description || "Payment failed or was cancelled. Please try again."
          );
          setIsPaying(false);
        },
        onDismiss: () => {
          setIsPaying(false);
        },
      });
    } catch (err) {
      console.error("Checkout order creation error:", err);
      setNotice(err.message || "Failed to initiate Razorpay payment.");
      setIsPaying(false);
    }
  };

  return (
    <main className="CartMain">
      <div className="CartMain-container">
        <nav className="CartMain-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 11 9-8 9 8h-3v9h-5v-6h-3v6H6v-9z" />
            </svg>
          </Link>
          <span>/</span>
          <span>Shopping Cart</span>
        </nav>

        {notice && (
          <div className="CartMain-notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <div className="CartMain-layout">
          <div className="CartMain-leftColumn">
            <section className="CartMain-cartSection">
              <div className="CartMain-headingRow">
                <div>
                  <p className="CartMain-eyebrow">YOUR COLLECTION</p>
                  <h1 className="CartMain-title">Shopping Cart</h1>
                  <p className="CartMain-subtitle">
                    {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
                  </p>
                </div>

                {items.length > 0 && (
                  <button
                    type="button"
                    className="CartMain-clearButton"
                    onClick={handleClearCart}
                  >
                    <CartMainIcon name="trash" size={16} />
                    <span>Clear Cart</span>
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="CartMain-empty">
                  <div className="CartMain-emptyIcon">
                    <CartMainIcon name="cart" size={32} />
                  </div>
                  <h2>Your cart is waiting for art</h2>
                  <p>
                    Explore our collection and find an artwork that speaks to you.
                  </p>
                  <Link className="CartMain-primaryButton" to="/shop">
                    Explore Artworks
                  </Link>
                </div>
              ) : (
                <div className="CartMain-items">
                  {items.map((item) => (
                    <article className="CartMain-item" key={item.id}>
                      <label className="CartMain-selectWrap">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleSelection(item.id)}
                          aria-label={`Select ${item.name || item.title}`}
                        />
                        <span className="CartMain-customCheck">
                          <CartMainIcon name="check" size={14} />
                        </span>
                      </label>

                      <div
                        className="CartMain-productImageWrap"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const dest = item.slug
                            ? `/shop/${item.slug}`
                            : `/shop/${encodeURIComponent(item.name || item.title)}`;
                          navigate(dest);
                        }}
                      >
                        <img
                          className="CartMain-productImage"
                          src={formatImageUrl(item.image)}
                          alt={item.name || item.title}
                        />
                      </div>

                      <div className="CartMain-productInfo">
                        <h2
                          className="CartMain-productName"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const dest = item.slug
                              ? `/shop/${item.slug}`
                              : `/shop/${encodeURIComponent(item.name || item.title)}`;
                            navigate(dest);
                          }}
                        >
                          {item.name || item.title}
                        </h2>
                        <p className="CartMain-artist">By {item.artist}</p>

                        <div className="CartMain-tags">
                          {(item.tags || []).map((tag) => (
                            <span className="CartMain-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span
                          className={`CartMain-stock ${
                            item.inStock !== false ? "" : "CartMain-stockOut"
                          }`}
                        >
                          <span className="CartMain-stockDot" />
                          {item.inStock !== false ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <div className="CartMain-quantity">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name || item.title}`}
                        >
                          <CartMainIcon name="minus" size={14} />
                        </button>
                        <span aria-label="Quantity">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name || item.title}`}
                        >
                          <CartMainIcon name="plus" size={14} />
                        </button>
                      </div>

                      <div className="CartMain-itemPrice">
                        {formatINR(item.price * item.quantity)}
                      </div>

                      <button
                        type="button"
                        className="CartMain-removeButton"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name || item.title}`}
                        title="Remove item"
                      >
                        <CartMainIcon name="trash" size={17} />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Curated Recommendations from Database */}
            {availableRecommendations.length > 0 && (
              <section className="CartMain-recommendations">
                <div className="CartMain-recommendationHeading">
                  <div>
                    <p className="CartMain-eyebrow">CURATED FOR YOU</p>
                    <h2 className="CartMain-sectionTitle">You may also like</h2>
                  </div>

                  {availableRecommendations.length > 4 && (
                    <button
                      type="button"
                      className="CartMain-viewAll"
                      onClick={() => setShowAll((value) => !value)}
                    >
                      {showAll ? "Show less" : "View All"}
                      <CartMainIcon name="arrow" size={15} />
                    </button>
                  )}
                </div>

                <div className="CartMain-recommendationGrid">
                  {visibleRecommendations.map((artwork) => (
                    <article className="CartMain-artCard" key={artwork.id}>
                      <div className="CartMain-artImageWrap">
                        <img
                          className="CartMain-artImage"
                          src={artwork.image}
                          alt={artwork.name}
                          loading="lazy"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const dest = artwork.slug
                              ? `/shop/${artwork.slug}`
                              : `/shop/${encodeURIComponent(artwork.name)}`;
                            navigate(dest);
                          }}
                        />

                        <button
                          type="button"
                          className={`CartMain-favoriteButton ${
                            favorites.includes(artwork.id)
                              ? "CartMain-favoriteActive"
                              : ""
                          }`}
                          onClick={() => toggleFavorite(artwork.id)}
                          aria-label={
                            favorites.includes(artwork.id)
                              ? `Remove ${artwork.name} from favorites`
                              : `Add ${artwork.name} to favorites`
                          }
                        >
                          <CartMainIcon name="heart" size={17} />
                        </button>
                      </div>

                      <div className="CartMain-artCardBody">
                        <h3
                          className="CartMain-artName"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const dest = artwork.slug
                              ? `/shop/${artwork.slug}`
                              : `/shop/${encodeURIComponent(artwork.name)}`;
                            navigate(dest);
                          }}
                        >
                          {artwork.name}
                        </h3>
                        <p className="CartMain-artArtist">By {artwork.artist}</p>
                        <div className="CartMain-artCardBottom">
                          <span className="CartMain-artPrice">
                            {formatINR(artwork.price)}
                          </span>
                          <button
                            type="button"
                            className="CartMain-addButton"
                            onClick={() => handleAddRecommendation(artwork)}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="CartMain-summary">
            <div className="CartMain-summaryHeader">
              <span className="CartMain-summaryEyebrow">YOUR ORDER</span>
              <h2 className="CartMain-summaryTitle">Order Summary</h2>
            </div>

            <div className="CartMain-summaryRows">
              <div className="CartMain-summaryRow">
                <span>Items ({selectedItems.length})</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="CartMain-summaryRow">
                <span>Shipping</span>
                <span className="CartMain-freeTag">FREE</span>
              </div>
              <div className="CartMain-summaryRow">
                <span>Estimated Tax</span>
                <span className="CartMain-freeTag">Included (₹0)</span>
              </div>
            </div>

            <div className="CartMain-freeShippingPromo">
              <CartMainIcon name="truck" size={17} />
              <span>Free Express Shipping &amp; All Taxes Included</span>
            </div>

            <div className="CartMain-summaryTotal">
              <span>Total Amount</span>
              <strong>{formatINR(total)}</strong>
            </div>

            <button
              type="button"
              className="CartMain-checkoutButton"
              onClick={handleProceedToCheckout}
              disabled={items.length === 0}
            >
              <CartMainIcon name="lock" size={16} />
              Proceed to Checkout
            </button>

            <div className="CartMain-orDivider">
              <span />
              <small>OR</small>
              <span />
            </div>

            <Link to="/shop" className="CartMain-continueButton">
              Continue Shopping
            </Link>

            <div className="CartMain-benefits">
              <div className="CartMain-benefit">
                <CartMainIcon name="truck" size={20} />
                <span>Free express shipping on all orders</span>
              </div>
              <div className="CartMain-benefit">
                <CartMainIcon name="shield" size={20} />
                <span>Secure payment gateway</span>
              </div>
              <div className="CartMain-benefit">
                <CartMainIcon name="return" size={20} />
                <span>7-day easy returns</span>
              </div>
              <div className="CartMain-benefit">
                <CartMainIcon name="award" size={20} />
                <span>Authenticity guaranteed</span>
              </div>
            </div>

            <p className="CartMain-secureNote">
              Your collection is protected with secure checkout.
            </p>
          </aside>
        </div>
      </div>

      {checkoutOpen && (
        <div
          className="CartMain-modalBackdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCheckoutOpen(false);
          }}
        >
          <section
            className="CartMain-checkoutModal CartMain-checkoutModal--split"
            role="dialog"
            aria-modal="true"
            aria-labelledby="CartMain-checkoutTitle"
          >
            <button
              type="button"
              className="CartMain-modalClose"
              onClick={() => setCheckoutOpen(false)}
              aria-label="Close checkout"
            >
              ×
            </button>

            <form
              className="CartMain-checkoutModalGrid"
              onSubmit={handleCheckout}
            >
              {/* ============ LEFT COLUMN: DELIVERY ADDRESS ============ */}
              <div className="CartMain-checkoutLeft">
                <p className="CartMain-eyebrow">SHIPPING DESTINATION</p>
                <h2 id="CartMain-checkoutTitle">Delivery Address</h2>
                <p className="CartMain-modalDescription">
                  Your artwork will be securely packaged and delivered to this address.
                </p>

                {/* Clean Address Display Card (No form inputs when address is saved) */}
                {savedAddresses.length > 0 && (
                  <div className="CartMain-selectedAddressDisplay">
                    {(() => {
                      const activeAddr =
                        savedAddresses.find((a) => (a._id || a.id) === selectedAddressId) ||
                        savedAddresses.find((a) => a.isDefault) ||
                        savedAddresses[0];

                      return (
                        <div className="CartMain-deliveryCard">
                          <div className="CartMain-deliveryCardTop">
                            <div className="CartMain-deliveryCardBadges">
                              <span className="CartMain-addrTypeBadge">
                                {activeAddr.addressType === "Office" ? (
                                  <Briefcase size={12} />
                                ) : activeAddr.addressType === "Studio" ? (
                                  <Sparkles size={12} />
                                ) : (
                                  <Home size={12} />
                                )}
                                <span>{activeAddr.addressType || "Home"}</span>
                              </span>
                              {activeAddr.isDefault && (
                                <span className="CartMain-addrDefaultBadge">Default</span>
                              )}
                            </div>
                            <span className="CartMain-deliveryVerifiedTag">
                              <Check size={12} /> Selected Destination
                            </span>
                          </div>

                          <h3 className="CartMain-deliveryRecipient">{activeAddr.fullName}</h3>

                          <div className="CartMain-deliveryInfoRow">
                            <MapPin size={16} color="#d08a24" className="CartMain-infoIcon" />
                            <p className="CartMain-deliveryAddressText">
                              {[activeAddr.street, activeAddr.city, activeAddr.state].filter(Boolean).join(", ")}
                              {activeAddr.pinCode ? ` – ${activeAddr.pinCode}` : ""}
                              {activeAddr.country && activeAddr.country !== "India" ? `, ${activeAddr.country}` : ""}
                            </p>
                          </div>

                          <div className="CartMain-deliveryMetaGrid">
                            <div className="CartMain-deliveryMetaItem">
                              <span className="CartMain-infoLabel">Phone:</span>
                              <strong>{activeAddr.phone}</strong>
                            </div>
                            <div className="CartMain-deliveryMetaItem">
                              <span className="CartMain-infoLabel">Email:</span>
                              <span>{user?.email || customer.email}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Switch address selector if user has more than 1 saved address */}
                    {savedAddresses.length > 1 && (
                      <div className="CartMain-otherAddressesWrap">
                        <span className="CartMain-otherAddrTitle">Switch Delivery Address:</span>
                        <div className="CartMain-otherAddrList">
                          {savedAddresses.map((addr) => {
                            const addrId = addr._id || addr.id;
                            const isSelected = selectedAddressId === addrId;
                            return (
                              <button
                                key={addrId}
                                type="button"
                                className={`CartMain-otherAddrPill ${
                                  isSelected ? "CartMain-otherAddrPill--active" : ""
                                }`}
                                onClick={() => handleSelectSavedAddress(addr)}
                              >
                                <span
                                  className={`CartMain-customRadio ${
                                    isSelected ? "CartMain-customRadio--checked" : ""
                                  }`}
                                >
                                  {isSelected && <span className="CartMain-radioDot" />}
                                </span>
                                <span>
                                  {addr.addressType || "Home"} – {addr.city} ({addr.state || addr.street})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="CartMain-addressActionsRow">
                      <button
                        type="button"
                        className="CartMain-addNewAddrBtn"
                        onClick={() => {
                          setCheckoutOpen(false);
                          navigate("/my-account?tab=addresses&add=true", {
                            state: {
                              from: "/cart?checkout=true",
                              openAdd: true,
                            },
                          });
                        }}
                      >
                        <Plus size={14} />
                        <span>Deliver to a Different Address</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* If user has no saved addresses, direct them to add address */}
                {savedAddresses.length === 0 && (
                  <div className="CartMain-noAddressPrompt">
                    <p style={{ color: "#7a6e60", fontSize: "13.5px", margin: "0 0 12px" }}>
                      No delivery address saved in your account yet.
                    </p>
                    <button
                      type="button"
                      className="CartMain-addNewAddrBtn"
                      onClick={() => {
                        setCheckoutOpen(false);
                        navigate("/my-account?tab=addresses&add=true", {
                          state: {
                            from: "/cart?checkout=true",
                            openAdd: true,
                          },
                        });
                      }}
                    >
                      <Plus size={14} />
                      <span>Add Delivery Address</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ============ RIGHT COLUMN: ORDER SUMMARY ============ */}
              <div className="CartMain-checkoutRight">
                <div className="CartMain-modalSummaryCard">
                  <div className="CartMain-modalSummaryHead">
                    <div>
                      <p className="CartMain-summaryEyebrow">YOUR ACQUISITIONS</p>
                      <h3 className="CartMain-summaryTitle">Order Summary</h3>
                    </div>
                    <span className="CartMain-itemCountBadge">
                      {selectedItems.length} {selectedItems.length === 1 ? "Artwork" : "Artworks"}
                    </span>
                  </div>

                  {/* Artwork Items list */}
                  <div className="CartMain-modalItemsList">
                    {selectedItems.map((item) => (
                      <div key={item.id || item._id} className="CartMain-modalItemRow">
                        <div className="CartMain-modalItemThumb">
                          <img
                            src={formatImageUrl(item.image)}
                            alt={item.name || item.title}
                          />
                        </div>
                        <div className="CartMain-modalItemInfo">
                          <h4 className="CartMain-modalItemTitle">
                            {item.name || item.title}
                          </h4>
                          <p className="CartMain-modalItemArtist">
                            By {item.artist || "Art & Culture"}
                          </p>
                          <div className="CartMain-modalItemMeta">
                            <span>Qty: {item.quantity || 1}</span>
                            <strong className="CartMain-modalItemPrice">
                              {formatINR((item.price || 0) * (item.quantity || 1))}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div className="CartMain-modalBreakdown">
                    <div className="CartMain-breakdownRow">
                      <span>Items Subtotal</span>
                      <strong>{formatINR(subtotal)}</strong>
                    </div>
                    <div className="CartMain-breakdownRow">
                      <span>Shipping</span>
                      <span className="CartMain-freeTag">Free Express Delivery</span>
                    </div>
                    <div className="CartMain-breakdownRow">
                      <span>Tax (GST)</span>
                      <span className="CartMain-freeTag">Included (₹0)</span>
                    </div>
                  </div>

                  {/* Total row */}
                  <div className="CartMain-modalTotalRow">
                    <div>
                      <span className="CartMain-modalTotalLabel">Total Amount</span>
                      <small className="CartMain-modalTotalSubtext">
                        Free delivery &amp; taxes included
                      </small>
                    </div>
                    <strong className="CartMain-modalTotalAmount">
                      {formatINR(total)}
                    </strong>
                  </div>

                  {/* Proceed to Pay Button */}
                  <button
                    type="submit"
                    className="CartMain-checkoutButton CartMain-checkoutButton--pay"
                    disabled={isPaying}
                  >
                    <CartMainIcon name="lock" size={16} />
                    <span>
                      {isPaying
                        ? "Connecting to Razorpay..."
                        : `Proceed to Pay ${formatINR(total)}`}
                    </span>
                  </button>

                  {/* Trust badges */}
                  <div className="CartMain-modalTrustList">
                    <div className="CartMain-trustItem">
                      <CartMainIcon name="shield" size={15} />
                      <span>Razorpay 256-bit Encrypted Checkout</span>
                    </div>
                    <div className="CartMain-trustItem">
                      <CartMainIcon name="award" size={15} />
                      <span>Certified Authentic Indian Heritage Art</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* ============ ORDER SUCCESS CONFIRMATION MODAL ============ */}
      {orderSuccess && (
        <div className="CartMain-modalBackdrop">
          <section
            className="CartMain-checkoutModal CartMain-successModal"
            role="dialog"
            aria-modal="true"
          >
            <div className="CartMain-successIcon">✓</div>
            <p className="CartMain-eyebrow">PAYMENT CONFIRMED</p>
            <h2 id="CartMain-checkoutTitle">Art Acquisition Confirmed!</h2>
            <p className="CartMain-modalDescription">
              Thank you,{" "}
              <strong>
                {orderSuccess.customer?.fullName || customer.name}
              </strong>
              . Your payment has been received and verified securely via Razorpay.
            </p>

            <div className="CartMain-successDetails">
              <div className="CartMain-successRow">
                <span>Order Reference:</span>
                <strong>
                  {orderSuccess.orderNumber || orderSuccess.orderId}
                </strong>
              </div>
              <div className="CartMain-successRow">
                <span>Amount Paid:</span>
                <strong style={{ color: "#1b8146" }}>
                  {formatINR(orderSuccess.totalAmount || total)}
                </strong>
              </div>
              {orderSuccess.payment?.razorpayPaymentId && (
                <div className="CartMain-successRow">
                  <span>Razorpay Payment ID:</span>
                  <small style={{ wordBreak: "break-all" }}>
                    {orderSuccess.payment.razorpayPaymentId}
                  </small>
                </div>
              )}
              <div className="CartMain-successRow">
                <span>Shipping Status:</span>
                <span className="CartMain-freeTag">Free Express Delivery</span>
              </div>
              <div className="CartMain-successRow">
                <span>Delivery To:</span>
                <small style={{ wordBreak: "break-word" }}>
                  {orderSuccess.customer?.address || customer.address}
                </small>
              </div>
            </div>

            <div className="CartMain-successActions">
              <button
                type="button"
                className="CartMain-checkoutButton"
                onClick={() => {
                  setOrderSuccess(null);
                  navigate("/my-account?tab=orders");
                }}
              >
                View in My Orders
              </button>
              <button
                type="button"
                className="CartMain-continueButton"
                onClick={() => {
                  setOrderSuccess(null);
                  navigate("/shop");
                }}
              >
                Continue Art Collection
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default CartMain;
