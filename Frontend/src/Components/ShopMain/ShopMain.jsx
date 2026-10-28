import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import shop1 from "../../assets/shop-1.webp";
import shop2 from "../../assets/shop-2.webp";
import shop3 from "../../assets/shop-3.webp";
import shop4 from "../../assets/shop-4.webp";
import shop5 from "../../assets/shop-5.webp";
import shop6 from "../../assets/shop-6.webp";
import "./ShopMain.css";

/* =====================================================================
   IMAGES  (src/assets/shop-1.webp ... shop-6.webp)
   The 18 sample artworks below cycle through these 6 images.
   To add more images: import them above and add them to `shopImages`.
===================================================================== */
const shopImages = [shop1, shop2, shop3, shop4, shop5, shop6];
const PER_PAGE = 6;
import { API_BASE_URL, ARTS_API_URL, CATEGORIES_API_URL } from "../../config/api";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const getArtImage = (art, fallbackIndex = 0) => {
  if (art.photos && art.photos.length > 0) {
    const p = art.photos[0];
    if (p.url) {
      if (p.url.startsWith("http")) return p.url;
      return `${API_BASE_URL}${p.url}`;
    }
    if (p.dataUrl) {
      if (p.dataUrl.startsWith("http") || p.dataUrl.startsWith("data:")) return p.dataUrl;
      return `${API_BASE_URL}${p.dataUrl}`;
    }
  }
  if (art.image) {
    if (art.image.startsWith("http") || art.image.startsWith("data:")) return art.image;
    return `${API_BASE_URL}${art.image}`;
  }
  return shopImages[fallbackIndex % shopImages.length];
};

const priceOptions = [
  { value: "under20", label: "Under ₹20,000", min: 0, max: 20000 },
  { value: "20to35", label: "₹20,000 – ₹35,000", min: 20000, max: 35000 },
  { value: "35to60", label: "₹35,000 – ₹60,000", min: 35000, max: 60000 },
  { value: "above60", label: "Above ₹60,000", min: 60000, max: Infinity },
];

const sortOptions = [
  { value: "default", label: "Default Sorting" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "az", label: "Title: A to Z" },
];

const emptyFilters = { category: [], artist: [], price: [] };
const ARTIST_PREVIEW = 8;

/* ---------------- Helpers ---------------- */
const formatMoney = (value) =>
  value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const pad = (value) => String(value).padStart(2, "0");

const getPageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("gap");
    result.push(page);
  });
  return result;
};

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

const SearchIcon = () => (
  <svg {...baseIcon} width="20" height="20">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg {...baseIcon} width="19" height="19" fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.8 3.4 4.5 6.7 4.5c2 0 3.4 1.1 5.3 3.1 1.9-2 3.3-3.1 5.3-3.1 3.3 0 5 3.3 3.9 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
  </svg>
);

const CartIcon = ({ size = 18 }) => (
  <svg {...baseIcon} width={size} height={size}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3.5h2.6l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.1a1.6 1.6 0 0 0 1.6-1.2l1.5-6.6H6.1" />
  </svg>
);

