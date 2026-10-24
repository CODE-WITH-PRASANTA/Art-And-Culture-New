import React, { useEffect, useMemo, useRef, useState } from "react";
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
   To add more images: import them above, add them to `shopImages`,
   and every new image is used automatically.
===================================================================== */
const shopImages = [shop1, shop2, shop3, shop4, shop5, shop6];
const PER_PAGE = 6;

/* `ends` = how long until the auction ends (live) or starts (upcoming) */
const artworks = [
  { id: 1, title: "Whispers of Colors in Silent Shadows", artist: "Henri Matisse", category: "Painting", department: "Contemporary Art", status: "live", bid: 34000, image: shopImages[0 % shopImages.length], ends: { d: 156, h: 14, m: 4, s: 14 }, palette: ["#d9823b", "#8fb7c9", "#7a3b22"] },
  { id: 2, title: "Harmony Emerges in Chaos of Creation", artist: "Henri Matisse", category: "Abstract Art", department: "Contemporary Art", status: "upcoming", bid: 32000, image: shopImages[1 % shopImages.length], ends: { d: 92, h: 14, m: 4, s: 14 }, palette: ["#f2d64b", "#2f6b4f", "#f6f1e4"] },
  { id: 3, title: "Nature’s Spirit Transcends the Mortal Frame", artist: "Frida Kahlo", category: "Nature", department: "Post War", status: "live", bid: 34500, image: shopImages[2 % shopImages.length], ends: { d: 131, h: 14, m: 4, s: 14 }, palette: ["#c9372c", "#6f8fa8", "#3c4a2f"] },
  { id: 4, title: "Stories Told Through Hands of Time", artist: "Henri Matisse", category: "Modern Art", department: "Post War", status: "live", bid: 30500, image: shopImages[3 % shopImages.length], ends: { d: 187, h: 14, m: 3, s: 42 }, palette: ["#e3a52b", "#243a7a", "#c64a3a"] },
  { id: 5, title: "Bold Statements: Geometric Wall Art Pieces", artist: "Joan Miró", category: "Abstract Art", department: "Print And Multiples", status: "upcoming", bid: 16500, image: shopImages[4 % shopImages.length], ends: { d: 67, h: 14, m: 3, s: 42 }, palette: ["#2a8bd0", "#e8c53a", "#b5362b"] },
  { id: 6, title: "Infinity Explored in Every Tiny Detail", artist: "Frida Kahlo", category: "Painting", department: "Contemporary Art", status: "live", bid: 31000, image: shopImages[5 % shopImages.length], ends: { d: 124, h: 14, m: 3, s: 42 }, palette: ["#c8302a", "#b79a58", "#5d4a2b"] },
  { id: 7, title: "Golden Hour Over the Quiet Harbor", artist: "Claude Monet", category: "Nature", department: "Post War", status: "live", bid: 43000, image: shopImages[6 % shopImages.length], ends: { d: 48, h: 6, m: 21, s: 9 }, palette: ["#f0b45a", "#5e8fb3", "#2b4a6b"] },
  { id: 8, title: "The Weight of Blue Silence", artist: "Pablo Picasso", category: "Modern Art", department: "Post War", status: "upcoming", bid: 53000, image: shopImages[7 % shopImages.length], ends: { d: 33, h: 2, m: 40, s: 5 }, palette: ["#2a4d8f", "#9fb5d6", "#1b2745"] },
  { id: 9, title: "Dancing Light in the Garden of Memory", artist: "Claude Monet", category: "Painting", department: "Contemporary Art", status: "live", bid: 24500, image: shopImages[8 % shopImages.length], ends: { d: 12, h: 9, m: 55, s: 31 }, palette: ["#8cb56a", "#e8a3c4", "#3b6a45"] },
  { id: 10, title: "Fragments of a Distant Cosmos", artist: "Yayoi Kusama", category: "Abstract Art", department: "Contemporary Art", status: "upcoming", bid: 36000, image: shopImages[9 % shopImages.length], ends: { d: 21, h: 17, m: 12, s: 48 }, palette: ["#e24a3b", "#f6e9c9", "#1c1c1c"] },
  { id: 11, title: "Portrait of a Restless Dream", artist: "Salvador Dalí", category: "Painting", department: "Post War", status: "live", bid: 73000, image: shopImages[10 % shopImages.length], ends: { d: 9, h: 4, m: 33, s: 27 }, palette: ["#c79a4c", "#4f6f86", "#2d2118"] },
  { id: 12, title: "Rhythm of the Midnight City", artist: "Andy Warhol", category: "Street Art", department: "Print And Multiples", status: "upcoming", bid: 29000, image: shopImages[11 % shopImages.length], ends: { d: 58, h: 11, m: 8, s: 16 }, palette: ["#ec4f9b", "#38c4d6", "#f4e04a"] },
  { id: 13, title: "Soft Rain on Terracotta Rooftops", artist: "Diego Rivera", category: "Painting", department: "Post War", status: "live", bid: 23000, image: shopImages[12 % shopImages.length], ends: { d: 76, h: 1, m: 19, s: 52 }, palette: ["#c9683a", "#e8c9a0", "#7a4a2b"] },
  { id: 14, title: "The Gilded Embrace", artist: "Gustav Klimt", category: "Modern Art", department: "Contemporary Art", status: "live", bid: 80000, image: shopImages[13 % shopImages.length], ends: { d: 5, h: 20, m: 44, s: 3 }, palette: ["#d9a93a", "#7a5a1c", "#2a2312"] },
  { id: 15, title: "Echoes from the Northern Shore", artist: "Edvard Munch", category: "Nature", department: "Post War", status: "upcoming", bid: 34000, image: shopImages[14 % shopImages.length], ends: { d: 104, h: 7, m: 26, s: 38 }, palette: ["#e08a3a", "#3f6f9a", "#2b2f4a"] },
  { id: 16, title: "Wild Poppies at First Light", artist: "Mark Jon", category: "Nature", department: "Contemporary Art", status: "live", bid: 15000, image: shopImages[15 % shopImages.length], ends: { d: 17, h: 13, m: 2, s: 59 }, palette: ["#d8362b", "#e8c07a", "#6a7a3a"] },
  { id: 17, title: "Spirals of a Thousand Suns", artist: "Yayoi Kusama", category: "Abstract Art", department: "Contemporary Art", status: "live", bid: 42000, image: shopImages[16 % shopImages.length], ends: { d: 39, h: 5, m: 15, s: 20 }, palette: ["#f2b632", "#d9372c", "#1d1d1d"] },
  { id: 18, title: "Study in Bronze and Shadow", artist: "Leonardo Da Vinci", category: "Sculpture", department: "Print And Multiples", status: "upcoming", bid: 100000, image: shopImages[17 % shopImages.length], ends: { d: 142, h: 10, m: 37, s: 11 }, palette: ["#a8794a", "#4a3623", "#e3cfae"] },
];

