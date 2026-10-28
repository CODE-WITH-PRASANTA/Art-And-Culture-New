import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaCheck,
} from "react-icons/fa";

import "./Artwork.css";
import { useCart } from "../../context/CartContext";
import { API_BASE_URL, ARTS_API_URL } from "../../config/api";
import { toArtSlug } from "../../utils/slug";
import { useWishlist } from "../../context/WishlistContext";

const getImageUrl = (photo) => {
  if (!photo) return "";
  if (typeof photo === "string") {
    if (photo.startsWith("data:") || photo.startsWith("http")) return photo;
    return `${API_BASE_URL}${photo}`;
  }
  if (photo.url) {
    if (photo.url.startsWith("http")) return photo.url;
    return `${API_BASE_URL}${photo.url}`;
  }
  if (photo.dataUrl) {
    if (photo.dataUrl.startsWith("http") || photo.dataUrl.startsWith("data:")) return photo.dataUrl;
    return `${API_BASE_URL}${photo.dataUrl}`;
  }
  return "";
};

const getArtImage = (art) => {
  if (art.photos && art.photos.length > 0) {
    const img = getImageUrl(art.photos[0]);
    if (img) return img;
  }
  if (art.image) {
    return getImageUrl(art.image);
  }
  return "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85";
};

const Artwork = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const intervalRef = useRef(null);

  const { isInWishlist, toggleWishlist } = useWishlist();

  const [artworkItems, setArtworkItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInCart, addToCart: addItemToCart } = useCart();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchGeneralArts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${ARTS_API_URL}?isGeneralArtwork=true`);
        const json = await res.json();

        if (!isMounted) return;

        if (json.success && Array.isArray(json.data)) {
          // Keep only products whose general artwork status is active and published
          const activeGeneral = json.data.filter((art) => {
            const isGeneral = art.isGeneralArtwork !== false;
            const isPublished =
              art.isPublished !== false && art.status !== "Unpublished";
            return isGeneral && isPublished;
          });

          const mapped = activeGeneral.map((art, idx) => {
            const numPrice = Number(art.price) || 0;
            const numDiscount = Number(art.discount) || 0;
            const finalPrice =
              numDiscount > 0
                ? Math.round(numPrice * (1 - numDiscount / 100))
                : numPrice;

            return {
              id: art._id || art.id || `general-${idx}`,
              artNo: art.artNo,
              title: art.title || "Untitled Artwork",
              artist: art.artistName || art.artist || "Unknown Artist",
              category: art.category || "General Artwork",
              price: finalPrice,
              originalPrice: numPrice,
              discount: numDiscount,
              image: getArtImage(art),
              description: art.description || "",
              stock:
                art.stockQuantity !== undefined
                  ? Number(art.stockQuantity) > 0
                  : true,
            };
          });

          setArtworkItems(mapped);
        } else {
          setArtworkItems([]);
        }
      } catch (err) {
        console.error("Failed to load general artworks:", err);
        setArtworkItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGeneralArts();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const scrollArtwork = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".Artwork-card");
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (maxScroll <= 2) return;

    if (direction === "next" && track.scrollLeft >= maxScroll - 5) {
      track.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === "prev" && track.scrollLeft <= 5) {
      track.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    track.scrollBy({
      left: (cardWidth + gap) * (direction === "next" ? 1 : -1),
      behavior: "smooth",
    });
  }, []);

  // Automatically advance the carousel every four seconds.
  useEffect(() => {
    if (artworkItems.length <= 1) return;

    intervalRef.current = window.setInterval(() => {
      const track = trackRef.current;

      // Pause autoplay while the visitor interacts with the carousel.
      if (!track || track.matches(":hover")) return;
      if (track.scrollWidth <= track.clientWidth + 2) return;

      scrollArtwork("next");
    }, 4000);

    return () => window.clearInterval(intervalRef.current);
  }, [scrollArtwork, artworkItems]);

  const addToCart = (item) => {
    setCart((previous) =>
      previous.includes(item.id) ? previous : [...previous, item.id]
    );

    setNotice(`${item.title} added to cart.`);
    window.clearTimeout(addToCart.noticeTimer);

    addToCart.noticeTimer = window.setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  useEffect(() => {
    return () => window.clearTimeout(addToCart.noticeTimer);
  }, []);

  return (
    <section className="Artwork" aria-labelledby="Artwork-title">
      <div className="Artwork-container">
        {/* Section heading */}
        <div className="Artwork-heading">
          <div className="Artwork-heading-content">
            <h2 className="Artwork-title" id="Artwork-title">
              General Artwork
            </h2>

            <p className="Artwork-subtitle">
              Join us for an exhilarating art experience where art meets
              excitement.
            </p>
          </div>

          <Link to="/shop" className="Artwork-view-all">
            View All
          </Link>
        </div>

        {/* Artwork carousel */}
        <div className="Artwork-carousel">
          <button
            type="button"
            className="Artwork-arrow Artwork-arrow-prev"
            aria-label="Previous artworks"
            onClick={() => scrollArtwork("prev")}
          >
            <FaChevronLeft />
          </button>

          <div className="Artwork-track" ref={trackRef}>
            {artworkItems.map((item) => {
              const isWishlisted = isInWishlist(item.id);
              const isAdded = isInCart(item.id);

              return (
                <article
                  className="Artwork-card"
                  key={item.id}
                  onClick={() => navigate(`/shop/${toArtSlug(item.title, item.id)}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Image and wishlist */}
                  <div className="Artwork-image-wrapper">
                    <img
                      className="Artwork-image"
                      src={item.image}
                      alt={`${item.title} by ${item.artist}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85";
                      }}
                    />

                    <span className="Artwork-category-badge">
                      {item.category}
                    </span>

                    <button
                      type="button"
                      className={`Artwork-wishlist ${
                        isWishlisted ? "Artwork-wishlist-active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const added = toggleWishlist(item);
                        setNotice(added ? `${item.title} added to wishlist.` : `${item.title} removed from wishlist.`);
                        window.clearTimeout(addToCart.noticeTimer);
                        addToCart.noticeTimer = window.setTimeout(() => setNotice(""), 2500);
                      }}
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

                  {/* Artwork details */}
                  <div className="Artwork-details">
                    <h3 className="Artwork-card-title">{item.title}</h3>

                    <p className="Artwork-artist">
                      <span>Artist:</span> {item.artist}
                    </p>

                    <p className="Artwork-price">
                      <span>Price:</span> {formatPrice(item.price)}
                    </p>

                    <button
                      type="button"
                      className={`Artwork-buy-button ${
                        isAdded ? "Artwork-buy-button-added" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      disabled={isAdded}
                    >
                      {isAdded ? <FaCheck /> : <FaShoppingCart />}
                      <span>{isAdded ? "Added to Cart" : "Add to Cart"}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="Artwork-arrow Artwork-arrow-next"
            aria-label="Next artworks"
            onClick={() => scrollArtwork("next")}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Add-to-cart confirmation */}
        <div
          className={`Artwork-notice ${
            notice ? "Artwork-notice-visible" : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {notice && <FaCheck />}
          <span>{notice}</span>
        </div>
      </div>
    </section>
  );
};

export default Artwork;
