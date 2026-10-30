import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

import { API_BASE_URL, ARTS_API_URL } from "../../config/api";
import { useWishlist } from "../../context/WishlistContext";

const toArtSlug = (title, id) => {
  if (!title) return id || "";
  return encodeURIComponent(
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  );
};

const ShopDetailsSimilar = ({ onAddToCart, onQuickView }) => {
  const navigate = useNavigate();
  const { artName } = useParams();
  const [searchParams] = useSearchParams();
  const currentIdentifier = artName || searchParams.get("id");

  const [productsList, setProductsList] = useState([]);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [cart, setCart] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [paused, setPaused] = useState(false);
  const [reverse, setReverse] = useState(false);

  /* Fetch live artworks from database */
  useEffect(() => {
    let isMounted = true;

    const fetchSimilarArtworks = async () => {
      try {
        const res = await fetch(ARTS_API_URL);
        const json = await res.json();

        if (!isMounted || !json.success || !Array.isArray(json.data)) return;

        const filtered = json.data.filter((item) => {
          if (!currentIdentifier) return true;
          const target = decodeURIComponent(currentIdentifier)
            .toLowerCase()
            .replace(/-/g, " ")
            .trim();
          const itemId = String(item._id || item.id || "");
          const itemNo = String(item.artNo || "").toLowerCase();
          const itemTitle = String(item.title || "").toLowerCase().trim();
          const itemSlug = toArtSlug(item.title, item._id).toLowerCase();

          if (itemId === currentIdentifier) return false;
          if (itemNo === target) return false;
          if (itemTitle === target) return false;
          if (itemSlug === String(currentIdentifier).toLowerCase()) return false;
          return true;
        });

        if (filtered.length > 0) {
          const dbProducts = filtered.map((art) => {
            const numPrice = Number(art.price) || 0;
            const numDiscount = Number(art.discount) || 0;
            const finalPrice =
              numDiscount > 0 ? numPrice * (1 - numDiscount / 100) : numPrice;

            let img = shopMain1;
            if (Array.isArray(art.photos) && art.photos.length > 0) {
              const p = art.photos[0];
              if (p.url) {
                img = p.url.startsWith("http")
                  ? p.url
                  : `${API_BASE_URL}${p.url}`;
              } else if (p.dataUrl) {
                img =
                  p.dataUrl.startsWith("http") || p.dataUrl.startsWith("data:")
                    ? p.dataUrl
                    : `${API_BASE_URL}${p.dataUrl}`;
              }
            }

            return {
              id: art._id || art.id,
              image: img,
              name: art.title || "Traditional Heritage Artwork",
              artist: art.artistName || "Master Artist",
              price: finalPrice,
              oldPrice: numDiscount > 0 ? numPrice : null,
              category: art.category || "Fine Art",
            };
          });

          // Loop real database artworks only to ensure smooth marquee loop
          let fullList = [...dbProducts];
          while (fullList.length < 5 && dbProducts.length > 0) {
            fullList = [...fullList, ...dbProducts];
          }

          setProductsList(fullList);
        } else {
          setProductsList([]);
        }
      } catch (err) {
        console.error("Failed to fetch similar artworks:", err);
      }
    };

    fetchSimilarArtworks();

    return () => {
      isMounted = false;
    };
  }, [currentIdentifier]);

  const handleOpenProduct = (product) => {
    if (!product) return;
    const id = typeof product === "object" ? product.id : product;
    if (!id || String(id).startsWith("default-")) return;
    const name = typeof product === "object" ? product.name : "";
    const slug = toArtSlug(name, id);
    navigate(`/shop/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const isWishlisted = isInWishlist(product.id);
    const isAdded = cart.includes(product.id);

    return (
      <article
        className="ShopDetailsSimilar__card"
        key={`${product.id}-${index}`}
      >
        <div
          className="ShopDetailsSimilar__imageWrap"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            if (e.target.closest("button")) return;
            handleOpenProduct(product);
          }}
        >
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
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist({
                id: product.id,
                _id: product.id,
                title: product.name,
                artist: product.artist,
                price: product.price,
                image: product.image,
                stock: true,
              });
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              handleQuickView(product);
            }}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye size={17} />
            <span>Quick View</span>
          </button>
        </div>

        <div className="ShopDetailsSimilar__content">
          <h3
            className="ShopDetailsSimilar__productName"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenProduct(product)}
          >
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
      {productsList.map((product, index) =>
        renderCard(product, `${copy}-${index}`)
      )}
    </div>
  );

  if (!productsList || productsList.length === 0) {
    return null;
  }

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

              <div style={{ display: "flex", gap: "10px", marginTop: "16px", width: "100%", flexWrap: "wrap" }}>
                {!String(activeProduct.id).startsWith("default-") && (
                  <button
                    type="button"
                    className="ShopDetailsSimilar__addButton"
                    style={{ background: "#211b17", color: "#fff", borderColor: "#211b17" }}
                    onClick={() => {
                      setActiveProduct(null);
                      handleOpenProduct(activeProduct);
                    }}
                  >
                    View Details
                  </button>
                )}

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
        </div>
      )}
    </section>
  );
};

export default ShopDetailsSimilar;