const EyeIcon = () => (
  <svg {...baseIcon} width="17" height="17">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ChevronIcon = () => (
  <svg {...baseIcon} width="16" height="16">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CloseIcon = ({ size = 18 }) => (
  <svg {...baseIcon} width={size} height={size}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const FilterIcon = () => (
  <svg {...baseIcon} width="18" height="18">
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

const CheckIcon = ({ size = 14, stroke = 3 }) => (
  <svg {...baseIcon} width={size} height={size} strokeWidth={stroke}>
    <path d="M5 12.5 10 17.5 19 7.5" />
  </svg>
);

const GridTwoIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <rect x="4" y="4" width="6.5" height="16" rx="1.2" />
    <rect x="13.5" y="4" width="6.5" height="16" rx="1.2" />
  </svg>
);

const GridThreeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <rect x="3" y="4" width="4.6" height="16" rx="1.1" />
    <rect x="9.7" y="4" width="4.6" height="16" rx="1.1" />
    <rect x="16.4" y="4" width="4.6" height="16" rx="1.1" />
  </svg>
);

/* ---------------- Hooks ---------------- */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
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
      { threshold, rootMargin: "0px 0px -4% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

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

/* ---------------- Product card ---------------- */
const ShopMainCard = ({ item, index, liked, inCart, onLike, onCart, onView }) => {
  const navigate = useNavigate();
  const [ref, inView] = useInView(0.12);
  const [failed, setFailed] = useState(false);
  const artUrl = `/shop/${toArtSlug(item.title, item.id)}`;

  return (
    <article
      ref={ref}
      className={`ShopMain-card ${inView ? "ShopMain-cardVisible" : ""}`}
      style={{ "--delay": `${(index % PER_PAGE) * 0.07}s` }}
    >
      <div className="ShopMain-media">
        <div
          className="ShopMain-imageWrap"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            if (e.target.closest(".ShopMain-view")) return;
            navigate(artUrl);
          }}
        >
          {!failed && (
            <img
              className="ShopMain-image"
              src={item.image}
              alt={`${item.title} by ${item.artist}`}
              loading="lazy"
              onError={() => setFailed(true)}
            />
          )}
          <span className="ShopMain-imageShade" aria-hidden="true" />
          <button
            type="button"
            className="ShopMain-view"
            onClick={(e) => {
              e.stopPropagation();
              if (onView) onView(item);
            }}
          >
            <EyeIcon />
            <span>Quick View</span>
          </button>
        </div>

        <button
          type="button"
          className={`ShopMain-like ${liked ? "ShopMain-likeActive" : ""}`}
          onClick={() => onLike(item)}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={liked} />
        </button>

        {item.discount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "#8f382a",
              color: "#fff",
              padding: "3px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              zIndex: 3,
            }}
          >
            {item.discount}% OFF
          </span>
        )}

        <span className="ShopMain-tag">{item.category}</span>
      </div>

      <div className="ShopMain-cardBody">
        <h3
          className="ShopMain-cardTitle"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(artUrl)}
        >
          {item.title}
        </h3>

        <p className="ShopMain-cardMeta">
          <span>Artist:</span> <strong>{item.artist}</strong>
        </p>

        <p className="ShopMain-cardMeta ShopMain-cardPrice">
          <span>Price:</span> <strong>{formatMoney(item.price)}</strong>
          {item.discount > 0 && (
            <span
              style={{
                marginLeft: "8px",
                textDecoration: "line-through",
                color: "#998e82",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              {formatMoney(item.originalPrice)}
            </span>
          )}
        </p>

        <button
          type="button"
          className={`ShopMain-cartButton ${inCart ? "ShopMain-cartAdded" : ""}`}
          onClick={() => onCart(item)}
          aria-pressed={inCart}
          disabled={item.stock <= 0}
        >
          <span className="ShopMain-cartIcon">
            {inCart ? <CheckIcon size={17} stroke={2.6} /> : <CartIcon />}
          </span>
          <span>
            {item.stock <= 0
              ? "Out of Stock"
              : inCart
              ? "Added to Cart"
              : "Add to Cart"}
          </span>
        </button>
      </div>
    </article>
  );
};

