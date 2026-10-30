import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import shop1 from "../../assets/shop-1.webp";
import shop2 from "../../assets/shop-2.webp";
import shop3 from "../../assets/shop-3.webp";
import shop4 from "../../assets/shop-4.webp";
import "./ShopDetailsMain.css";

import { API_BASE_URL, ARTS_API_URL } from "../../config/api";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

/* =====================================================================
   PRODUCT DATA TEMPLATE & DEFAULT FALLBACK
===================================================================== */
const defaultProduct = {
  title: "Whispers of Colors in Silent Shadows",
  artist: "Henri Matisse",
  price: 34000, // in rupees
  condition: "New",
  stock: 3, // max quantity a buyer can add
  categories: ["Watercolor", "Street Art"],
  deliveryCharge: 1200,
  images: [
    { src: shop1, alt: "Colourful watercolour street with a horse carriage" },
    { src: shop2, alt: "Artwork detail, view 2" },
    { src: shop3, alt: "Artwork detail, view 3" },
    { src: shop4, alt: "Artwork detail, view 4" },
  ],

  /* ---- Details section ---- */
  artistInfo: [
    { label: "Date of Birth and Death", value: "Born on December 31, 1869, and passed away on November 3, 1954" },
    { label: "Nationality", value: "French" },
    { label: "Style", value: "Known for bold colour, fluid line and the Fauvist movement" },
    {
      label: "Notable Work",
      value:
        "“The Dance” (1910), “Woman with a Hat” (1905), and “The Snail” (1953)",
    },
  ],
  artworkInfo: [
    { label: "Category", value: "Watercolor Painting" },
    { label: "Size", value: "29.7 x 28 inch (Height x Width)" },
    { label: "Framing", value: "Not framed" },
    { label: "Theme", value: "Street scenes and everyday life" },
    { label: "Signature", value: "Signed by Artist" },
    { label: "Authenticity", value: "Includes Certificate of Authenticity." },
  ],
  narrative:
    "This artwork often delves into personal and emotional experiences, so these colours capture the depth and complexity of the themes the artist explores.",
  guidelines: [
    "Frame the artwork behind UV-protective glass",
    "Keep the painting away from direct sunlight",
    "Dust the surface gently with a soft dry brush or cloth",
  ],
};

/* ---------------- Helpers ---------------- */
const formatINR = (value) =>
  Number(value).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* ---------------- Icons ---------------- */
const baseIcon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const ZoomIcon = ({ plus = false, size = 20 }) => (
  <svg {...baseIcon} width={size} height={size}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
    {plus && <path d="M11 8v6M8 11h6" />}
  </svg>
);

const FullscreenIcon = () => (
  <svg {...baseIcon} width="20" height="20">
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);

