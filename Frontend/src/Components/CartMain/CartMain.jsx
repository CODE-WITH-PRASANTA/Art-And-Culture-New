
import React, { useMemo, useState } from "react";
import "./CartMain.css";

import shop1 from "../../assets/shop-details-1.webp";
import shop2 from "../../assets/shop-details-2.webp";
import shop3 from "../../assets/shop-details-3.webp";
import shop4 from "../../assets/shop-details-4.webp";
import shop5 from "../../assets/shop-details-2.webp";
import shop6 from "../../assets/shop-details-1.webp";

const initialItems = [
  {
    id: 1,
    name: "Whispers of Colors in Silent Shadows",
    artist: "Henri Matisse",
    price: 34000,
    image: shop1,
    tags: ["Painting", "Street Art", "Colorful"],
    quantity: 1,
    selected: true,
    inStock: true,
  },
  {
    id: 2,
    name: "Harmony Emerges in Chaos of Creation",
    artist: "Vincent van Gogh",
    price: 28500,
    image: shop2,
    tags: ["Oil Painting", "Abstract", "Nature"],
    quantity: 1,
    selected: true,
    inStock: true,
  },
  {
    id: 3,
    name: "Serenity by the Shore",
    artist: "Claude Monet",
    price: 42000,
    image: shop3,
    tags: ["Impressionism", "Landscape", "Classic"],
    quantity: 1,
    selected: true,
    inStock: true,
  },
];