/* ---------------- Sidebar filter group ---------------- */
const ShopMainGroup = ({
  id,
  title,
  options,
  selected,
  onToggle,
  counts,
  open,
  onOpen,
  index,
  preview,
}) => {
  const [showAll, setShowAll] = useState(false);
  const list = preview && !showAll ? options.slice(0, preview) : options;

  return (
    <div
      className={`ShopMain-group ${open ? "ShopMain-groupOpen" : ""}`}
      style={{ "--delay": `${0.2 + index * 0.08}s` }}
    >
      <button
        type="button"
        className="ShopMain-groupHead"
        onClick={() => onOpen(id)}
        aria-expanded={open}
        aria-controls={`ShopMain-group-${id}`}
      >
        <h3 className="ShopMain-groupTitle">{title}</h3>
        <span className="ShopMain-groupChevron">
          <ChevronIcon />
        </span>
      </button>

      <div className="ShopMain-groupPanel" id={`ShopMain-group-${id}`}>
        <div className="ShopMain-groupInner">
          <ul className="ShopMain-options">
            {list.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const label = typeof option === "string" ? option : option.label;
              const checked = selected.includes(value);

              return (
                <li key={value} className="ShopMain-optionItem">
                  <label className="ShopMain-option">
                    <input
                      className="ShopMain-optionInput"
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(id, value)}
                    />
                    <span className="ShopMain-optionBox" aria-hidden="true">
                      <CheckIcon />
                    </span>
                    <span className="ShopMain-optionLabel">{label}</span>
                    
                  </label>
                </li>
              );
            })}
          </ul>

          {preview && options.length > preview && (
            <button
              type="button"
              className="ShopMain-more"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show less" : `Show all (${options.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* =====================================================================
   Main component
   Optional props:  onAddToCart(item, added)   onView(item)
===================================================================== */
const ShopMain = ({ onAddToCart, onView }) => {
  const navigate = useNavigate();
  const [rootRef, rootInView] = useInView(0.05);
  const resultsRef = useRef(null);
  const firstRender = useRef(true);
  const toastTimer = useRef(null);

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendCategories, setBackendCategories] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("default");
  const [columns, setColumns] = useState(3);
  const [page, setPage] = useState(1);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCart, addToCart, removeFromCart } = useCart();
  const [toast, setToast] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    category: true,
    artist: true,
    price: true,
  });

  /* Fetch live artworks and categories from database */
  useEffect(() => {
    let isMounted = true;
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const [artsRes, catsRes] = await Promise.all([
          fetch(`${ARTS_API_URL}?isPublished=true`).then((r) => r.json()).catch(() => ({ success: false })),
          fetch(CATEGORIES_API_URL).then((r) => r.json()).catch(() => ({ success: false })),
        ]);

        if (!isMounted) return;

        if (artsRes.success && Array.isArray(artsRes.data)) {
          const publishedArts = artsRes.data.filter((art) => {
            return art.isPublished !== false && art.status !== "Unpublished";
          });

          const mapped = publishedArts.map((art, idx) => {
            const numPrice = Number(art.price) || 0;
            const numDiscount = Number(art.discount) || 0;
            const finalPrice =
              numDiscount > 0 ? numPrice * (1 - numDiscount / 100) : numPrice;

            return {
              ...art,
              id: art._id || art.id || `art-${idx}`,
              title: art.title || "Untitled Artwork",
              artist: art.artistName || art.artist || "Unknown Artist",
              category: art.category || "General",
              price: finalPrice,
              originalPrice: numPrice,
              discount: numDiscount,
              image: getArtImage(art, idx),
              stock:
                art.stockQuantity !== undefined
                  ? Number(art.stockQuantity)
                  : Number(art.stock || 0),
            };
          });
          setArtworks(mapped);
        } else {
          setArtworks([]);
        }

        if (catsRes.success && Array.isArray(catsRes.data)) {
          setBackendCategories(catsRes.data.map((c) => c.name));
        }
      } catch (err) {
        console.error("Failed to load shop artworks:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchShopData();
    return () => {
      isMounted = false;
    };
  }, []);

  /* Categories and Artists dynamically computed from database */
  const categoryOptions = useMemo(() => {
    const set = new Set(backendCategories);
    artworks.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set).filter(Boolean);
  }, [backendCategories, artworks]);

  const artistOptions = useMemo(() => {
    const set = new Set();
    artworks.forEach((a) => {
      if (a.artist) set.add(a.artist);
    });
    return Array.from(set).filter(Boolean);
  }, [artworks]);

  /* Counters shown beside each filter option */
  const counts = useMemo(() => {
    const result = { category: {}, artist: {}, price: {} };
    artworks.forEach((item) => {
      if (item.category) {
        result.category[item.category] = (result.category[item.category] || 0) + 1;
      }
      if (item.artist) {
        result.artist[item.artist] = (result.artist[item.artist] || 0) + 1;
      }
      const range = priceOptions.find((p) => item.price >= p.min && item.price < p.max);
      if (range) result.price[range.value] = (result.price[range.value] || 0) + 1;
    });
    return result;
  }, [artworks]);

  /* Filter + sort */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const ranges = priceOptions.filter((p) => filters.price.includes(p.value));

    const list = artworks.filter((item) => {
      if (
        query &&
        !item.artist.toLowerCase().includes(query) &&
        !item.title.toLowerCase().includes(query) &&
        !(item.category || "").toLowerCase().includes(query) &&
        !(item.tags || []).some((t) => String(t).toLowerCase().includes(query))
      )
        return false;
      if (filters.category.length && !filters.category.includes(item.category))
        return false;
      if (filters.artist.length && !filters.artist.includes(item.artist))
        return false;
      if (ranges.length && !ranges.some((r) => item.price >= r.min && item.price < r.max))
        return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "priceLow") sorted.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") sorted.sort((a, b) => b.price - a.price);
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [artworks, search, filters, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );
  const activeCount =
    filters.category.length + filters.artist.length + filters.price.length;

  /* Bring the results into view when the page changes */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  /* Mobile filter drawer: lock page scroll + close with Escape */
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------------- Handlers ---------------- */
  const toggleFilter = (group, value) => {
    setFilters((prev) => {
      const has = prev[group].includes(value);
      return {
        ...prev,
        [group]: has
          ? prev[group].filter((v) => v !== value)
          : [...prev[group], value],
      };
    });
    setPage(1);
  };

  const clearAll = () => {
    setFilters(emptyFilters);
    setSearch("");
    setPage(1);
  };

  const toggleGroup = (id) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleLike = (item) => {
    const added = toggleWishlist(item);
    showToast(added ? "Added to your wishlist" : "Removed from your wishlist");
  };

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const toggleCart = (item) => {
    const itemId = item.id || item._id;
    const inCartAlready = isInCart(itemId);
    if (inCartAlready) {
      removeFromCart(itemId);
      showToast(`"${item.title}" removed from cart`);
      if (onAddToCart) onAddToCart(item, false);
    } else {
      addToCart(item, 1);
      showToast(`"${item.title}" added to your cart`);
      if (onAddToCart) onAddToCart(item, true);
    }
  };

  const goToPage = (value) => {
    if (value < 1 || value > totalPages || value === currentPage) return;
    setPage(value);
  };

  const labelFor = (group, value) =>
    group === "price" ? priceOptions.find((o) => o.value === value).label : value;

  const chips = Object.keys(filters).flatMap((group) =>
    filters[group].map((value) => ({ group, value }))
  );

  return (
    <section
      ref={rootRef}
      className={`ShopMain ${rootInView ? "ShopMain-visible" : ""}`}
      aria-label="Art & Culture shop"
    >
      <div className="ShopMain-container">
        {/* ================= Sidebar ================= */}
        <div
          className={`ShopMain-overlay ${drawerOpen ? "ShopMain-overlayOpen" : ""}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        <aside
          className={`ShopMain-sidebar ${drawerOpen ? "ShopMain-sidebarOpen" : ""}`}
          aria-label="Shop filters"
        >
          <div className="ShopMain-sidebarHead">
            <h2 className="ShopMain-sidebarTitle">Filters</h2>
            <button
              type="button"
              className="ShopMain-sidebarClose"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
            >
              <CloseIcon />
            </button>
          </div>

          <form
            className="ShopMain-search"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="ShopMain-searchInput"
              type="search"
              placeholder="Search artist or artwork"
              aria-label="Search artist or artwork"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <button type="submit" className="ShopMain-searchButton" aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          <div className="ShopMain-groups">
            <ShopMainGroup
              id="category"
              index={0}
              title="Category"
              options={categoryOptions}
              selected={filters.category}
              onToggle={toggleFilter}
              counts={counts.category}
              open={openGroups.category}
              onOpen={toggleGroup}
            />
            <ShopMainGroup
              id="artist"
              index={1}
              title="Artist Name"
              options={artistOptions}
              selected={filters.artist}
              onToggle={toggleFilter}
              counts={counts.artist}
              open={openGroups.artist}
              onOpen={toggleGroup}
              preview={ARTIST_PREVIEW}
            />
            <ShopMainGroup
              id="price"
              index={2}
              title="Price Range"
              options={priceOptions}
              selected={filters.price}
              onToggle={toggleFilter}
              counts={counts.price}
              open={openGroups.price}
              onOpen={toggleGroup}
            />
          </div>

          <div className="ShopMain-sidebarFoot">
            <button
              type="button"
              className="ShopMain-clear"
              onClick={clearAll}
              disabled={activeCount === 0 && !search}
            >
              Clear all filters
            </button>
            <button
              type="button"
              className="ShopMain-apply"
              onClick={() => setDrawerOpen(false)}
            >
              Show {total} {total === 1 ? "result" : "results"}
            </button>
          </div>
        </aside>

        {/* ================= Results ================= */}
        <div className="ShopMain-main" ref={resultsRef}>
          <div className="ShopMain-toolbar">
            <button
              type="button"
              className="ShopMain-filterButton"
              onClick={() => setDrawerOpen(true)}
            >
              <FilterIcon />
              <span>Filters</span>
              {activeCount > 0 && (
                <span className="ShopMain-filterCount">{activeCount}</span>
              )}
            </button>

            <div className="ShopMain-tools">

              <div className="ShopMain-selectWrap">
                <select
                  className="ShopMain-select"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Sort artworks"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="ShopMain-selectIcon" aria-hidden="true">
                  <ChevronIcon />
                </span>
              </div>

              <div className="ShopMain-views" role="group" aria-label="Grid layout">
                <button
                  type="button"
                  className={`ShopMain-viewButton ${columns === 2 ? "ShopMain-viewActive" : ""}`}
                  onClick={() => setColumns(2)}
                  aria-label="Two columns"
                  aria-pressed={columns === 2}
                >
                  <GridTwoIcon />
                </button>
                <button
                  type="button"
                  className={`ShopMain-viewButton ${columns === 3 ? "ShopMain-viewActive" : ""}`}
                  onClick={() => setColumns(3)}
                  aria-label="Three columns"
                  aria-pressed={columns === 3}
                >
                  <GridThreeIcon />
                </button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="ShopMain-chips">
              {chips.map(({ group, value }) => (
                <button
                  key={`${group}-${value}`}
                  type="button"
                  className="ShopMain-chip"
                  onClick={() => toggleFilter(group, value)}
                >
                  <span>{labelFor(group, value)}</span>
                  <CloseIcon size={13} />
                </button>
              ))}
              <button type="button" className="ShopMain-chipsClear" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className="ShopMain-empty" style={{ padding: "80px 20px" }}>
              <h3 className="ShopMain-emptyTitle">Loading Artworks...</h3>
              <p className="ShopMain-emptyText">Fetching the latest collection from the gallery.</p>
            </div>
          ) : pageItems.length > 0 ? (
            <div
              className={`ShopMain-grid ${
                columns === 2 ? "ShopMain-gridTwo" : "ShopMain-gridThree"
              }`}
            >
              {pageItems.map((item, index) => (
                <ShopMainCard
                  key={`${currentPage}-${item.id}`}
                  item={item}
                  index={index}
                  liked={isInWishlist(item.id)}
                  inCart={isInCart(item.id)}
                  onLike={toggleLike}
                  onCart={toggleCart}
                  onView={onView ? onView : (clicked) => setQuickViewItem(clicked)}
                />
              ))}
            </div>
          ) : (
            <div className="ShopMain-empty">
              <h3 className="ShopMain-emptyTitle">No artworks found</h3>
              <p className="ShopMain-emptyText">
                {artworks.length
                  ? "Try a different search term or remove some filters."
                  : "Artworks will appear here once added in the admin panel."}
              </p>
              {artworks.length > 0 && (
                <button type="button" className="ShopMain-cartButton" onClick={clearAll}>
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* ================= Pagination ================= */}
          {totalPages > 1 && (
            <nav className="ShopMain-pagination" aria-label="Pagination">
              <button
                type="button"
                className="ShopMain-pageStep"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <ul className="ShopMain-pageList">
                {getPageList(currentPage, totalPages).map((entry, index) =>
                  entry === "gap" ? (
                    <li key={`gap-${index}`} className="ShopMain-pageGap">
                      …
                    </li>
                  ) : (
                    <li key={entry}>
                      <button
                        type="button"
                        className={`ShopMain-pageNumber ${
                          entry === currentPage ? "ShopMain-pageActive" : ""
                        }`}
                        onClick={() => goToPage(entry)}
                        aria-label={`Page ${entry}`}
                        aria-current={entry === currentPage ? "page" : undefined}
                      >
                        {pad(entry)}
                      </button>
                    </li>
                  )
                )}
              </ul>

              <button
                type="button"
                className="ShopMain-pageStep"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewItem && (
        <div
          className="ShopMain-quickModalOverlay"
          onClick={() => setQuickViewItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(23, 20, 16, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            className="ShopMain-quickModal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 50px rgba(0,0,0,0.22)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              padding: "28px",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setQuickViewItem(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f4ede2",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#463d33",
              }}
            >
              <CloseIcon size={18} />
            </button>

            <div>
              <img
                src={quickViewItem.image}
                alt={quickViewItem.title}
                style={{
                  width: "100%",
                  height: "330px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  background: "#f7f2ea",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#eee4d5",
                  color: "#6b5438",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  width: "fit-content",
                }}
              >
                {quickViewItem.category}
              </span>

              <h2 style={{ fontSize: "20px", color: "#2d2419", margin: 0 }}>
                {quickViewItem.title}
              </h2>

              <p style={{ margin: 0, color: "#776c5f", fontSize: "14px" }}>
                By <strong>{quickViewItem.artist}</strong>
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "#7d5a36" }}>
                  {formatMoney(quickViewItem.price)}
                </span>
                {quickViewItem.discount > 0 && (
                  <>
                    <del style={{ color: "#998e82", fontSize: "15px" }}>
                      {formatMoney(quickViewItem.originalPrice)}
                    </del>
                    <span style={{ color: "#8f382a", fontSize: "13px", fontWeight: 700 }}>
                      {quickViewItem.discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {quickViewItem.description && (
                <div
                  style={{
                    color: "#5f5548",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    maxHeight: "130px",
                    overflowY: "auto",
                  }}
                  dangerouslySetInnerHTML={{ __html: quickViewItem.description }}
                />
              )}

              <div style={{ marginTop: "auto", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  type="button"
                  className="ShopMain-cartButton"
                  style={{ width: "100%", background: "#513f2f", borderColor: "#513f2f" }}
                  onClick={() => navigate(`/shop/${toArtSlug(quickViewItem.title, quickViewItem.id)}`)}
                >
                  View Full Details
                </button>
                <button
                  type="button"
                  className={`ShopMain-cartButton ${
                    isInCart(quickViewItem.id) ? "ShopMain-cartAdded" : ""
                  }`}
                  onClick={() => toggleCart(quickViewItem)}
                  disabled={quickViewItem.stock <= 0}
                  style={{ width: "100%" }}
                >
                  <span className="ShopMain-cartIcon">
                    {isInCart(quickViewItem.id) ? (
                      <CheckIcon size={17} stroke={2.6} />
                    ) : (
                      <CartIcon />
                    )}
                  </span>
                  <span>
                    {quickViewItem.stock <= 0
                      ? "Out of Stock"
                      : isInCart(quickViewItem.id)
                      ? "Added to Cart"
                      : "Add to Cart"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`ShopMain-toast ${toast ? "ShopMain-toastShow" : ""}`}
        role="status"
        aria-live="polite"
      >
        <CheckIcon size={16} stroke={2.6} />
        <span>{toast}</span>
      </div>
    </section>
  );
};

export default ShopMain;