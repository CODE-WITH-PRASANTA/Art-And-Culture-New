
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import shop1 from "../../assets/shop-details-1.webp";
import shop2 from "../../assets/shop-details-2.webp";
import shop3 from "../../assets/shop-details-3.webp";
import shop4 from "../../assets/shop-details-4.webp";

import "./ShopDetailsMain.css";

const product = {
  title: "Whispers of Colors in Silent Shadows",
  artist: "Henri Matisse",
  currentBid: 34000,
  step: 500,
  condition: "New",
  endsAt: new Date("2027-03-30T00:00:00+05:30"),
  reserveMet: true,
  category: "Oil Painting",
  size: "75 × 60 cm",
  framing: "Unframed",
  theme: "Nature & Animals",
  signature: "Artist signed",
  authenticity: "Certificate of authenticity included",
  deliveryCharge: 1200,
  categories: ["Nature", "Painting", "Sculpture", "Street Art"],
  tags: ["Painting", "Poetry", "Sculpture"],
  images: [
    { src: shop1, alt: "Watercolour historic street with carriage" },
    { src: shop2, alt: "Coastal horseback artwork" },
    { src: shop3, alt: "Floral doorway impressionist art" },
    { src: shop4, alt: "Vintage town walkway with lantern" },
  ],
};

const formatINR = (value) =>
  Number(value).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const formatEnding = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date) + " IST";

const pad = (value) => String(value).padStart(2, "0");

