import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
} from "react-icons/fa";

import "./Collection.css";
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

const Collection = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const autoScrollRef = useRef(null);

  const { isInWishlist, toggleWishlist } = useWishlist();

  const [collectionItems, setCollectionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInCart, addToCart: addItemToCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    const fetchStreamingArts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${ARTS_API_URL}?isStreamingCollection=true`);
        const json = await res.json();

        if (!isMounted) return;

        if (json.success && Array.isArray(json.data)) {
          // Filter to only products whose streaming is active and published
          const activeStreaming = json.data.filter((art) => {
            const isStreaming = Boolean(art.isStreamingCollection);
            const isPublished =
              art.isPublished !== false && art.status !== "Unpublished";
            return isStreaming && isPublished;
          });

          const mapped = activeStreaming.map((art, idx) => {
            const price = Number(art.price) || 0;
            const discount = Number(art.discount) || 0;
            const discountPrice =
              discount > 0
                ? Math.round(price * (1 - discount / 100))
                : price;

            return {
              id: art._id || art.id || `stream-${idx}`,
              artNo: art.artNo,
              title: art.title || "Untitled Artwork",
              artist: art.artistName || art.artist || "Unknown Artist",
              category: art.category || "Streaming Collection",
              price: price,
              discountPrice: discountPrice,
              discount: discount,
              image: getArtImage(art),
              description: art.description || "",
              stock:
                art.stockQuantity !== undefined
                  ? Number(art.stockQuantity) > 0
                  : true,
            };
          });

          setCollectionItems(mapped);
        } else {
          setCollectionItems([]);
        }
      } catch (err) {
        console.error("Failed to load streaming collection artworks:", err);
        setCollectionItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStreamingArts();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const scrollCollection = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.querySelector(".Collection-card");

    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    const distance = cardWidth + gap;

    const maxScroll = slider.scrollWidth - slider.clientWidth;

    // Loop smoothly when the end or beginning is reached.
    if (direction === "next" && slider.scrollLeft >= maxScroll - 5) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === "prev" && slider.scrollLeft <= 5) {
      slider.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    slider.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  // Automatically scroll every five seconds.
  useEffect(() => {
    if (collectionItems.length <= 1) return;

    const startAutoScroll = () => {
      window.clearInterval(autoScrollRef.current);

      autoScrollRef.current = window.setInterval(() => {
        const slider = sliderRef.current;

        if (!slider || slider.matches(":hover")) return;

        if (slider.scrollWidth <= slider.clientWidth) return;

        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (slider.scrollLeft >= maxScroll - 5) {
          slider.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          scrollCollection("next");
        }
      }, 5000);
    };

    startAutoScroll();

    return () => {
      window.clearInterval(autoScrollRef.current);
    };
  }, [collectionItems]);

  const addToCart = (id) => {
    setCart((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  return (
    <section className="Collection" aria-label="Streaming collection">
      <div className="Collection-container">
        {/* Section heading */}
        <div className="Collection-heading">
          <div className="Collection-heading-main">
            <h2 className="Collection-title">Streaming Collection</h2>

            <p className="Collection-subtitle">Where art meets excitement.</p>
          </div>

          <a href="/shop" className="Collection-view-all">
            View All
          </a>
        </div>

        {/* Carousel */}
        <div className="Collection-carousel">
          {/* Previous arrow */}
          <button
            type="button"
            className="Collection-arrow Collection-arrow-prev"
            onClick={() => scrollCollection("prev")}
            aria-label="Previous artworks"
          >
            <FaChevronLeft />
          </button>

          {/* Artwork cards */}
          <div
            className="Collection-track"
            ref={sliderRef}
            aria-label="Artwork collection"
          >
            {collectionItems.map((item) => {
              const isWishlisted = isInWishlist(item.id);
              const inCart = isInCart(item.id);

              return (
                <article
                  className="Collection-card"
                  key={item.id}
                  onClick={() => navigate(`/shop/${toArtSlug(item.title, item.id)}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Artwork image */}
                  <div className="Collection-image-wrapper">
                    <img
                      className="Collection-image"
                      src={item.image}
                      alt={`${item.title} by ${item.artist}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85";
                      }}
                    />

                    {/* Discount label */}
                    {item.discount > 0 && (
                      <span className="Collection-discount">
                        -{item.discount}%
                      </span>
                    )}

                    {/* Wishlist button */}
                    <button
                      type="button"
                      className={`Collection-wishlist ${
                        isWishlisted ? "Collection-wishlist-active" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
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

                    {/* Category panel replaces the countdown */}
                    <div className="Collection-category-panel">
                      <span className="Collection-category-label">
                        Category
                      </span>

                      <span className="Collection-category">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Artwork details */}
                  <div className="Collection-details">
                    <h3 className="Collection-card-title">{item.title}</h3>

                    <p className="Collection-artist">
                      <span>Artist:</span> {item.artist}
                    </p>

                    {/* Prices */}
                    <div className="Collection-pricing">
                      {item.discount > 0 && (
                        <span className="Collection-original-price">
                          {formatPrice(item.price)}
                        </span>
                      )}

                      <span className="Collection-discount-price">
                        {formatPrice(item.discountPrice)}
                      </span>
                    </div>

                    {/* Add to cart */}
                    <button
                      type="button"
                      className={`Collection-cart-button ${
                        inCart ? "Collection-cart-button-added" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addItemToCart(item, 1);
                      }}
                      disabled={inCart}
                    >
                      <FaShoppingCart />

                      <span>
                        {inCart ? "Added to Cart" : "Add to Cart"}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Next arrow */}
          <button
            type="button"
            className="Collection-arrow Collection-arrow-next"
            onClick={() => scrollCollection("next")}
            aria-label="Next artworks"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Collection;