const CloseIcon = ({ size = 22 }) => (
  <svg {...baseIcon} width={size} height={size}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const NextIcon = () => (
  <svg {...baseIcon} width="24" height="24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PrevIcon = () => (
  <svg {...baseIcon} width="24" height="24">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg {...baseIcon} width="20" height="20" fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.8 3.4 4.5 6.7 4.5c2 0 3.4 1.1 5.3 3.1 1.9-2 3.3-3.1 5.3-3.1 3.3 0 5 3.3 3.9 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
  </svg>
);

const CheckIcon = ({ size = 20 }) => (
  <svg {...baseIcon} width={size} height={size} strokeWidth="2.4">
    <path d="M5 12.5 10 17.5 19 7.5" />
  </svg>
);

const MinusIcon = () => (
  <svg {...baseIcon} width="18" height="18" strokeWidth="2.4">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg {...baseIcon} width="18" height="18" strokeWidth="2.4">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const CartIcon = ({ size = 22 }) => (
  <svg {...baseIcon} width={size} height={size}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3.5h2.6l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.6-1.2l1.5-6.6H6.1" />
  </svg>
);

const BoltIcon = () => (
  <svg {...baseIcon} width="19" height="19">
    <path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12z" />
  </svg>
);

const UserIcon = () => (
  <svg {...baseIcon} width="22" height="22">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
  </svg>
);

const FrameIcon = () => (
  <svg {...baseIcon} width="22" height="22">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <rect x="7" y="7" width="10" height="10" rx="1" />
  </svg>
);

const BookIcon = () => (
  <svg {...baseIcon} width="22" height="22">
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
    <path d="M4 19V5M9 8h6" />
  </svg>
);

/* ---------------- Full screen viewer (lightbox) ---------------- */
const ShopDetailsMainLightbox = ({ images, index, onChange, onClose }) => {
  const overlayRef = useRef(null);
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [isFull, setIsFull] = useState(false);
  const [closing, setClosing] = useState(false);

  const total = images.length;

  const requestClose = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    setClosing(true);
    setTimeout(onClose, 320);
  }, [onClose]);

  const go = useCallback(
    (step) => {
      setZoomed(false);
      onChange((index + step + total) % total);
    },
    [index, total, onChange]
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") requestClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [go, requestClose]);

  useEffect(() => {
    const onFull = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFull);
    return () => document.removeEventListener("fullscreenchange", onFull);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else overlayRef.current?.requestFullscreen?.();
  };

  const handleMove = (event) => {
    if (!zoomed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    });
  };

  const onTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStart.current === null || zoomed) return;
    const diff = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) go(diff < 0 ? 1 : -1);
    touchStart.current = null;
  };

  return createPortal(
    <div
      ref={overlayRef}
      className={`ShopDetailsMain-lightbox ${closing ? "ShopDetailsMain-lightboxClosing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Artwork full view"
    >
      <div className="ShopDetailsMain-lightboxBar">
        <span className="ShopDetailsMain-lightboxCount">
          {index + 1} / {total}
        </span>

        <div className="ShopDetailsMain-lightboxTools">
          <button
            type="button"
            className="ShopDetailsMain-lightboxButton"
            onClick={() => setZoomed((prev) => !prev)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            <ZoomIcon plus={!zoomed} />
          </button>
          <button
            type="button"
            className="ShopDetailsMain-lightboxButton"
            onClick={toggleFullscreen}
            aria-label={isFull ? "Exit full screen" : "Full screen"}
          >
            <FullscreenIcon />
          </button>
          <button
            ref={closeRef}
            type="button"
            className="ShopDetailsMain-lightboxButton"
            onClick={requestClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div
        className="ShopDetailsMain-lightboxStage"
        onClick={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={index}
          className={`ShopDetailsMain-lightboxFrame ${
            zoomed ? "ShopDetailsMain-lightboxFrameZoomed" : ""
          }`}
          onMouseMove={handleMove}
          onClick={() => setZoomed((prev) => !prev)}
        >
          <img
            className="ShopDetailsMain-lightboxImage"
            src={images[index].src}
            alt={images[index].alt}
            draggable="false"
            style={{
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transform: zoomed ? "scale(2.2)" : "scale(1)",
            }}
          />
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            className="ShopDetailsMain-lightboxNav ShopDetailsMain-lightboxPrev"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <PrevIcon />
          </button>
          <button
            type="button"
            className="ShopDetailsMain-lightboxNav ShopDetailsMain-lightboxNext"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <NextIcon />
          </button>

          <div className="ShopDetailsMain-lightboxThumbs">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                className={`ShopDetailsMain-lightboxThumb ${
                  i === index ? "ShopDetailsMain-lightboxThumbActive" : ""
                }`}
                onClick={() => {
                  setZoomed(false);
                  onChange(i);
                }}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={image.src} alt="" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>,
    document.body
  );
};

/* =====================================================================
   Main component
   Optional props:
     onAddToCart(product, quantity)  -> may return a Promise
     onBuyNow(product, quantity)
===================================================================== */
const ShopDetailsMain = ({
 onAddToCart, onBuyNow }) => {
  const navigate = useNavigate();
  const { artName } = useParams();
  const [searchParams] = useSearchParams();
  const artId = artName || searchParams.get("id");

  const [product, setProduct] = useState(defaultProduct);
  const [loading, setLoading] = useState(true);

  const rootRef = useRef(null);
  const detailsRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const glareRef = useRef(null);
  const motion = useRef({ tx: 50, ty: 50, x: 50, y: 50, ts: 1, s: 1, raf: 0 });

  const [inView, setInView] = useState(false);
  const [detailsInView, setDetailsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [explored, setExplored] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [cartState, setCartState] = useState("idle"); // idle | adding | added
  const [message, setMessage] = useState("");
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart: addItemToCart } = useCart();

  /* ---------- Fetch live artwork details from database ---------- */
  useEffect(() => {
    let isMounted = true;

    const fetchArtworkDetails = async () => {
      try {
        setLoading(true);
        let url = ARTS_API_URL;
        if (artId) {
          url = `${ARTS_API_URL}/${encodeURIComponent(artId)}`;
        }

        const res = await fetch(url);
        const json = await res.json();

        if (!isMounted) return;

        let art = null;
        if (json.success && json.data) {
          if (Array.isArray(json.data) && json.data.length > 0) {
            art = json.data[0];
          } else if (!Array.isArray(json.data)) {
            art = json.data;
          }
        }

        // Fallback: search client-side in full list by slug or title if not found directly
        if (!art && artId) {
          const allRes = await fetch(ARTS_API_URL);
          const allJson = await allRes.json();
          if (allJson.success && Array.isArray(allJson.data)) {
            const cleanTarget = decodeURIComponent(artId).toLowerCase().replace(/-/g, " ").trim();
            art = allJson.data.find(
              (a) =>
                (a.title && a.title.toLowerCase().trim() === cleanTarget) ||
                (a.artNo && a.artNo.toLowerCase() === cleanTarget) ||
                String(a._id) === artId
            ) || allJson.data[0];
          }
        }

        if (art) {
          const numPrice = Number(art.price) || 0;
          const numDiscount = Number(art.discount) || 0;
          const finalPrice =
            numDiscount > 0 ? numPrice * (1 - numDiscount / 100) : numPrice;

          // Format images
          let imgs = [];
          if (Array.isArray(art.photos) && art.photos.length > 0) {
            imgs = art.photos.map((p, i) => {
              let src = "";
              if (p.url) {
                src = p.url.startsWith("http")
                  ? p.url
                  : `${API_BASE_URL}${p.url}`;
              } else if (p.dataUrl) {
                src =
                  p.dataUrl.startsWith("http") || p.dataUrl.startsWith("data:")
                    ? p.dataUrl
                    : `${API_BASE_URL}${p.dataUrl}`;
              } else {
                src = [shop1, shop2, shop3, shop4][i % 4];
              }
              return {
                src,
                alt: `${art.title || "Artwork"} - view ${i + 1}`,
              };
            });
          }

          if (imgs.length === 0) {
            imgs = defaultProduct.images;
          }

          const loadedProduct = {
            ...defaultProduct,
            id: art._id || art.id,
            artNo: art.artNo || "ART-EXCLUSIVE",
            title: art.title || defaultProduct.title,
            artist: art.artistName || art.artist || defaultProduct.artist,
            price: finalPrice,
            originalPrice: numPrice,
            discount: numDiscount,
            condition: "Original Heritage Artwork",
            stock:
              art.stockQuantity !== undefined
                ? Math.max(1, Number(art.stockQuantity))
                : defaultProduct.stock,
            categories: [art.category, ...(art.tags || [])].filter(Boolean),
            deliveryCharge: 1200,
            images: imgs,

            artistInfo: [
              {
                label: "Artist Name",
                value: art.artistName || defaultProduct.artist,
              },
              {
                label: "Artwork Code",
                value: art.artNo || "ART-EXCLUSIVE",
              },
              {
                label: "Artist Overview",
                value: art.artistAbout
                  ? art.artistAbout.replace(/<[^>]*>/g, "")
                  : defaultProduct.artistInfo[2].value,
              },
              {
                label: "Category",
                value: art.category || "Traditional & Fine Art",
              },
            ],

            artworkInfo: [
              { label: "Category", value: art.category || "Fine Art Painting" },
              {
                label: "Size",
                value: art.sizeOverview || "24 x 36 inch (Height x Width)",
              },
              {
                label: "Framing",
                value:
                  art.framing === "Yes"
                    ? "Premium Wooden Frame included"
                    : "Not framed (Canvas Roll / Panel)",
              },
              {
                label: "Theme",
                value:
                  art.themeDetails || "Indian Heritage & Cultural Expression",
              },
              {
                label: "Signature",
                value: art.signature
                  ? "Signed by Artist"
                  : "Authentic Verified",
              },
              {
                label: "Authenticity",
                value:
                  art.certificate === "Yes"
                    ? "Includes Certificate of Authenticity."
                    : "Verified Genuine Artwork",
              },
            ],

            narrative: art.description || defaultProduct.narrative,
            guidelines: defaultProduct.guidelines,
          };

          setProduct(loadedProduct);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error("Failed to load artwork details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArtworkDetails();
    return () => {
      isMounted = false;
    };
  }, [artId]);

  /* ---------- enter animations ---------- */
  useEffect(() => {
    const observe = (node, setter, threshold) => {
      if (!node) return undefined;
      if (!("IntersectionObserver" in window)) {
        setter(true);
        return undefined;
      }
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            observer.disconnect();
          }
        },
        { threshold }
      );
      observer.observe(node);
      return () => observer.disconnect();
    };

    const stopA = observe(rootRef.current, setInView, 0.1);
    const stopB = observe(detailsRef.current, setDetailsInView, 0.12);
    return () => {
      stopA && stopA();
      stopB && stopB();
    };
  }, []);

  /* ---------- smooth cursor-follow image motion ---------- */
  const applyMotion = useCallback(() => {
    const m = motion.current;
    if (imgRef.current) {
      imgRef.current.style.transformOrigin = `${m.x}% ${m.y}%`;
      imgRef.current.style.transform = `scale(${m.s})`;
    }
    if (stageRef.current) {
      const rotateX = ((50 - m.y) * 0.07).toFixed(3);
      const rotateY = ((m.x - 50) * 0.07).toFixed(3);
      stageRef.current.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${m.x}% ${m.y}%, rgba(255,255,255,0.32), rgba(255,255,255,0) 46%)`;
      glareRef.current.style.opacity = String(clamp((m.s - 1) / 0.35, 0, 1));
    }
  }, []);

  const tick = useCallback(() => {
    const m = motion.current;
    m.x += (m.tx - m.x) * 0.1;
    m.y += (m.ty - m.y) * 0.1;
    m.s += (m.ts - m.s) * 0.08;
    applyMotion();

    const settled =
      Math.abs(m.tx - m.x) < 0.05 &&
      Math.abs(m.ty - m.y) < 0.05 &&
      Math.abs(m.ts - m.s) < 0.001;

    if (settled) m.raf = 0;
    else m.raf = requestAnimationFrame(tick);
  }, [applyMotion]);

  const kick = useCallback(() => {
    const m = motion.current;
    if (!m.raf) m.raf = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const m = motion.current;
    return () => cancelAnimationFrame(m.raf);
  }, []);

  useEffect(() => {
    applyMotion();
  }, [activeIndex, applyMotion]);

  const handlePointerMove = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const m = motion.current;
    m.tx = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    m.ty = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    m.ts = 1.45;
    if (!explored) setExplored(true);
    kick();
  };

  const handlePointerLeave = () => {
    const m = motion.current;
    m.tx = 50;
    m.ty = 50;
    m.ts = 1;
    kick();
  };

  /* ---------- cart ---------- */
  const total = product.price * quantity;

  const changeQuantity = (next) => {
    setQuantity(clamp(next, 1, product.stock));
    if (cartState === "added") {
      setCartState("idle");
      setMessage("");
    }
  };

  const addToCart = async () => {
    if (cartState === "adding") return;
    setCartState("adding");
    setMessage("");
    try {
      addItemToCart(product, quantity);
      if (onAddToCart) await onAddToCart(product, quantity);
      setCartState("added");
      setMessage(
        `${quantity} × "${product.title}" added to your cart.`
      );
    } catch (error) {
      setCartState("idle");
      setMessage("error");
    }
  };

  const buyNow = () => {
    addItemToCart(product, quantity);
    if (onBuyNow) onBuyNow(product, quantity);
    navigate("/cart");
  };

  const activeImage = product.images[activeIndex];

  return (
    <section
      ref={rootRef}
      className={`ShopDetailsMain ${inView ? "ShopDetailsMain-visible" : ""} ${
        detailsInView ? "ShopDetailsMain-detailsVisible" : ""
      }`}
      aria-labelledby="ShopDetailsMain-title"
    >
      <div className="ShopDetailsMain-container">
        {/* ================= Breadcrumbs ================= */}
        <nav className="ShopDetailsMain-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="ShopDetailsMain-breadcrumbLink">Home</Link>
          <span className="ShopDetailsMain-breadcrumbSep">/</span>
          <Link to="/shop" className="ShopDetailsMain-breadcrumbLink">Shop</Link>
          {product.categories?.[0] && (
            <>
              <span className="ShopDetailsMain-breadcrumbSep">/</span>
              <span className="ShopDetailsMain-breadcrumbCat">{product.categories[0]}</span>
            </>
          )}
          <span className="ShopDetailsMain-breadcrumbSep">/</span>
          <span className="ShopDetailsMain-breadcrumbCurrent">{product.title}</span>
        </nav>

        {/* ================= Gallery ================= */}
        <div className="ShopDetailsMain-gallery">
          <div className="ShopDetailsMain-mainWrap">
            <div
              className="ShopDetailsMain-frame"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <div ref={stageRef} className="ShopDetailsMain-stage">
                <div className="ShopDetailsMain-imageBox">
                  <div key={activeIndex} className="ShopDetailsMain-slide">
                    <img
                      ref={imgRef}
                      className="ShopDetailsMain-image"
                      src={activeImage.src}
                      alt={activeImage.alt}
                      draggable="false"
                    />
                  </div>
                  <span ref={glareRef} className="ShopDetailsMain-glare" aria-hidden="true" />
                </div>
              </div>

              <span className="ShopDetailsMain-corner ShopDetailsMain-cornerTop" aria-hidden="true" />
              <span className="ShopDetailsMain-corner ShopDetailsMain-cornerBottom" aria-hidden="true" />

              <span className="ShopDetailsMain-badge">Original Artwork</span>

              <span
                className={`ShopDetailsMain-hint ${explored ? "ShopDetailsMain-hintHidden" : ""}`}
                aria-hidden="true"
              >
                Move your cursor to explore the details
              </span>
            </div>
          </div>

          <ul className="ShopDetailsMain-thumbs">
            {product.images.map((image, index) => (
              <li
                key={image.src}
                className="ShopDetailsMain-thumbItem"
                style={{ "--delay": `${0.6 + index * 0.1}s` }}
              >
                <button
                  type="button"
                  className={`ShopDetailsMain-thumb ${
                    index === activeIndex ? "ShopDetailsMain-thumbActive" : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show image ${index + 1} of ${product.images.length}`}
                  aria-current={index === activeIndex}
                >
                  <img className="ShopDetailsMain-thumbImage" src={image.src} alt="" draggable="false" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ================= Details ================= */}
        <div className="ShopDetailsMain-info">
          <h1 id="ShopDetailsMain-title" className="ShopDetailsMain-title">
            {product.title}
          </h1>
          <span className="ShopDetailsMain-titleLine" aria-hidden="true" />

          <p className="ShopDetailsMain-row" style={{ "--delay": "0.3s" }}>
            <span className="ShopDetailsMain-rowLabel">Artist :</span>
            <strong className="ShopDetailsMain-rowValue">{product.artist}</strong>
          </p>

          <div className="ShopDetailsMain-row ShopDetailsMain-rowPrice" style={{ "--delay": "0.38s" }}>
            <span className="ShopDetailsMain-rowLabel">Price:</span>
            <strong className="ShopDetailsMain-price">{formatINR(product.price)}</strong>
            {product.discount > 0 && (
              <>
                <del style={{ color: "#9a8f82", fontSize: "16px", textDecoration: "line-through", marginLeft: "10px" }}>
                  {formatINR(product.originalPrice)}
                </del>
                <span style={{ color: "#9c3b2f", fontWeight: 700, fontSize: "12px", marginLeft: "8px", background: "#f9edea", padding: "2px 8px", borderRadius: "5px" }}>
                  {product.discount}% OFF
                </span>
              </>
            )}
            <span className="ShopDetailsMain-tax">Inclusive of all taxes</span>
          </div>

          <div className="ShopDetailsMain-row" style={{ "--delay": "0.46s" }}>
            <span className="ShopDetailsMain-rowLabel">Item condition:</span>
            <strong className="ShopDetailsMain-rowValue">{product.condition}</strong>
            <span className="ShopDetailsMain-stock">
              <span className="ShopDetailsMain-stockDot" aria-hidden="true" />
              In stock
            </span>
          </div>

          {/* ---------- Purchase panel ---------- */}
          <div className="ShopDetailsMain-buy" style={{ "--delay": "0.56s" }}>
            <div className="ShopDetailsMain-buyTop">
              <span className="ShopDetailsMain-buyLabel">Quantity</span>
              <div className="ShopDetailsMain-qty" role="group" aria-label="Quantity">
                <button
                  type="button"
                  className="ShopDetailsMain-qtyButton"
                  onClick={() => changeQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <MinusIcon />
                </button>
                <span className="ShopDetailsMain-qtyValue" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="ShopDetailsMain-qtyButton"
                  onClick={() => changeQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <PlusIcon />
                </button>
              </div>

              <div className="ShopDetailsMain-total">
                <span>Total</span>
                <strong key={total}>{formatINR(total)}</strong>
              </div>
            </div>

            <div className="ShopDetailsMain-actions">
              <button
                type="button"
                className={`ShopDetailsMain-cartButton ${
                  cartState === "added" ? "ShopDetailsMain-cartButtonAdded" : ""
                }`}
                onClick={addToCart}
                disabled={cartState === "adding"}
              >
                <span className="ShopDetailsMain-cartIcon">
                  {cartState === "adding" && (
                    <span className="ShopDetailsMain-spinner" aria-hidden="true" />
                  )}
                  {cartState === "added" && <CheckIcon size={22} />}
                  {cartState === "idle" && <CartIcon />}
                </span>
                <span>
                  {cartState === "adding"
                    ? "Adding..."
                    : cartState === "added"
                    ? "Added to Cart"
                    : "Add to Cart"}
                </span>
              </button>

              <button type="button" className="ShopDetailsMain-buyButton" onClick={buyNow}>
                <BoltIcon />
                <span>Buy Now</span>
              </button>
            </div>

            <p
              className={`ShopDetailsMain-status ${
                cartState === "added" ? "ShopDetailsMain-statusSuccess" : ""
              } ${message === "error" ? "ShopDetailsMain-statusError" : ""}`}
              role="status"
              aria-live="polite"
            >
              {message === "error" ? (
                "We could not add this to your cart. Please try again."
              ) : cartState === "added" ? (
                <>
                  {message} <a href="/cart">View cart</a>
                </>
              ) : (
                ""
              )}
            </p>
          </div>

          {(() => {
            const currentId = artId || product.id || product._id;
            const isWishlisted = isInWishlist(currentId);
            return (
              <button
                type="button"
                className={`ShopDetailsMain-wish ${isWishlisted ? "ShopDetailsMain-wishActive" : ""}`}
                onClick={() => {
                  const fullArt = {
                    id: currentId,
                    _id: product._id || currentId,
                    title: product.title,
                    artist: product.artist,
                    price: product.price,
                    discount: product.discount || 0,
                    originalPrice: product.originalPrice || product.price,
                    category: product.categories || [product.category || "Artwork"],
                    image: product.images?.[0]?.src || product.image || "",
                    stock: product.stock > 0,
                    description: product.narrative || product.description || "",
                  };
                  toggleWishlist(fullArt);
                }}
                aria-pressed={isWishlisted}
                style={{ "--delay": "0.66s" }}
              >
                <HeartIcon filled={isWishlisted} />
                <span>{isWishlisted ? "Added to wishlist" : "Add to wishlist"}</span>
              </button>
            );
          })()}

          <div className="ShopDetailsMain-meta" style={{ "--delay": "0.74s" }}>
            <span className="ShopDetailsMain-metaLabel">Categories:</span>
            <ul className="ShopDetailsMain-tags">
              {product.categories.map((category) => (
                <li key={category} className="ShopDetailsMain-tag">
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Assurance ---------- */}
          <div className="ShopDetailsMain-assure" style={{ "--delay": "0.82s" }}>
            <ul className="ShopDetailsMain-assureList">
              <li className="ShopDetailsMain-assureItem">
                <CheckIcon />
                <span>Shipping : Less than one week</span>
              </li>
              <li className="ShopDetailsMain-assureItem">
                <CheckIcon />
                <span>Secure delivery : Across India + {formatINR(product.deliveryCharge)}</span>
              </li>
              <li className="ShopDetailsMain-assureItem">
                <CheckIcon />
                <span>Free returns within two weeks</span>
              </li>
              <li className="ShopDetailsMain-assureItem">
                <CheckIcon />
                <span>Authenticity certificate</span>
              </li>
              <li className="ShopDetailsMain-assureItem">
                <CheckIcon />
                <span>Secured payment gateways</span>
              </li>
            </ul>

            <ul className="ShopDetailsMain-pay" aria-label="Accepted payment methods">
              <li className="ShopDetailsMain-payItem ShopDetailsMain-payUpi">UPI</li>
              <li className="ShopDetailsMain-payItem ShopDetailsMain-payVisa">VISA</li>
              <li className="ShopDetailsMain-payItem ShopDetailsMain-payMaster">
                <span className="ShopDetailsMain-payCircle ShopDetailsMain-payRed" />
                <span className="ShopDetailsMain-payCircle ShopDetailsMain-payOrange" />
              </li>
              <li className="ShopDetailsMain-payItem ShopDetailsMain-payRupay">RuPay</li>
            </ul>
          </div>

          <p className="ShopDetailsMain-ask" style={{ "--delay": "0.9s" }}>
            Have any question? <a href="/contact">Ask Us</a>
          </p>
        </div>
      </div>

      {/* ================= About the artwork ================= */}
      <div className="ShopDetailsMain-details" ref={detailsRef}>
        <div className="ShopDetailsMain-detailsHead">
          <h2 className="ShopDetailsMain-detailsTitle">About this artwork</h2>
          <p className="ShopDetailsMain-detailsText">
            The artist, the piece and how to care for it, all in one place.
          </p>
        </div>

        <div className="ShopDetailsMain-detailsGrid">
          <article className="ShopDetailsMain-card" style={{ "--delay": "0s" }}>
            <header className="ShopDetailsMain-cardHead">
              <span className="ShopDetailsMain-cardIcon">
                <UserIcon />
              </span>
              <h3 className="ShopDetailsMain-cardTitle">Artist Overview</h3>
            </header>
            <dl className="ShopDetailsMain-list">
              {product.artistInfo.map((entry) => (
                <div key={entry.label} className="ShopDetailsMain-listItem">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="ShopDetailsMain-card ShopDetailsMain-cardFeature" style={{ "--delay": "0.12s" }}>
            <header className="ShopDetailsMain-cardHead">
              <span className="ShopDetailsMain-cardIcon">
                <FrameIcon />
              </span>
              <h3 className="ShopDetailsMain-cardTitle">Exploring the Artwork</h3>
            </header>
            <dl className="ShopDetailsMain-list ShopDetailsMain-listTwo">
              {product.artworkInfo.map((entry) => (
                <div key={entry.label} className="ShopDetailsMain-listItem">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="ShopDetailsMain-card" style={{ "--delay": "0.24s" }}>
            <header className="ShopDetailsMain-cardHead">
              <span className="ShopDetailsMain-cardIcon">
                <BookIcon />
              </span>
              <h3 className="ShopDetailsMain-cardTitle">Inner Narrative &amp; Guidelines</h3>
            </header>

            <h4 className="ShopDetailsMain-subTitle">Inner Narrative of This Artwork</h4>
            {typeof product.narrative === "string" && product.narrative.includes("<") ? (
              <div
                className="ShopDetailsMain-narrative"
                dangerouslySetInnerHTML={{ __html: product.narrative }}
              />
            ) : (
              <p className="ShopDetailsMain-narrative">{product.narrative}</p>
            )}

            <div className="ShopDetailsMain-rule" aria-hidden="true" />

            <h4 className="ShopDetailsMain-subTitle">Guidelines for the Artwork</h4>
            <ul className="ShopDetailsMain-guides">
              {product.guidelines.map((guide) => (
                <li key={guide}>
                  <CheckIcon size={16} />
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ShopDetailsMain;