const Icon = ({ children, size = 20, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const CheckIcon = () => (
  <Icon size={17} className="ShopDetailsMain-checkIcon">
    <path d="m5 12 4 4L19 6" />
  </Icon>
);

const HeartIcon = ({ filled }) => (
  <Icon size={19} className="ShopDetailsMain-heartIcon">
    <path
      d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
      fill={filled ? "currentColor" : "none"}
    />
  </Icon>
);

const Countdown = ({ endsAt, onEnd }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const total = Math.max(
    0,
    Math.floor((endsAt.getTime() - now) / 1000)
  );

  useEffect(() => {
    if (total === 0) onEnd();
  }, [total, onEnd]);

  const parts = [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hours", value: Math.floor((total % 86400) / 3600) },
    { label: "Minutes", value: Math.floor((total % 3600) / 60) },
    { label: "Seconds", value: total % 60 },
  ];

  return (
    <div className="ShopDetailsMain-countdown" role="timer">
      {parts.map((part, index) => (
        <div
          key={part.label}
          className="ShopDetailsMain-countdownUnit"
        >
          <strong className="ShopDetailsMain-countdownValue">
            {index === 0 ? part.value : pad(part.value)}
          </strong>
          <span className="ShopDetailsMain-countdownLabel">
            {part.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const ShopDetailsMainLightbox = ({
  images,
  index,
  onChange,
  onClose,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(onClose, 220);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document
          .querySelector(".ShopDetailsMain-lightbox")
          ?.requestFullscreen?.();
      }
    } catch {
      // Fullscreen is optional; the lightbox remains usable.
    }
  };

  return createPortal(
    <div
      className={`ShopDetailsMain-lightbox ${
        closing ? "ShopDetailsMain-lightboxClosing" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Artwork image gallery"
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div className="ShopDetailsMain-lightboxBar">
        <span className="ShopDetailsMain-lightboxCount">
          {index + 1} / {images.length}
        </span>

        <div className="ShopDetailsMain-lightboxTools">
          <button
            type="button"
            className="ShopDetailsMain-lightboxBtn"
            onClick={() => setZoomed((value) => !value)}
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            <Icon>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4M11 8v6M8 11h6" />
            </Icon>
          </button>

          <button
            type="button"
            className="ShopDetailsMain-lightboxBtn"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            <Icon>
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </Icon>
          </button>

          <button
            type="button"
            className="ShopDetailsMain-lightboxBtn"
            onClick={requestClose}
            aria-label="Close image gallery"
          >
            <Icon>
              <path d="m6 6 12 12M18 6 6 18" />
            </Icon>
          </button>
        </div>
      </div>

      <div className="ShopDetailsMain-lightboxStage">
        <div
          className={`ShopDetailsMain-lightboxFrame ${
            zoomed ? "ShopDetailsMain-lightboxFrameZoomed" : ""
          }`}
          onClick={() => setZoomed((value) => !value)}
        >
          <img
            className="ShopDetailsMain-lightboxImage"
            src={images[index].src}
            alt={images[index].alt}
            style={{ transform: zoomed ? "scale(1.8)" : "scale(1)" }}
          />
        </div>
      </div>

      <div className="ShopDetailsMain-lightboxThumbs">
        {images.map((image, imageIndex) => (
          <button
            key={image.src}
            type="button"
            className={`ShopDetailsMain-lightboxThumb ${
              imageIndex === index
                ? "ShopDetailsMain-lightboxThumbActive"
                : ""
            }`}
            onClick={() => {
              setZoomed(false);
              onChange(imageIndex);
            }}
            aria-label={`View image ${imageIndex + 1}`}
            aria-pressed={imageIndex === index}
          >
            <img src={image.src} alt="" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};

const ShopDetailsMain = ({ onBid }) => {
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentBid, setCurrentBid] = useState(product.currentBid);
  const [amount, setAmount] = useState(
    product.currentBid + product.step
  );
  const [liked, setLiked] = useState(false);
  const [youLead, setYouLead] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [ended, setEnded] = useState(
    () => product.endsAt.getTime() <= Date.now()
  );
  const [status, setStatus] = useState({
    type: "idle",
    text: "",
  });

  const minBid = currentBid + product.step;
  const activeImage = product.images[activeIndex];

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const changeAmount = (value) => {
    setAmount(value);
    setStatus({ type: "idle", text: "" });
  };

  const stepAmount = (direction) => {
    changeAmount(Math.max(minBid, amount + direction * product.step));
  };

  const placeBid = async () => {
    if (ended || placing) return;

    if (!Number.isFinite(amount) || amount < minBid) {
      setAmount(minBid);
      setStatus({
        type: "error",
        text: `Your minimum bid must be ${formatINR(minBid)}.`,
      });
      return;
    }

    setPlacing(true);
    setStatus({ type: "idle", text: "" });

    try {
      if (onBid) {
        await onBid(amount);
      } else {
        // Demo only: connect onBid to your auction backend.
        await new Promise((resolve) => setTimeout(resolve, 650));
      }

      setCurrentBid(amount);
      setAmount(amount + product.step);
      setYouLead(true);
      setStatus({
        type: "success",
        text: `Demo bid of ${formatINR(amount)} submitted successfully.`,
      });
    } catch {
      setStatus({
        type: "error",
        text: "Unable to submit your bid. Please try again.",
      });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <section
      ref={rootRef}
      className={`ShopDetailsMain ${
        inView ? "ShopDetailsMain-visible" : ""
      }`}
    >
      <div className="ShopDetailsMain-container">
        {/* LEFT: FOUR-IMAGE GALLERY */}
        <div className="ShopDetailsMain-gallery">
          <div className="ShopDetailsMain-frame">
            <div className="ShopDetailsMain-imageBox">
              <img
                key={activeImage.src}
                className="ShopDetailsMain-image"
                src={activeImage.src}
                alt={activeImage.alt}
                draggable="false"
              />
            </div>

            <span className="ShopDetailsMain-imageCounter">
              {pad(activeIndex + 1)} / {pad(product.images.length)}
            </span>

            <button
              type="button"
              className="ShopDetailsMain-zoomBtn"
              onClick={() => setLightboxOpen(true)}
              aria-label="Enlarge artwork"
            >
              <Icon size={19}>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4M11 8v6M8 11h6" />
              </Icon>
            </button>
          </div>

          <div
            className="ShopDetailsMain-thumbStrip"
            aria-label="Choose artwork image"
          >
            {product.images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={`ShopDetailsMain-thumb ${
                  index === activeIndex
                    ? "ShopDetailsMain-thumbActive"
                    : ""
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Select artwork image ${index + 1}`}
                aria-pressed={index === activeIndex}
              >
                <img
                  className="ShopDetailsMain-thumbImg"
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  draggable="false"
                />
              </button>
            ))}
          </div>

          <div className="ShopDetailsMain-galleryNote">
            <span className="ShopDetailsMain-galleryNoteIcon">✳</span>
            <div>
              <strong>Art worth looking closer at.</strong>
              <p>Explore all four views of this artwork.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: AUCTION DETAILS */}
        <div className="ShopDetailsMain-info">
          <div className="ShopDetailsMain-eyebrow">
            <span />
            ART & CULTURE COLLECTION
          </div>

          <h1 className="ShopDetailsMain-title">{product.title}</h1>

          <div className="ShopDetailsMain-field">
            <span className="ShopDetailsMain-label">Artist</span>
            <strong className="ShopDetailsMain-value">
              {product.artist}
            </strong>
          </div>

          <div className="ShopDetailsMain-field">
            <span className="ShopDetailsMain-label">Current bid</span>
            <strong className="ShopDetailsMain-price">
              {formatINR(currentBid)}
            </strong>
            {youLead && (
              <span className="ShopDetailsMain-leadBadge">
                <CheckIcon /> You lead
              </span>
            )}
          </div>

          <div className="ShopDetailsMain-field">
            <span className="ShopDetailsMain-label">Condition</span>
            <strong className="ShopDetailsMain-value">
              {product.condition}
            </strong>
          </div>

          <div className="ShopDetailsMain-timerBox">
            <span className="ShopDetailsMain-timerHeading">
              Auction ends in
            </span>

            <Countdown
              endsAt={product.endsAt}
              onEnd={() => setEnded(true)}
            />

            <div className="ShopDetailsMain-timerFooter">
              <span>Ending: {formatEnding(product.endsAt)}</span>
              <span>Timezone: IST (UTC+5:30)</span>
            </div>

            {product.reserveMet && (
              <p className="ShopDetailsMain-reserveMet">
                <CheckIcon /> Reserve price has been met
              </p>
            )}

            {ended && (
              <p className="ShopDetailsMain-endedMessage">
                This auction has ended.
              </p>
            )}
          </div>

          <div className="ShopDetailsMain-actionRow">
            <div className="ShopDetailsMain-stepper">
              <button
                type="button"
                className="ShopDetailsMain-stepBtn"
                onClick={() => stepAmount(-1)}
                disabled={ended || amount <= minBid}
                aria-label="Decrease bid"
              >
                −
              </button>

              <output className="ShopDetailsMain-input">
                {formatINR(amount)}
              </output>

              <button
                type="button"
                className="ShopDetailsMain-stepBtn"
                onClick={() => stepAmount(1)}
                disabled={ended}
                aria-label="Increase bid"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="ShopDetailsMain-bidBtn"
              onClick={placeBid}
              disabled={ended || placing}
            >
              {placing ? "Submitting..." : ended ? "Ended" : "Place Bid"}
              {!placing && !ended && <span>↗</span>}
            </button>
          </div>

          <p className="ShopDetailsMain-minimumBid">
            Minimum next bid: {formatINR(minBid)}
          </p>

          {status.text && (
            <div
              className={`ShopDetailsMain-alert ShopDetailsMain-alert-${status.type}`}
              role="status"
            >
              {status.text}
            </div>
          )}

          <button
            type="button"
            className={`ShopDetailsMain-wishlist ${
              liked ? "ShopDetailsMain-wishlistActive" : ""
            }`}
            onClick={() => setLiked((value) => !value)}
            aria-pressed={liked}
          >
            <HeartIcon filled={liked} />
            {liked ? "Added to wishlist" : "Add to wishlist"}
          </button>

          <div className="ShopDetailsMain-taxonomies">
            <div className="ShopDetailsMain-taxoRow">
              <strong>Categories:</strong>
              <span>{product.categories.join(", ")}</span>
            </div>
            <div className="ShopDetailsMain-taxoRow">
              <strong>Tags:</strong>
              <span>{product.tags.join(", ")}</span>
            </div>
          </div>

          <div className="ShopDetailsMain-perks">
            <ul className="ShopDetailsMain-perkList">
              <li><CheckIcon /> <span>Shipping in less than one week</span></li>
              <li>
                <CheckIcon />
                <span>Delivery across India: {formatINR(product.deliveryCharge)}</span>
              </li>
              <li><CheckIcon /> <span>Returns within two weeks, subject to policy</span></li>
              <li><CheckIcon /> <span>Authenticity certificate included</span></li>
              <li><CheckIcon /> <span>Secure payment options at checkout</span></li>
            </ul>

            <div className="ShopDetailsMain-cardLogos">
              <span>UPI</span>
              <span>VISA</span>
              <span>RuPay</span>
              <span>Mastercard</span>
            </div>
          </div>

          <p className="ShopDetailsMain-contactNote">
            Have a question? <a href="#contact">Ask Us</a>
          </p>
        </div>
      </div>

      {/* BOTTOM: THREE INFORMATION CARDS */}
      <div className="ShopDetailsMain-bottom">
        <article className="ShopDetailsMain-detailCard ShopDetailsMain-artistCard">
          <span className="ShopDetailsMain-detailEyebrow">THE CREATOR</span>
          <h2>Artist Overview</h2>

          <div className="ShopDetailsMain-detailItem">
            <h3>Artist</h3>
            <p>{product.artist}</p>
          </div>

          <div className="ShopDetailsMain-detailItem">
            <h3>Artistic style</h3>
            <p>Expressive colour, composition and visual storytelling.</p>
          </div>

          <div className="ShopDetailsMain-detailItem">
            <h3>Collection</h3>
            <p>Art & Culture curated artwork collection.</p>
          </div>
        </article>

        <article className="ShopDetailsMain-detailCard ShopDetailsMain-artworkCard">
          <span className="ShopDetailsMain-detailEyebrow">ARTWORK DETAILS</span>
          <h2>Exploring the Artwork</h2>

          <div className="ShopDetailsMain-detailItem">
            <h3>Category</h3>
            <p>{product.category}</p>
          </div>

          <div className="ShopDetailsMain-detailItem">
            <h3>Size</h3>
            <p>{product.size}</p>
          </div>

          <div className="ShopDetailsMain-detailItem">
            <h3>Framing</h3>
            <p>{product.framing}</p>
          </div>

          <div className="ShopDetailsMain-detailItem">
            <h3>Theme</h3>
            <p>{product.theme}</p>
          </div>

          <div className="ShopDetailsMain-detailItem">
            <h3>Signature & authenticity</h3>
            <p>{product.signature}. {product.authenticity}.</p>
          </div>
        </article>

        <article className="ShopDetailsMain-detailCard ShopDetailsMain-careCard">
          <span className="ShopDetailsMain-detailEyebrow">PRESERVE ITS BEAUTY</span>
          <h2>Artwork Care & Guidelines</h2>

          <p className="ShopDetailsMain-careIntro">
            Keep your artwork beautiful with a little everyday care.
          </p>

          <ul className="ShopDetailsMain-careList">
            <li>Keep away from direct sunlight.</li>
            <li>Avoid moisture and excessive humidity.</li>
            <li>Dust gently with a soft, dry cloth.</li>
            <li>Handle carefully when moving or framing.</li>
          </ul>

          <div className="ShopDetailsMain-careNote">
            <CheckIcon />
            <span>Carefully handle and store your artwork.</span>
          </div>
        </article>
      </div>

      {lightboxOpen && (
        <ShopDetailsMainLightbox
          images={product.images}
          index={activeIndex}
          onChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
};

export default ShopDetailsMain;
