
import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
} from "react-icons/fa";

import "./CollectionDetailsThree.css";

const collectionDetailsThreeItems = [
  {
    id: 1,
    title: "Bold Statements: Geometric Wall Art Pieces",
    artist: "Joan Miró",
    category: "Contemporary Art",
    price: 450,
    discountPrice: 344,
    discount: 24,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Nature’s Spirit Transcends the Mortal Frame",
    artist: "Frida Kahlo",
    category: "Impressionism",
    price: 480,
    discountPrice: 350,
    discount: 27,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "An Invitation to Explore the Unseen",
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
    title: "Abstract Symphony: Music-Inspired Modern Art Canvas",
    artist: "Leonardo da Vinci",
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

const CollectionDetailsThree = () => {
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

  // Navigate one card at a time.
  const scrollCollectionDetailsThree = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.querySelector(
      ".CollectionDetailsThree-card"
    );

    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const styles = window.getComputedStyle(slider);
    const gap =
      parseFloat(styles.columnGap || styles.gap) || 0;

    const distance = cardWidth + gap;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (maxScroll <= 0) return;

    // Loop to the opposite end.
    if (
      direction === "next" &&
      slider.scrollLeft >= maxScroll - 5
    ) {
      slider.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    if (
      direction === "prev" &&
      slider.scrollLeft <= 5
    ) {
      slider.scrollTo({
        left: maxScroll,
        behavior: "smooth",
      });
      return;
    }

    slider.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  // Automatically slide every five seconds.
  useEffect(() => {
    autoScrollRef.current = window.setInterval(() => {
      const slider = sliderRef.current;

      if (!slider || slider.matches(":hover")) return;
      if (slider.scrollWidth <= slider.clientWidth) return;

      scrollCollectionDetailsThree("next");
    }, 5000);

    return () => {
      window.clearInterval(autoScrollRef.current);
    };
  }, []);

  // Toggle wishlist.
  const toggleWishlist = (id) => {
    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  };

  // Add an artwork to the local cart.
  const addToCart = (id) => {
    setCart((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  };

  return (
    <section
      className="CollectionDetailsThree"
      aria-label="Similar products"
    >
      <div className="CollectionDetailsThree-container">
        {/* Section heading */}
        <div className="CollectionDetailsThree-heading">
          <div className="CollectionDetailsThree-heading-main">
            <h2 className="CollectionDetailsThree-title">
              Similar Products
            </h2>
          </div>

          <a
            href="/shop"
            className="CollectionDetailsThree-view-all"
          >
            View All
          </a>
        </div>

        {/* Carousel */}
        <div className="CollectionDetailsThree-carousel">
          {/* Previous arrow */}
          <button
            type="button"
            className="CollectionDetailsThree-arrow CollectionDetailsThree-arrow-prev"
            onClick={() =>
              scrollCollectionDetailsThree("prev")
            }
            aria-label="Previous products"
          >
            <FaChevronLeft />
          </button>

          {/* Product cards */}
          <div
            className="CollectionDetailsThree-track"
            ref={sliderRef}
            aria-label="Similar artwork products"
          >
            {collectionDetailsThreeItems.map((item) => {
              const isWishlisted = wishlist.includes(item.id);
              const isInCart = cart.includes(item.id);

              return (
                <article
                  className="CollectionDetailsThree-card"
                  key={item.id}
                >
                  {/* Product image */}
                  <div className="CollectionDetailsThree-image-wrapper">
                    <img
                      className="CollectionDetailsThree-image"
                      src={item.image}
                      alt={`${item.title} by ${item.artist}`}
                      loading="lazy"
                    />

                    {/* Discount badge */}
                    <span className="CollectionDetailsThree-discount">
                      -{item.discount}%
                    </span>

                    {/* Wishlist button */}
                    <button
                      type="button"
                      className={`CollectionDetailsThree-wishlist ${
                        isWishlisted
                          ? "CollectionDetailsThree-wishlist-active"
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

                    {/* Category panel */}
                    <div className="CollectionDetailsThree-category-panel">
                      <span className="CollectionDetailsThree-category-label">
                        Category
                      </span>

                      <span className="CollectionDetailsThree-category">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="CollectionDetailsThree-details">
                    <h3 className="CollectionDetailsThree-card-title">
                      {item.title}
                    </h3>

                    <p className="CollectionDetailsThree-artist">
                      <span>Artist:</span> {item.artist}
                    </p>

                    {/* Indian currency pricing */}
                    <div className="CollectionDetailsThree-pricing">
                      <span className="CollectionDetailsThree-original-price">
                        {formatPrice(item.price)}
                      </span>

                      <span className="CollectionDetailsThree-discount-price">
                        {formatPrice(item.discountPrice)}
                      </span>
                    </div>

                    {/* Add to cart */}
                    <button
                      type="button"
                      className={`CollectionDetailsThree-cart-button ${
                        isInCart
                          ? "CollectionDetailsThree-cart-button-added"
                          : ""
                      }`}
                      onClick={() => addToCart(item.id)}
                      disabled={isInCart}
                    >
                      <FaShoppingCart />

                      <span>
                        {isInCart
                          ? "Added to Cart"
                          : "Add to Cart"}
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
            className="CollectionDetailsThree-arrow CollectionDetailsThree-arrow-next"
            onClick={() =>
              scrollCollectionDetailsThree("next")
            }
            aria-label="Next products"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CollectionDetailsThree;
