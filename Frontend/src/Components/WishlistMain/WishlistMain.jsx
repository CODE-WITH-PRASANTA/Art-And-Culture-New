import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Trash2,
  ShoppingCart,
  ArrowRight,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Check,
  ShoppingBag,
  X,
} from "lucide-react";

import "./WishlistMain.css";
import { toArtSlug } from "../../utils/slug";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const WishlistMain = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, removeMultiple } = useWishlist();

  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("list");
  const { isInCart, addToCart: addItemToCart } = useCart();
  const [message, setMessage] = useState("");

  const messageTimerRef = useRef(null);

  const showNotification = (text) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    setMessage(text);
    messageTimerRef.current = setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  const dismissMessage = () => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    setMessage("");
  };

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const sortedItems = useMemo(() => {
    const result = [...wishlist];

    if (sortBy === "price-low") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [wishlist, sortBy]);

  const toggleSelected = (id) => {
    setSelectedItems((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  };

  const removeItem = (id) => {
    const item = wishlist.find((i) => i.id === id || i._id === id);
    removeFromWishlist(id);
    setSelectedItems((prev) => prev.filter((i) => i !== id));
    showNotification(`"${item ? item.title : "Artwork"}" removed from your wishlist.`);
  };

  const removeSelected = () => {
    if (!selectedItems.length) {
      showNotification("Select at least one artwork to remove.");
      return;
    }
    const count = selectedItems.length;
    removeMultiple(selectedItems);
    setSelectedItems([]);
    showNotification(`${count} artwork(s) removed from wishlist.`);
  };

  const addToCart = async (item) => {
    if (item.stock === false) {
      showNotification("This artwork is currently out of stock.");
      return;
    }

    try {
      addItemToCart(item, 1);
      if (onAddToCart) await onAddToCart(item);
      showNotification(`"${item.title}" added to your cart.`);
    } catch {
      showNotification("Unable to add this artwork. Please try again.");
    }
  };

  const viewDetails = (item) => {
    navigate(`/shop/${toArtSlug(item.title, item.id)}`);
  };

  const exploreCollection = () => {
    navigate("/shop");
  };

  return (
    <section className="WishlistMain">
      <div className="WishlistMain-container">
        <div className="WishlistMain-breadcrumb">
          <a href="/" aria-label="Home">
            Home
          </a>
          <span>/</span>
          <span>Wishlist</span>
        </div>

        {message && (
          <div className="WishlistMain-message" role="status" key={message}>
            <div className="WishlistMain-messageContent">
              <Check size={18} className="WishlistMain-messageIcon" />
              <span>{message}</span>
            </div>
            <button
              type="button"
              onClick={dismissMessage}
              aria-label="Dismiss message"
              title="Dismiss"
            >
              <X size={16} />
            </button>
            <div className="WishlistMain-messageTimeline" />
          </div>
        )}

        <div className="WishlistMain-panel">
          <div className="WishlistMain-toolbar">
            <div className="WishlistMain-count">
              <h2>
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "Item" : "Items"} in your wishlist
              </h2>
              {selectedItems.length > 0 && (
                <span className="WishlistMain-selectedCount">
                  {selectedItems.length} selected
                </span>
              )}
            </div>

            <div className="WishlistMain-toolbarActions">
              {wishlist.length > 0 && (
                <>
                  {selectedItems.length > 0 && (
                    <button
                      type="button"
                      className="WishlistMain-removeSelected"
                      onClick={removeSelected}
                    >
                      <Trash2 size={15} />
                      Remove selected
                    </button>
                  )}

                  <label className="WishlistMain-sort">
                    <SlidersHorizontal size={16} />
                    <span>Sort by</span>
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      aria-label="Sort wishlist"
                    >
                      <option value="default">Default</option>
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </label>

                  <div className="WishlistMain-viewToggle">
                    <button
                      type="button"
                      className={
                        viewMode === "grid"
                          ? "WishlistMain-viewBtn WishlistMain-viewBtnActive"
                          : "WishlistMain-viewBtn"
                      }
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                      aria-pressed={viewMode === "grid"}
                    >
                      <LayoutGrid size={17} />
                    </button>

                    <button
                      type="button"
                      className={
                        viewMode === "list"
                          ? "WishlistMain-viewBtn WishlistMain-viewBtnActive"
                          : "WishlistMain-viewBtn"
                      }
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                      aria-pressed={viewMode === "list"}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {wishlist.length > 0 ? (
            <div
              className={`WishlistMain-items WishlistMain-items-${viewMode}`}
            >
              {sortedItems.map((item, index) => {
                const itemInCart = isInCart(item.id);
                const categories = Array.isArray(item.category)
                  ? item.category
                  : [item.category || "Artwork"];

                return (
                  <article
                    className="WishlistMain-item"
                    key={item.id}
                    style={{ "--item-index": index }}
                  >
                    <div className="WishlistMain-itemSelect">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelected(item.id)}
                        aria-label={`Select ${item.title}`}
                      />

                      <button
                        type="button"
                        className="WishlistMain-removeBtn"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="WishlistMain-imageButton"
                      onClick={() => viewDetails(item)}
                      aria-label={`View ${item.title}`}
                    >
                      <img
                        className="WishlistMain-image"
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85";
                        }}
                      />
                    </button>

                    <div className="WishlistMain-productInfo">
                      <button
                        type="button"
                        className="WishlistMain-productTitle"
                        onClick={() => viewDetails(item)}
                      >
                        {item.title}
                      </button>

                      <p className="WishlistMain-artist">
                        By {item.artist}
                      </p>

                      <div className="WishlistMain-tags">
                        {categories.map((category, catIdx) => (
                          <span key={`${category}-${catIdx}`}>{category}</span>
                        ))}
                      </div>

                      <strong className="WishlistMain-price">
                        {formatPrice(item.price)}
                      </strong>
                    </div>

                    <div className="WishlistMain-productActions">
                      <span
                        className={
                          item.stock !== false
                            ? "WishlistMain-stock"
                            : "WishlistMain-stock WishlistMain-stockOut"
                        }
                      >
                        <span />
                        {item.stock !== false ? "In Stock" : "Out of Stock"}
                      </span>

                      <button
                        type="button"
                        className={
                          itemInCart
                            ? "WishlistMain-cartBtn WishlistMain-cartBtnAdded"
                            : "WishlistMain-cartBtn"
                        }
                        onClick={() => addToCart(item)}
                        disabled={item.stock === false}
                      >
                        {itemInCart ? (
                          <Check size={16} />
                        ) : (
                          <ShoppingCart size={16} />
                        )}
                        {itemInCart ? "Added to Cart" : "Add to Cart"}
                      </button>

                      <button
                        type="button"
                        className="WishlistMain-detailsBtn"
                        onClick={() => viewDetails(item)}
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="WishlistMain-empty">
              <div className="WishlistMain-emptyIcon">
                <Heart size={34} strokeWidth={1.4} />
              </div>
              <h3>Your wishlist is waiting for inspiration</h3>
              <p>
                Save the artworks you love and find them here whenever
                you return.
              </p>
              <button
                type="button"
                className="WishlistMain-exploreBtn"
                onClick={exploreCollection}
              >
                Explore Collection <ArrowRight size={17} />
              </button>
            </div>
          )}

          {wishlist.length > 0 && (
            <div className="WishlistMain-footer">
              <div className="WishlistMain-footerIcon">
                <ShoppingBag size={25} strokeWidth={1.5} />
              </div>

              <div className="WishlistMain-footerText">
                <h3>Discover more inspiring artworks</h3>
                <p>
                  Explore new collections and add more to your wishlist.
                </p>
              </div>

              <button
                type="button"
                className="WishlistMain-exploreBtn"
                onClick={exploreCollection}
              >
                Explore Collection <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishlistMain;