const statusOptions = [
  { value: "live", label: "Live Auction" },
  { value: "upcoming", label: "Upcoming Auction" },
];

const artistOptions = [
  "Frida Kahlo",
  "Pablo Picasso",
  "Leonardo Da Vinci",
  "Andy Warhol",
  "Gustav Klimt",
  "Henri Matisse",
  "Diego Rivera",
  "Joan Miró",
  "Yayoi Kusama",
  "Mark Jon",
  "Salvador Dalí",
  "Edvard Munch",
  "Claude Monet",
];

const categoryOptions = [
  "Abstract Art",
  "Modern Art",
  "Nature",
  "Painting",
  "Sculpture",
  "Street Art",
];

const departmentOptions = [
  "Contemporary Art",
  "Post War",
  "Print And Multiples",
];

const sortOptions = [
  { value: "default", label: "Default Sorting" },
  { value: "ending", label: "Ending Soon" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "az", label: "Title: A to Z" },
];

const emptyFilters = { status: [], artist: [], category: [], department: [] };

const ARTIST_PREVIEW = 8;

/* ---------------- Helpers ---------------- */
const toSeconds = ({ d, h, m, s }) => d * 86400 + h * 3600 + m * 60 + s;

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
  <svg
    {...baseIcon}
    width="19"
    height="19"
    fill={filled ? "currentColor" : "none"}
  >
    <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.8 3.4 4.5 6.7 4.5c2 0 3.4 1.1 5.3 3.1 1.9-2 3.3-3.1 5.3-3.1 3.3 0 5 3.3 3.9 6.6-1.7 4.8-9.2 9.4-9.2 9.4z" />
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

