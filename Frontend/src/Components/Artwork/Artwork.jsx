
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaCheck,
} from "react-icons/fa";

import "./Artwork.css";

const artworkItems = [
  {
    id: 1,
    title: "Custom Portraits That Tell Your Story",
    artist: "Salvador Dalí",
    price: 22750,
    category: "Portrait Art",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Cosmic Beauty: Galaxy-Inspired Resin Coasters",
    artist: "Leonardo da Vinci",
    price: 17900,
    category: "Classic Art",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Golden Horizon: Metallic Sunset Wall Décor",
    artist: "Andy Warhol",
    price: 21250,
    category: "Modern Art",
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Watercolor Masterpieces for Every Room Decor",
    artist: "Diego Rivera",
    price: 21999,
    category: "Watercolor",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Dreamy Landscapes Inspired by Nature",
    artist: "Claude Monet",
    price: 18500,
    category: "Landscape Art",
    image:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "Abstract Expressions in Vibrant Colors",
    artist: "Pablo Picasso",
    price: 24500,
    category: "Abstract Art",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    title: "A Timeless Journey Through Fine Art",
    artist: "Vincent van Gogh",
    price: 19900,
    category: "Fine Art",
    image:
      "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    title: "Floral Stories Painted with Passion",
    artist: "Georgia O'Keeffe",
    price: 16500,
    category: "Floral Art",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
  },
];

const Artwork = () => {
  const trackRef = useRef(null);
  const intervalRef = useRef(null);

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [notice, setNotice] = useState("");

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
    intervalRef.current = window.setInterval(() => {
      const track = trackRef.current;

      // Pause autoplay while the visitor interacts with the carousel.
      if (!track || track.matches(":hover")) return;
      if (track.scrollWidth <= track.clientWidth + 2) return;

      scrollArtwork("next");
    }, 4000);

    return () => window.clearInterval(intervalRef.current);
  }, [scrollArtwork]);

  const toggleWishlist = (id) => {
    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

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
              const isWishlisted = wishlist.includes(item.id);
              const isAdded = cart.includes(item.id);

              return (
                <article className="Artwork-card" key={item.id}>
                  {/* Image and wishlist */}
                  <div className="Artwork-image-wrapper">
                    <img
                      className="Artwork-image"
                      src={item.image}
                      alt={`${item.title} by ${item.artist}`}
                      loading="lazy"
                    />

                    <span className="Artwork-category-badge">
                      {item.category}
                    </span>

                    <button
                      type="button"
                      className={`Artwork-wishlist ${
                        isWishlisted ? "Artwork-wishlist-active" : ""
                      }`}
                      onClick={() => toggleWishlist(item.id)}
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
                      onClick={() => addToCart(item)}
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
