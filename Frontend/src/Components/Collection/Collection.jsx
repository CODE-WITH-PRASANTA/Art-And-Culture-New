
import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
} from "react-icons/fa";

import "./Collection.css";

const collectionItems = [
  {
    id: 1,
    title: "Where Imagination Meets the Canvas",
    artist: "Frida Kahlo",
    category: "Contemporary Art",
    price: 450,
    discountPrice: 344,
    discount: 24,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Textures Unveil the Secrets of Eternity",
    artist: "Claude Monet",
    category: "Impressionism",
    price: 480,
    discountPrice: 350,
    discount: 27,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Infinity Explored in Every Tiny Detail",
    artist: "Vincent van Gogh",
    category: "Oil Painting",
    price: 520,
    discountPrice: 370,
    discount: 29,
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Layers of Meaning Found in Simplicity",
    artist: "Pablo Picasso",
    category: "Modern Art",
    price: 560,
    discountPrice: 390,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "A Quiet Garden of Endless Colors",
    artist: "Georgia O'Keeffe",
    category: "Floral Art",
    price: 420,
    discountPrice: 315,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "The Beauty of a Different Perspective",
    artist: "Salvador Dalí",
    category: "Surrealism",
    price: 600,
    discountPrice: 420,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85",
  },
];

const Collection = () => {
  const sliderRef = useRef(null);
  const autoScrollRef = useRef(null);

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

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

    const cardWidth =
      firstCard.getBoundingClientRect().width;

    const styles = window.getComputedStyle(slider);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;

    const distance = cardWidth + gap;

    const maxScroll =
      slider.scrollWidth - slider.clientWidth;

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
    const startAutoScroll = () => {
      window.clearInterval(autoScrollRef.current);

      autoScrollRef.current = window.setInterval(() => {
        const slider = sliderRef.current;

        if (!slider || slider.matches(":hover")) return;

        if (slider.scrollWidth <= slider.clientWidth) return;

        const maxScroll =
          slider.scrollWidth - slider.clientWidth;

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
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  };

  const addToCart = (id) => {
    setCart((previous) =>
      previous.includes(id)
        ? previous
        : [...previous, id]
    );
  };

  return (
    <section className="Collection" aria-label="Streaming collection">
      <div className="Collection-container">
        {/* Section heading */}
        <div className="Collection-heading">
          <div className="Collection-heading-main">
            <h2 className="Collection-title">
              Streaming Collection
            </h2>

            <p className="Collection-subtitle">
              Where art meets excitement.
            </p>
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
              const isWishlisted = wishlist.includes(item.id);
              const isInCart = cart.includes(item.id);

              return (
                <article
                  className="Collection-card"
                  key={item.id}
                >
                  {/* Artwork image */}
                  <div className="Collection-image-wrapper">
                    <img
                      className="Collection-image"
                      src={item.image}
                      alt={`${item.title} by ${item.artist}`}
                      loading="lazy"
                    />

                    {/* Discount label */}
                    <span className="Collection-discount">
                      -{item.discount}%
                    </span>

                    {/* Wishlist button */}
                    <button
                      type="button"
                      className={`Collection-wishlist ${
                        isWishlisted
                          ? "Collection-wishlist-active"
                          : ""
                      }`}
                      onClick={() => toggleWishlist(item.id)}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      aria-pressed={isWishlisted}
                    >
                      {isWishlisted ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
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
                    <h3 className="Collection-card-title">
                      {item.title}
                    </h3>

                    <p className="Collection-artist">
                      <span>Artist:</span> {item.artist}
                    </p>

                    {/* Prices */}
                    <div className="Collection-pricing">
                      <span className="Collection-original-price">
                        {formatPrice(item.price)}
                      </span>

                      <span className="Collection-discount-price">
                        {formatPrice(item.discountPrice)}
                      </span>
                    </div>

                    {/* Add to cart */}
                    <button
                      type="button"
                      className={`Collection-cart-button ${
                        isInCart
                          ? "Collection-cart-button-added"
                          : ""
                      }`}
                      onClick={() => addToCart(item.id)}
                      disabled={isInCart}
                    >
                      <FaShoppingCart />

                      <span>
                        {isInCart ? "Added to Cart" : "Add to Cart"}
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