const CheckIcon = () => (
  <svg {...baseIcon} width="14" height="14" strokeWidth="3">
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

/* ---------------- Countdown ---------------- */
const ShopMainCountdown = ({ endAt, status }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const total = Math.max(0, Math.floor((endAt - now) / 1000));
  const parts = [
    { key: "d", value: Math.floor(total / 86400), label: "Days" },
    { key: "h", value: Math.floor((total % 86400) / 3600), label: "Hours" },
    { key: "m", value: Math.floor((total % 3600) / 60), label: "Minutes" },
    { key: "s", value: total % 60, label: "Seconds" },
  ];

  return (
    <div
      className="ShopMain-countdown"
      role="timer"
      aria-label={`${status === "live" ? "Ends in" : "Starts in"} ${parts[0].value} days, ${parts[1].value} hours, ${parts[2].value} minutes`}
    >
      {parts.map((part, index) => (
        <React.Fragment key={part.key}>
          {index > 0 && (
            <span className="ShopMain-countdownDot" aria-hidden="true">
              :
            </span>
          )}
          <div className="ShopMain-countdownUnit">
            <strong className="ShopMain-countdownValue">
              {index === 0 ? part.value : pad(part.value)}
            </strong>
            <span className="ShopMain-countdownLabel">{part.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

/* ---------------- Card ---------------- */
const ShopMainCard = ({ item, index, endAt, liked, onLike, onBid, onView }) => {
  const [ref, inView] = useInView(0.12);
  const [failed, setFailed] = useState(false);
  const isLive = item.status === "live";

  return (
    <article
      ref={ref}
      className={`ShopMain-card ${inView ? "ShopMain-cardVisible" : ""}`}
      style={{
        "--delay": `${(index % PER_PAGE) * 0.09}s`,
        "--p1": item.palette[0],
        "--p2": item.palette[1],
        "--p3": item.palette[2],
      }}
    >
      <div className="ShopMain-media">
        <div className="ShopMain-imageWrap">
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
            onClick={() => onView && onView(item)}
          >
            View Artwork
          </button>
        </div>

        <span
          className={`ShopMain-badge ${
            isLive ? "ShopMain-badgeLive" : "ShopMain-badgeUpcoming"
          }`}
        >
          {isLive && <span className="ShopMain-badgeDot" aria-hidden="true" />}
          {isLive ? "Live" : "Upcoming"}
        </span>

        <button
          type="button"
          className={`ShopMain-like ${liked ? "ShopMain-likeActive" : ""}`}
          onClick={() => onLike(item.id)}
          aria-pressed={liked}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon filled={liked} />
        </button>

        <ShopMainCountdown endAt={endAt} status={item.status} />
      </div>

      <div className="ShopMain-cardBody">
        <h3 className="ShopMain-cardTitle">{item.title}</h3>

        <p className="ShopMain-cardArtist">
          <span>Artist :</span> <strong>{item.artist}</strong>
        </p>

        <p className="ShopMain-cardBid">
          {isLive ? "Current bid" : "Starting bid"} :{" "}
          <strong>{formatMoney(item.bid)}</strong>
        </p>

        <button
          type="button"
          className="ShopMain-bidButton"
          onClick={() => onBid && onBid(item)}
        >
          Bidding Start
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
      style={{ "--delay": `${0.25 + index * 0.1}s` }}
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
                    <span className="ShopMain-optionCount">
                      {counts[value] || 0}
                    </span>
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
   Optional props:  onBid(item)  onView(item)
===================================================================== */
const ShopMain = ({ onBid, onView }) => {
  const [rootRef, rootInView] = useInView(0.05);
  const resultsRef = useRef(null);
  const firstRender = useRef(true);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("default");
  const [columns, setColumns] = useState(3);
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(() => new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    status: true,
    artist: true,
    category: true,
    department: true,
  });

  /* Real end / start times, calculated once when the page loads */
  const endTimes = useMemo(() => {
    const base = Date.now();
    return artworks.reduce((acc, item) => {
      acc[item.id] = base + toSeconds(item.ends) * 1000;
      return acc;
    }, {});
  }, []);

  /* How many items match each filter option (for the small counters) */
  const counts = useMemo(() => {
    const result = { status: {}, artist: {}, category: {}, department: {} };
    artworks.forEach((item) => {
      result.status[item.status] = (result.status[item.status] || 0) + 1;
      result.artist[item.artist] = (result.artist[item.artist] || 0) + 1;
      result.category[item.category] = (result.category[item.category] || 0) + 1;
      result.department[item.department] =
        (result.department[item.department] || 0) + 1;
    });
    return result;
  }, []);

  /* Filter + sort */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const list = artworks.filter((item) => {
      if (
        query &&
        !item.artist.toLowerCase().includes(query) &&
        !item.title.toLowerCase().includes(query)
      )
        return false;
      if (filters.status.length && !filters.status.includes(item.status))
        return false;
      if (filters.artist.length && !filters.artist.includes(item.artist))
        return false;
      if (filters.category.length && !filters.category.includes(item.category))
        return false;
      if (
        filters.department.length &&
        !filters.department.includes(item.department)
      )
        return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "priceLow") sorted.sort((a, b) => a.bid - b.bid);
    if (sort === "priceHigh") sorted.sort((a, b) => b.bid - a.bid);
    if (sort === "az") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "ending")
      sorted.sort((a, b) => {
        if (a.status !== b.status) return a.status === "live" ? -1 : 1;
        return endTimes[a.id] - endTimes[b.id];
      });
    return sorted;
  }, [search, filters, sort, endTimes]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );
  const activeCount =
    filters.status.length +
    filters.artist.length +
    filters.category.length +
    filters.department.length;

  /* Smoothly bring the results into view when the page changes */
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

  const toggleLike = (id) =>
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const goToPage = (value) => {
    if (value < 1 || value > totalPages || value === currentPage) return;
    setPage(value);
  };

  const labelFor = (group, value) =>
    group === "status"
      ? statusOptions.find((o) => o.value === value).label
      : value;

  const chips = Object.keys(filters).flatMap((group) =>
    filters[group].map((value) => ({ group, value }))
  );

  return (
    <section
      ref={rootRef}
      className={`ShopMain ${rootInView ? "ShopMain-visible" : ""}`}
      aria-label="Art & Culture auction shop"
    >
      <div className="ShopMain-container">
        {/* ================= Sidebar ================= */}
        <div
          className={`ShopMain-overlay ${
            drawerOpen ? "ShopMain-overlayOpen" : ""
          }`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />

        <aside
          className={`ShopMain-sidebar ${
            drawerOpen ? "ShopMain-sidebarOpen" : ""
          }`}
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
              placeholder="Search Artist"
              aria-label="Search artist or artwork"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <button
              type="submit"
              className="ShopMain-searchButton"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </form>

          <div className="ShopMain-groups">
            <ShopMainGroup
              id="status"
              index={0}
              title="Shop Catalog"
              options={statusOptions}
              selected={filters.status}
              onToggle={toggleFilter}
              counts={counts.status}
              open={openGroups.status}
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
              id="category"
              index={2}
              title="Category"
              options={categoryOptions}
              selected={filters.category}
              onToggle={toggleFilter}
              counts={counts.category}
              open={openGroups.category}
              onOpen={toggleGroup}
            />
            <ShopMainGroup
              id="department"
              index={3}
              title="Department"
              options={departmentOptions}
              selected={filters.department}
              onToggle={toggleFilter}
              counts={counts.department}
              open={openGroups.department}
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

            <p className="ShopMain-results" aria-live="polite">
              Showing <strong>{pageItems.length}</strong> of{" "}
              <strong>{total}</strong> results
            </p>

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
                  className={`ShopMain-viewButton ${
                    columns === 2 ? "ShopMain-viewActive" : ""
                  }`}
                  onClick={() => setColumns(2)}
                  aria-label="Two columns"
                  aria-pressed={columns === 2}
                >
                  <GridTwoIcon />
                </button>
                <button
                  type="button"
                  className={`ShopMain-viewButton ${
                    columns === 3 ? "ShopMain-viewActive" : ""
                  }`}
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
              <button
                type="button"
                className="ShopMain-chipsClear"
                onClick={clearAll}
              >
                Clear all
              </button>
            </div>
          )}

          {pageItems.length > 0 ? (
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
                  endAt={endTimes[item.id]}
                  liked={liked.has(item.id)}
                  onLike={toggleLike}
                  onBid={onBid}
                  onView={onView}
                />
              ))}
            </div>
          ) : (
            <div className="ShopMain-empty">
              <h3 className="ShopMain-emptyTitle">No artworks found</h3>
              <p className="ShopMain-emptyText">
                Try a different artist name or remove some filters.
              </p>
              <button
                type="button"
                className="ShopMain-bidButton"
                onClick={clearAll}
              >
                Clear all filters
              </button>
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
    </section>
  );
};

export default ShopMain;