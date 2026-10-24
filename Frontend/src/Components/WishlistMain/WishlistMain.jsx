
import React, { useMemo, useState } from "react";
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

import shop1 from "../../assets/shop-details-1.webp";
import shop2 from "../../assets/shop-details-2.webp";


import "./WishlistMain.css";

const initialWishlist = [
  {
    id: 1,
    title: "Whispers of Colors in Silent Shadows",
    artist: "Henri Matisse",
    price: 34000,
    category: ["Painting", "Street Art", "Colorful"],
    image: shop1,
    stock: true,
    description:
      "A vibrant artwork celebrating color, architecture, and the beauty of everyday life.",
  },
  {
    id: 2,
    title: "Harmony Emerges in Chaos of Creation",
    artist: "Vincent van Gogh",
    price: 28500,
    category: ["Oil Painting", "Abstract", "Nature"],
    image: shop2,
    stock: true,
    description:
      "An expressive floral composition inspired by nature, texture, and artistic freedom.",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const WishlistMain = ({
  initialItems = initialWishlist,
  onAddToCart,
  onViewDetails,
  onRemove,
}) => {
  const navigate = useNavigate();

  const [items, setItems] = useState(initialItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("list");
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const sortedItems = useMemo(() => {
    const result = [...items];

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [items, sortBy]);

  const toggleSelected = (id) => {
    setSelectedItems((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((previous) =>
      previous.length === items.length
        ? []
        : items.map((item) => item.id)
    );
  };

  const removeItem = (id) => {
    const removedItem = items.find((item) => item.id === id);

    if (!removedItem) return;

    setItems((previous) => previous.filter((item) => item.id !== id));
    setSelectedItems((previous) =>
      previous.filter((itemId) => itemId !== id)
    );
    setRemovingId(null);
    setMessage("Artwork removed from your wishlist.");

    onRemove?.(removedItem);
  };

  const removeSelected = () => {
    if (!selectedItems.length) {
      setMessage("Select at least one artwork to remove.");
      return;
    }

    const removedItems = items.filter((item) =>
      selectedItems.includes(item.id)
    );

    setItems((previous) =>
      previous.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
    setMessage(`${removedItems.length} artwork(s) removed from wishlist.`);

    removedItems.forEach((item) => onRemove?.(item));
  };

  const addToCart = async (item) => {
    if (!item.stock) {
      setMessage("This artwork is currently out of stock.");
      return;
    }

    try {
      if (onAddToCart) {
        await onAddToCart(item);
      } else {
        setCartItems((previous) =>
          previous.includes(item.id)
            ? previous
            : [...previous, item.id]
        );
      }

      setMessage(`${item.title} added to your cart.`);
    } catch {
      setMessage("Unable to add this artwork. Please try again.");
    }
  };

  const viewDetails = (item) => {
    if (onViewDetails) {
      onViewDetails(item);
      return;
    }

    navigate(`/shop-details/${item.id}`, {
      state: { product: item },
    });
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
          <div
            className="WishlistMain-message"
            role="status"
          >
            <Check size={17} />
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="WishlistMain-panel">
          <div className="WishlistMain-toolbar">
            <div className="WishlistMain-count">
              <h2>
                {items.length}{" "}
                {items.length === 1 ? "Item" : "Items"} in your wishlist
              </h2>
              {selectedItems.length > 0 && (
                <span className="WishlistMain-selectedCount">
                  {selectedItems.length} selected
                </span>
              )}
            </div>

            <div className="WishlistMain-toolbarActions">
              {items.length > 0 && (
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

          {items.length > 0 ? (
            <div
              className={`WishlistMain-items WishlistMain-items-${viewMode}`}
            >
              {sortedItems.map((item, index) => {
                const isInCart = cartItems.includes(item.id);

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
                        {item.category.map((category) => (
                          <span key={category}>{category}</span>
                        ))}
                      </div>

                      <strong className="WishlistMain-price">
                        {formatPrice(item.price)}
                      </strong>
                    </div>

                    <div className="WishlistMain-productActions">
                      <span
                        className={
                          item.stock
                            ? "WishlistMain-stock"
                            : "WishlistMain-stock WishlistMain-stockOut"
                        }
                      >
                        <span />
                        {item.stock ? "In Stock" : "Out of Stock"}
                      </span>

                      <button
                        type="button"
                        className={
                          isInCart
                            ? "WishlistMain-cartBtn WishlistMain-cartBtnAdded"
                            : "WishlistMain-cartBtn"
                        }
                        onClick={() => addToCart(item)}
                        disabled={!item.stock}
                      >
                        {isInCart ? (
                          <Check size={16} />
                        ) : (
                          <ShoppingCart size={16} />
                        )}
                        {isInCart ? "Added to Cart" : "Add to Cart"}
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

          {items.length > 0 && (
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

          {items.length > 0 && (
            <div className="WishlistMain-bottomActions">
              <label className="WishlistMain-selectAll">
                <input
                  type="checkbox"
                  checked={
                    items.length > 0 &&
                    selectedItems.length === items.length
                  }
                  onChange={toggleSelectAll}
                />
                Select all artworks
              </label>

              <span>
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"} added to cart
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WishlistMain;
