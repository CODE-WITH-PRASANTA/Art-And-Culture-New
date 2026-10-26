
import React, { useState } from "react";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Eye,
  Check,
  X,
} from "lucide-react";
import "./ShopDetailsSimilar.css";

import shopMain1 from "../../assets/shop-details-1.webp";
import shopMain2 from "../../assets/shop-details-2.webp";
import shopMain3 from "../../assets/shop-details-3.webp";
import shopMain4 from "../../assets/shop-details-4.webp";
import shopMain5 from "../../assets/shop-details-2.webp";
import shopMain6 from "../../assets/shop-details-1.webp";

const products = [
  {
    id: 1,
    image: shopMain1,
    name: "Desert Mirage: Watercolor Cactus Art Print",
    artist: "Edward Munch",
    price: 21999,
    category: "Watercolor",
  },
  {
    id: 2,
    image: shopMain2,
    name: "Abstract Art to Spark Creative Inspiration",
    artist: "Mark Jon",
    price: 18500,
    oldPrice: 22000,
    category: "Abstract Art",
  },
  {
    id: 3,
    image: shopMain3,
    name: "Cosmic Beauty: Galaxy-Inspired Resin Coasters",
    artist: "Leonardo da Vinci",
    price: 24500,
    category: "Fine Art",
  },
  {
    id: 4,
    image: shopMain4,
    name: "Ocean Waves: Textured Acrylic Art Panel",
    artist: "Frida Kahlo",
    price: 16999,
    category: "Canvas Art",
  },
  {
    id: 5,
    image: shopMain5,
    name: "Golden Horizon: Contemporary Art Collection",
    artist: "Vincent van Gogh",
    price: 15999,
    category: "Contemporary Art",
  },
  {
    id: 6,
    image: shopMain6,
    name: "Ethereal Dreams: Timeless Artistic Expression",
    artist: "Claude Monet",
    price: 19999,
    category: "Landscape Art",
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const ShopDetailsSimilar = ({ onAddToCart, onQuickView }) => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [paused, setPaused] = useState(false);
  const [reverse, setReverse] = useState(false);

  const toggleWishlist = (id) => {
    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const addToCart = (product) => {
    setCart((previous) =>
      previous.includes(product.id)
        ? previous
        : [...previous, product.id]
    );

    onAddToCart?.(product);
  };

  const handleQuickView = (product) => {
    if (onQuickView) {
      onQuickView(product);
    } else {
      setActiveProduct(product);
    }
  };

  const renderCard = (product, index) => {
    const isWishlisted = wishlist.includes(product.id);
    const isAdded = cart.includes(product.id);

    return (
      <article
        className="ShopDetailsSimilar__card"
        key={`${product.id}-${index}`}
      >
        <div className="ShopDetailsSimilar__imageWrap">
          <img
            className="ShopDetailsSimilar__image"
            src={product.image}
            alt={product.name}
            loading={index < 4 ? "eager" : "lazy"}
            draggable="false"
          />

          <span className="ShopDetailsSimilar__category">
            {product.category}
          </span>

          <button
            type="button"
            className={`ShopDetailsSimilar__wishlist ${
              isWishlisted ? "is-active" : ""
            }`}
            onClick={() => toggleWishlist(product.id)}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            aria-pressed={isWishlisted}
          >
            <Heart
              size={19}
              strokeWidth={1.8}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          <button
            type="button"
            className="ShopDetailsSimilar__quickAction"
            onClick={() => handleQuickView(product)}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={17} />
            <span>Quick View</span>
          </button>
        </div>

        <div className="ShopDetailsSimilar__content">
          <h3 className="ShopDetailsSimilar__productName">
            {product.name}
          </h3>

          <p className="ShopDetailsSimilar__artist">
            <span>Artist:</span>
            <strong>{product.artist}</strong>
          </p>

          <div className="ShopDetailsSimilar__price">
            <span>Price:</span>

            {product.oldPrice && (
              <del>{formatPrice(product.oldPrice)}</del>
            )}

            <strong>{formatPrice(product.price)}</strong>
          </div>

          <button
            type="button"
            className={`ShopDetailsSimilar__addButton ${
              isAdded ? "is-added" : ""
            }`}
            onClick={() => addToCart(product)}
          >
            {isAdded ? (
              <>
                <Check size={17} />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </article>
    );
  };

  const renderGroup = (copy) => (
    <div
      className="ShopDetailsSimilar__group"
      key={copy}
      aria-hidden={copy === "duplicate" ? "true" : undefined}
    >
      {products.map((product, index) =>
        renderCard(product, `${copy}-${index}`)
      )}
    </div>
  );

  return (
    <section
      className="ShopDetailsSimilar"
      aria-labelledby="ShopDetailsSimilar-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div className="ShopDetailsSimilar__container">
        <div className="ShopDetailsSimilar__header">
          <div className="ShopDetailsSimilar__headingGroup">
            <span className="ShopDetailsSimilar__overline">
              Artfully selected
            </span>

            <h2
              className="ShopDetailsSimilar__title"
              id="ShopDetailsSimilar-title"
            >
              You May Also <span>Love</span>
            </h2>

            <p className="ShopDetailsSimilar__subtitle">
              Exceptional artwork to bring beauty to your space.
            </p>
          </div>

          <div className="ShopDetailsSimilar__controls">
            {wishlist.length > 0 && (
              <span className="ShopDetailsSimilar__count">
                <Heart size={14} fill="currentColor" />
                {wishlist.length}
              </span>
            )}

            <button
              type="button"
              className="ShopDetailsSimilar__arrow"
              aria-label="Move carousel left"
              onClick={() => setReverse(false)}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="ShopDetailsSimilar__arrow"
              aria-label="Move carousel right"
              onClick={() => setReverse(true)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          className={`ShopDetailsSimilar__viewport ${
            paused ? "is-paused" : ""
          }`}
        >
          <div
            className={`ShopDetailsSimilar__track ${
              reverse ? "is-reversed" : ""
            }`}
          >
            {renderGroup("original")}
            {renderGroup("duplicate")}
          </div>
        </div>

        <div className="ShopDetailsSimilar__footer">
          <span className="ShopDetailsSimilar__footerLine" />
          <p>Discover art. Celebrate creativity.</p>
          <span className="ShopDetailsSimilar__footerLine" />
        </div>
      </div>

      {activeProduct && (
        <div
          className="ShopDetailsSimilar__modalBackdrop"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="ShopDetailsSimilar__modal"
            role="dialog"
            aria-modal="true"
            aria-label="Artwork quick view"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="ShopDetailsSimilar__modalClose"
              aria-label="Close quick view"
              onClick={() => setActiveProduct(null)}
            >
              <X size={20} />
            </button>

            <img
              src={activeProduct.image}
              alt={activeProduct.name}
            />

            <div className="ShopDetailsSimilar__modalContent">
              <span className="ShopDetailsSimilar__overline">
                {activeProduct.category}
              </span>

              <h3>{activeProduct.name}</h3>
              <p>Artist: {activeProduct.artist}</p>
              <strong>{formatPrice(activeProduct.price)}</strong>

              <button
                type="button"
                className="ShopDetailsSimilar__addButton"
                onClick={() => {
                  addToCart(activeProduct);
                  setActiveProduct(null);
                }}
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShopDetailsSimilar;