const recommendations = [
  {
    id: 101,
    name: "Sunlit Countryside",
    artist: "Pierre-Auguste Renoir",
    price: 31000,
    image: shop4,
    tags: ["Landscape", "Nature"],
  },
  {
    id: 102,
    name: "The Old Street",
    artist: "Edouard Cortes",
    price: 27500,
    image: shop5,
    tags: ["Cityscape", "Classic"],
  },
  {
    id: 103,
    name: "Floral Whispers",
    artist: "Claude Monet",
    price: 29000,
    image: shop6,
    tags: ["Floral", "Impressionism"],
  },
  {
    id: 104,
    name: "Golden Reflections",
    artist: "J. M. W. Turner",
    price: 36000,
    image: shop3,
    tags: ["Seascape", "Classic"],
  },
  {
    id: 105,
    name: "Colors of the Old Town",
    artist: "Art & Culture Collection",
    price: 32500,
    image: shop1,
    tags: ["Architecture", "Colorful"],
  },
  {
    id: 106,
    name: "A Garden in Bloom",
    artist: "Art & Culture Collection",
    price: 26500,
    image: shop2,
    tags: ["Flowers", "Nature"],
  },
];

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

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
  const [items, setItems] = useState(initialItems);
  const [favorites, setFavorites] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const selectedItems = useMemo(
    () => items.filter((item) => item.selected),
    [items]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 50000 ? 0 : 1200;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const updateItem = (id, updater) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? updater(item) : item
      )
    );
    setNotice("");
  };

  const changeQuantity = (id, direction) => {
    updateItem(id, (item) => ({
      ...item,
      quantity: Math.max(1, item.quantity + direction),
    }));
  };

  const removeItem = (id) => {
    const removed = items.find((item) => item.id === id);
    setItems((current) => current.filter((item) => item.id !== id));
    setNotice(removed ? `${removed.name} removed from your cart.` : "");
  };

  const clearCart = () => {
    if (items.length === 0) return;
    setItems([]);
    setNotice("Your cart has been cleared.");
  };

  const toggleSelection = (id) => {
    updateItem(id, (item) => ({
      ...item,
      selected: !item.selected,
    }));
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  };

  const addToCart = (artwork) => {
    const existing = items.find((item) => item.id === artwork.id);

    if (existing) {
      setItems((current) =>
        current.map((item) =>
          item.id === artwork.id
            ? { ...item, quantity: item.quantity + 1, selected: true }
            : item
        )
      );
    } else {
      setItems((current) => [
        ...current,
        {
          ...artwork,
          quantity: 1,
          selected: true,
          inStock: true,
        },
      ]);
    }

    setNotice(`${artwork.name} added to your cart.`);
  };

  const handleCheckout = (event) => {
    event.preventDefault();

    if (selectedItems.length === 0) {
      setNotice("Please select at least one artwork to continue.");
      return;
    }

    setNotice(
      `Order details prepared for ${customer.name}. Total: ${formatINR(total)}. Connect your payment gateway to complete payment.`
    );
    setCheckoutOpen(false);
  };

  const visibleRecommendations = showAll
    ? recommendations
    : recommendations.slice(0, 4);

  return (
    <main className="CartMain">
      <div className="CartMain-container">
        <nav className="CartMain-breadcrumb" aria-label="Breadcrumb">
          <a href="/" aria-label="Home">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 11 9-8 9 8h-3v9h-5v-6h-3v6H6v-9z" />
            </svg>
          </a>
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
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                  </p>
                </div>

                {items.length > 0 && (
                  <button
                    type="button"
                    className="CartMain-clearButton"
                    onClick={clearCart}
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
                  <a className="CartMain-primaryButton" href="/shop">
                    Explore Artworks
                  </a>
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
                          aria-label={`Select ${item.name}`}
                        />
                        <span className="CartMain-customCheck">
                          <CartMainIcon name="check" size={14} />
                        </span>
                      </label>

                      <div className="CartMain-productImageWrap">
                        <img
                          className="CartMain-productImage"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      <div className="CartMain-productInfo">
                        <h2 className="CartMain-productName">{item.name}</h2>
                        <p className="CartMain-artist">By {item.artist}</p>

                        <div className="CartMain-tags">
                          {item.tags.map((tag) => (
                            <span className="CartMain-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span
                          className={`CartMain-stock ${
                            item.inStock ? "" : "CartMain-stockOut"
                          }`}
                        >
                          <span className="CartMain-stockDot" />
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <div className="CartMain-quantity">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <CartMainIcon name="minus" size={14} />
                        </button>
                        <span aria-label="Quantity">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
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
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        title="Remove item"
                      >
                        <CartMainIcon name="trash" size={17} />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="CartMain-recommendations">
              <div className="CartMain-recommendationHeading">
                <div>
                  <p className="CartMain-eyebrow">CURATED FOR YOU</p>
                  <h2 className="CartMain-sectionTitle">You may also like</h2>
                </div>

                <button
                  type="button"
                  className="CartMain-viewAll"
                  onClick={() => setShowAll((value) => !value)}
                >
                  {showAll ? "Show less" : "View All"}
                  <CartMainIcon
                    name="arrow"
                    size={15}
                  />
                </button>
              </div>

              <div className="CartMain-recommendationGrid">
                {visibleRecommendations.map((artwork) => (
                  <article
                    className="CartMain-artCard"
                    key={artwork.id}
                  >
                    <div className="CartMain-artImageWrap">
                      <img
                        className="CartMain-artImage"
                        src={artwork.image}
                        alt={artwork.name}
                        loading="lazy"
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
                        <CartMainIcon
                          name="heart"
                          size={17}
                        />
                      </button>
                    </div>

                    <div className="CartMain-artCardBody">
                      <h3 className="CartMain-artName">{artwork.name}</h3>
                      <p className="CartMain-artArtist">By {artwork.artist}</p>
                      <div className="CartMain-artCardBottom">
                        <span className="CartMain-artPrice">
                          {formatINR(artwork.price)}
                        </span>
                        <button
                          type="button"
                          className="CartMain-addButton"
                          onClick={() => addToCart(artwork)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
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
                <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
              </div>
              <div className="CartMain-summaryRow">
                <span>Tax (18%)</span>
                <span>{formatINR(tax)}</span>
              </div>
            </div>

            {subtotal > 0 && subtotal < 50000 && (
              <p className="CartMain-shippingHint">
                Add {formatINR(50000 - subtotal)} more for free shipping.
              </p>
            )}

            <div className="CartMain-summaryTotal">
              <span>Total Amount</span>
              <strong>{formatINR(total)}</strong>
            </div>

            <button
              type="button"
              className="CartMain-checkoutButton"
              onClick={() => {
                if (selectedItems.length === 0) {
                  setNotice("Please select at least one artwork to continue.");
                  return;
                }
                setCheckoutOpen(true);
              }}
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

            <a href="/shop" className="CartMain-continueButton">
              Continue Shopping
            </a>

            <div className="CartMain-benefits">
              <div className="CartMain-benefit">
                <CartMainIcon name="truck" size={20} />
                <span>Free shipping on orders over ₹50,000</span>
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
            className="CartMain-checkoutModal"
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

            <p className="CartMain-eyebrow">ALMOST YOURS</p>
            <h2 id="CartMain-checkoutTitle">Delivery Details</h2>
            <p className="CartMain-modalDescription">
              Enter your details to prepare your artwork order.
            </p>

            <form
              className="CartMain-checkoutForm"
              onSubmit={handleCheckout}
            >
              <label>
                Full name
                <input
                  type="text"
                  value={customer.name}
                  onChange={(event) =>
                    setCustomer({ ...customer, name: event.target.value })
                  }
                  placeholder="Your full name"
                  required
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) =>
                    setCustomer({ ...customer, email: event.target.value })
                  }
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(event) =>
                    setCustomer({ ...customer, phone: event.target.value })
                  }
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </label>

              <label>
                Delivery address
                <textarea
                  value={customer.address}
                  onChange={(event) =>
                    setCustomer({ ...customer, address: event.target.value })
                  }
                  placeholder="House number, street, city, PIN code"
                  rows={3}
                  required
                />
              </label>

              <div className="CartMain-modalTotal">
                <span>Order total</span>
                <strong>{formatINR(total)}</strong>
              </div>

              <button
                type="submit"
                className="CartMain-checkoutButton"
              >
                Confirm Order Details
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

export default CartMain;
