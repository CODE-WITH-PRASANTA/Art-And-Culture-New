
import React, { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaCheck,
  FaChevronRight,
  FaChevronLeft,
  FaSearchPlus,
  FaPalette,
  FaTruck,
  FaUndoAlt,
  FaCertificate,
} from "react-icons/fa";

import "./CollectionDetailsOne.css";

const CollectionDetailsOne = () => {
  const collection = {
    title: "Where Imagination Meets the Canvas",
    artist: "Frida Kahlo",
    category: "Contemporary Art",
    condition: "Original Artwork",
    price: 344,
    originalPrice: 450,
    description:
      "Bring creativity and color into your space with this beautiful floral artwork. Inspired by expressive brushwork, vibrant blossoms, and the charm of hand-painted details, this piece creates a warm and inviting atmosphere in any room.",
    dimensions: "60 × 90 cm",
    medium: "Premium canvas print",
    availability: "In Stock",
  };

  const images = [
    {
      src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
      alt: "Colorful floral artwork",
    },
    {
      src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=85",
      alt: "Framed fine art painting",
    },
    {
      src: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85",
      alt: "Expressive contemporary artwork",
    },
    {
      src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=85",
      alt: "Colorful abstract canvas painting",
    },
  ];

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [zoomOpen, setZoomOpen] = useState(false);

  const discount = Math.round(
    ((collection.originalPrice - collection.price) /
      collection.originalPrice) *
      100
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  const changeImage = (direction) => {
    setActiveImage((current) => {
      return (
        (current + direction + images.length) % images.length
      );
    });
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: "collection-frida-floral",
      title: collection.title,
      artist: collection.artist,
      price: collection.price,
      quantity,
      image: images[0].src,
    };

    try {
      const existingCart = JSON.parse(
        localStorage.getItem("artmart-cart") || "[]"
      );

      const cart = Array.isArray(existingCart) ? existingCart : [];
      const existingItem = cart.find((item) => item.id === cartItem.id);

      const updatedCart = existingItem
        ? cart.map((item) =>
            item.id === cartItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...cart, cartItem];

      localStorage.setItem("artmart-cart", JSON.stringify(updatedCart));

      setCartMessage(
        `${quantity} ${quantity === 1 ? "item" : "items"} added to your cart.`
      );
    } catch {
      setCartMessage("Unable to save your cart in this browser.");
    }
  };

  return (
    <section className="CollectionDetailsOne">
      <div className="CollectionDetailsOne-container">
        {/* ================= IMAGE GALLERY ================= */}
        <div className="CollectionDetailsOne-gallery">
          <div className="CollectionDetailsOne-main-image-wrapper">
            <img
              key={images[activeImage].src}
              src={images[activeImage].src}
              alt={images[activeImage].alt}
              className="CollectionDetailsOne-main-image"
            />

            <button
              type="button"
              className="CollectionDetailsOne-zoom-button"
              aria-label="Zoom artwork"
              onClick={() => setZoomOpen(true)}
            >
              <FaSearchPlus />
            </button>

            <button
              type="button"
              className="CollectionDetailsOne-gallery-arrow CollectionDetailsOne-gallery-arrow--left"
              onClick={() => changeImage(-1)}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>

            <button
              type="button"
              className="CollectionDetailsOne-gallery-arrow CollectionDetailsOne-gallery-arrow--right"
              onClick={() => changeImage(1)}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="CollectionDetailsOne-thumbnails">
            {images.map((image, index) => (
              <button
                type="button"
                key={image.src}
                className={`CollectionDetailsOne-thumbnail ${
                  activeImage === index
                    ? "CollectionDetailsOne-thumbnail--active"
                    : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View artwork image ${index + 1}`}
                aria-pressed={activeImage === index}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* ================= COLLECTION DETAILS ================= */}
        <div className="CollectionDetailsOne-information">
          <div className="CollectionDetailsOne-heading-row">
            <div>
              <span className="CollectionDetailsOne-eyebrow">
                {collection.category}
              </span>

              <h1 className="CollectionDetailsOne-title">
                {collection.title}
              </h1>
            </div>

            <button
              type="button"
              className={`CollectionDetailsOne-wishlist-icon ${
                isWishlisted
                  ? "CollectionDetailsOne-wishlist-icon--active"
                  : ""
              }`}
              onClick={() => setIsWishlisted((previous) => !previous)}
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              aria-pressed={isWishlisted}
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <p className="CollectionDetailsOne-meta">
            Artist: <strong>{collection.artist}</strong>
          </p>

          <p className="CollectionDetailsOne-meta">
            Category: <strong>{collection.category}</strong>
          </p>

          <p className="CollectionDetailsOne-meta">
            Artwork type: <strong>{collection.condition}</strong>
          </p>

          {/* ================= PRICE ================= */}
          <div className="CollectionDetailsOne-price-section">
            <div className="CollectionDetailsOne-price-row">
              <span className="CollectionDetailsOne-current-price">
                {formatPrice(collection.price)}
              </span>

              <span className="CollectionDetailsOne-original-price">
                {formatPrice(collection.originalPrice)}
              </span>

              <span className="CollectionDetailsOne-discount">
                {discount}% OFF
              </span>
            </div>

            <p className="CollectionDetailsOne-tax-note">
              Inclusive of applicable taxes
            </p>
          </div>

          {/* ================= DESCRIPTION ================= */}
          <div className="CollectionDetailsOne-description-section">
            <h2 className="CollectionDetailsOne-section-title">
              About This Artwork
            </h2>

            {typeof collection.description === "string" && collection.description.includes("<") ? (
              <div
                className="CollectionDetailsOne-description"
                dangerouslySetInnerHTML={{ __html: collection.description }}
              />
            ) : (
              <p className="CollectionDetailsOne-description">
                {collection.description}
              </p>
            )}
          </div>

          {/* ================= SPECIFICATIONS ================= */}
          <div className="CollectionDetailsOne-specifications">
            <div className="CollectionDetailsOne-specification">
              <span>Dimensions</span>
              <strong>{collection.dimensions}</strong>
            </div>

            <div className="CollectionDetailsOne-specification">
              <span>Medium</span>
              <strong>{collection.medium}</strong>
            </div>

            <div className="CollectionDetailsOne-specification">
              <span>Availability</span>
              <strong className="CollectionDetailsOne-stock">
                {collection.availability}
              </strong>
            </div>
          </div>

          {/* ================= QUANTITY AND CART ================= */}
          <div className="CollectionDetailsOne-purchase">
            <div
              className="CollectionDetailsOne-quantity"
              aria-label="Quantity selector"
            >
              <button
                type="button"
                onClick={() =>
                  setQuantity((previous) => Math.max(1, previous - 1))
                }
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <FaMinus />
              </button>

              <span aria-live="polite">{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((previous) => Math.min(99, previous + 1))
                }
                disabled={quantity >= 99}
                aria-label="Increase quantity"
              >
                <FaPlus />
              </button>
            </div>

            <button
              type="button"
              className="CollectionDetailsOne-add-to-cart"
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
              <span>Add to Cart</span>
            </button>
          </div>

          {cartMessage && (
            <p
              className="CollectionDetailsOne-cart-message"
              role="status"
            >
              <FaCheck />
              {cartMessage}
            </p>
          )}

          <button
            type="button"
            className="CollectionDetailsOne-wishlist-link"
            onClick={() => setIsWishlisted((previous) => !previous)}
          >
            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
            {isWishlisted
              ? "Added to wishlist"
              : "Add to wishlist"}
          </button>

          {/* ================= DELIVERY BENEFITS ================= */}
          <div className="CollectionDetailsOne-benefits">
            <div className="CollectionDetailsOne-benefit">
              <FaTruck />
              <span>Carefully packed artwork delivery</span>
            </div>

            <div className="CollectionDetailsOne-benefit">
              <FaUndoAlt />
              <span>Easy returns as per our return policy</span>
            </div>

            <div className="CollectionDetailsOne-benefit">
              <FaCertificate />
              <span>Artwork quality assurance</span>
            </div>

            <div className="CollectionDetailsOne-benefit">
              <FaPalette />
              <span>Selected for art lovers and collectors</span>
            </div>
          </div>

          <p className="CollectionDetailsOne-help">
            Have any questions?{" "}
            <a href="/contact">Contact Us</a>
          </p>
        </div>
      </div>

      {/* ================= IMAGE ZOOM ================= */}
      {zoomOpen && (
        <div
          className="CollectionDetailsOne-lightbox"
          onClick={() => setZoomOpen(false)}
          role="presentation"
        >
          <button
            type="button"
            className="CollectionDetailsOne-lightbox-close"
            onClick={() => setZoomOpen(false)}
            aria-label="Close image preview"
          >
            ×
          </button>

          <img
            src={images[activeImage].src}
            alt={images[activeImage].alt}
            className="CollectionDetailsOne-lightbox-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default CollectionDetailsOne;
