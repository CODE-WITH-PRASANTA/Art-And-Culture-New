
import React, { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  LocateFixed,
  Heart,
  Check,
  Palette,
  PenTool,
  Monitor,
  Gem,
  Sparkles,
  Brush,
  X,
  SlidersHorizontal,
} from "lucide-react";

import "./OnlineArtTwo.css";

const initialClasses = [
  {
    id: 1,
    title: "Watercolor Landscapes",
    teacher: "Canvas Grove Art Academy",
    description:
      "Skies, trees and water in loose, confident watercolor.",
    category: "Watercolor Painting",
    medium: "Watercolor",
    age: "16–75 yrs",
    level: "Intermediate",
    mode: "Online",
    location: "India",
    city: "Online",
    days: ["Wed"],
    time: "Evening",
    price: 2200,
    priceType: "month",
    featured: true,
    verified: true,
    trial: true,
    rating: 4.8,
    icon: Brush,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=85",
    imagePosition: "center",
  },
  {
    id: 2,
    title: "Antique Drawing/Online & Offline Drawing classes for kids",
    teacher: "Sweety jain",
    description: "Antique Drawing, Art & Crafts for kids.",
    category: "Warli Art",
    medium: "Drawing",
    age: "5+ yrs",
    level: "Beginner",
    mode: "Online",
    location: "India",
    city: "Online",
    days: ["Sat"],
    time: "Evening",
    price: 1000,
    priceType: "month",
    featured: true,
    verified: false,
    trial: true,
    rating: 4.6,
    icon: Palette,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=85",
    imagePosition: "center",
  },
  {
    id: 3,
    title: "Character Illustration Studio",
    teacher: "Rohan Mehta",
    description:
      "Build characters and scenes in a live one-to-one online class.",
    category: "Digital Art",
    medium: "Digital Art",
    age: "14–40 yrs",
    level: "Intermediate",
    mode: "Online",
    location: "India",
    city: "Online",
    days: ["Tue", "Thu"],
    time: "Evening",
    price: 1800,
    priceType: "month",
    featured: false,
    verified: true,
    trial: true,
    rating: 4.7,
    icon: Monitor,
    color: "green",
  },
  {
    id: 4,
    title: "Brush Lettering Online",
    teacher: "Priya Raghavan",
    description:
      "Brush-pen lettering basics, drills and layout, live online.",
    category: "Calligraphy",
    medium: "Calligraphy",
    age: "12–70 yrs",
    level: "Beginner",
    mode: "Online",
    location: "India",
    city: "Online",
    days: ["Tue", "Fri"],
    time: "Evening",
    price: 1300,
    priceType: "month",
    featured: false,
    verified: false,
    trial: true,
    rating: 4.5,
    icon: PenTool,
    color: "pink",
  },
  {
    id: 5,
    title: "Kids Colour and Craft Hour",
    teacher: "Little Easel Kids Art Club",
    description:
      "Paper craft, origami and colouring games that build fine motor skills.",
    category: "Craft",
    medium: "Craft",
    age: "4–7 yrs",
    level: "All Levels",
    mode: "Hybrid",
    location: "Adyar, Chennai",
    city: "Chennai",
    days: ["Sat"],
    time: "Afternoon",
    price: 1400,
    priceType: "month",
    featured: false,
    verified: true,
    trial: true,
    rating: 4.9,
    icon: Gem,
    color: "blue",
  },
  {
    id: 6,
    title: "Acrylic Painting for Beginners",
    teacher: "Art House Studio",
    description:
      "Learn colors, brush control, layering and composition step by step.",
    category: "Acrylic Painting",
    medium: "Acrylic",
    age: "15–65 yrs",
    level: "Beginner",
    mode: "Offline",
    location: "Kolkata",
    city: "Kolkata",
    days: ["Sun"],
    time: "Morning",
    price: 2500,
    priceType: "month",
    featured: false,
    verified: true,
    trial: false,
    rating: 4.7,
    icon: Palette,
    color: "orange",
  },
  {
    id: 7,
    title: "Traditional Indian Folk Art",
    teacher: "Kala Heritage Studio",
    description:
      "Explore traditional Indian motifs, patterns and cultural storytelling.",
    category: "Traditional Art",
    medium: "Traditional Art",
    age: "10+ yrs",
    level: "All Levels",
    mode: "Online",
    location: "India",
    city: "Online",
    days: ["Mon"],
    time: "Evening",
    price: 1600,
    priceType: "month",
    featured: false,
    verified: false,
    trial: true,
    rating: 4.6,
    icon: Sparkles,
    color: "green",
  },
];

const categories = [
  "All categories",
  "Drawing",
  "Painting",
  "Watercolor",
  "Acrylic",
  "Digital Art",
  "Calligraphy",
  "Craft",
  "Traditional Art",
  "Warli Art",
];

const mediums = [
  "All mediums",
  "Watercolor",
  "Acrylic",
  "Drawing",
  "Digital Art",
  "Calligraphy",
  "Craft",
  "Traditional Art",
];

const ages = [
  "All ages",
  "Kids (3–12)",
  "Teens (13–17)",
  "Adults (18+)",
];

const levels = [
  "Any level",
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
];

const classTypes = [
  "Any type",
  "Live online",
  "Offline",
  "Hybrid",
];

const timeOptions = [
  "Any time",
  "Morning",
  "Afternoon",
  "Evening",
];

const weekDays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const OnlineArtTwo = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [medium, setMedium] = useState("All mediums");
  const [age, setAge] = useState("All ages");
  const [level, setLevel] = useState("Any level");
  const [classType, setClassType] = useState("Any type");
  const [time, setTime] = useState("Any time");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [trialOnly, setTrialOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [highRatedOnly, setHighRatedOnly] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [sortBy, setSortBy] = useState("Recommended");
  const [favorites, setFavorites] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [enquiryClass, setEnquiryClass] = useState(null);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN").format(price);

  const matchesAge = (classAge, selectedAge) => {
    if (selectedAge === "All ages") return true;

    const numericAges = classAge.match(/\d+/g)?.map(Number) || [];
    const minAge = numericAges[0] ?? 0;
    const maxAge = numericAges[1] ?? minAge;

    if (selectedAge === "Kids (3–12)") {
      return minAge <= 12;
    }

    if (selectedAge === "Teens (13–17)") {
      return maxAge >= 13 && minAge <= 17;
    }

    if (selectedAge === "Adults (18+)") {
      return maxAge >= 18;
    }

    return true;
  };

  const filteredClasses = useMemo(() => {
    const filters = appliedFilters || {
      search,
      category,
      medium,
      age,
      level,
      classType,
      time,
      minFee,
      maxFee,
      selectedDays,
      trialOnly,
      verifiedOnly,
      highRatedOnly,
    };

    const filtered = initialClasses.filter((item) => {
      const searchText =
        `${item.title} ${item.teacher} ${item.description} ${item.category} ${item.city}`.toLowerCase();

      const searchMatch = searchText.includes(
        filters.search.trim().toLowerCase()
      );

      const categoryMatch =
        filters.category === "All categories" ||
        item.category.toLowerCase().includes(
          filters.category === "Painting"
            ? "painting"
            : filters.category.toLowerCase()
        ) ||
        (filters.category === "Drawing" &&
          item.medium === "Drawing");

      const mediumMatch =
        filters.medium === "All mediums" ||
        item.medium.toLowerCase().includes(
          filters.medium.toLowerCase()
        );

      const ageMatch = matchesAge(item.age, filters.age);

      const levelMatch =
        filters.level === "Any level" ||
        item.level === filters.level;

      const typeMatch =
        filters.classType === "Any type" ||
        (filters.classType === "Live online" &&
          item.mode === "Online") ||
        (filters.classType === "Offline" &&
          item.mode === "Offline") ||
        (filters.classType === "Hybrid" &&
          item.mode === "Hybrid");

      const timeMatch =
        filters.time === "Any time" ||
        item.time === filters.time;

      const minMatch =
        filters.minFee === "" ||
        item.price >= Number(filters.minFee);

      const maxMatch =
        filters.maxFee === "" ||
        item.price <= Number(filters.maxFee);

      const daysMatch =
        filters.selectedDays.length === 0 ||
        filters.selectedDays.some((day) =>
          item.days.includes(day)
        );

      const trialMatch = !filters.trialOnly || item.trial;
      const verifiedMatch =
        !filters.verifiedOnly || item.verified;
      const ratingMatch =
        !filters.highRatedOnly || item.rating >= 4.5;

      return (
        searchMatch &&
        categoryMatch &&
        mediumMatch &&
        ageMatch &&
        levelMatch &&
        typeMatch &&
        timeMatch &&
        minMatch &&
        maxMatch &&
        daysMatch &&
        trialMatch &&
        verifiedMatch &&
        ratingMatch
      );
    });

    if (sortBy === "Price: low to high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: high to low") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Top rated") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Newest") {
      filtered.sort((a, b) => b.id - a.id);
    } else {
      filtered.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured)
      );
    }

    return filtered;
  }, [
    appliedFilters,
    search,
    category,
    medium,
    age,
    level,
    classType,
    time,
    minFee,
    maxFee,
    selectedDays,
    trialOnly,
    verifiedOnly,
    highRatedOnly,
    sortBy,
  ]);

  const toggleDay = (day) => {
    setSelectedDays((previous) =>
      previous.includes(day)
        ? previous.filter((item) => item !== day)
        : [...previous, day]
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleCompare = (id) => {
    setCompareItems((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, id];
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All categories");
    setMedium("All mediums");
    setAge("All ages");
    setLevel("Any level");
    setClassType("Any type");
    setTime("Any time");
    setMinFee("");
    setMaxFee("");
    setSelectedDays([]);
    setTrialOnly(false);
    setVerifiedOnly(false);
    setHighRatedOnly(false);
    setAppliedFilters(null);
  };

  const applyFilters = () => {
    setAppliedFilters({
      search,
      category,
      medium,
      age,
      level,
      classType,
      time,
      minFee,
      maxFee,
      selectedDays: [...selectedDays],
      trialOnly,
      verifiedOnly,
      highRatedOnly,
    });
  };

  const handleEnquirySubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Art class enquiry: ${enquiryClass.title}`
    );

    const body = encodeURIComponent(
      `Class: ${enquiryClass.title}\nTeacher: ${enquiryClass.teacher}\nName: ${enquiryName}\nEmail: ${enquiryEmail}\nMessage: ${enquiryMessage}`
    );

    window.location.href =
      `mailto:hello@example.com?subject=${subject}&body=${body}`;

    setEnquiryClass(null);
  };

  const selectClass = (item) => {
    setEnquiryClass(item);
    setEnquiryName("");
    setEnquiryEmail("");
    setEnquiryMessage("");
  };

  return (
    <section className="OnlineArtTwo">
      <div className="OnlineArtTwo-container">
        {/* =============================================
            FILTER SIDEBAR
        ============================================= */}

        <aside className="OnlineArtTwo-sidebar">
          <div className="OnlineArtTwo-filterPanel">
            <div className="OnlineArtTwo-filterHeading">
              <h2 className="OnlineArtTwo-filterTitle">
                Filters
              </h2>

              <SlidersHorizontal
                className="OnlineArtTwo-mobileFilterIcon"
                size={20}
              />
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label
                className="OnlineArtTwo-label"
                htmlFor="OnlineArtTwo-search"
              >
                Search
              </label>

              <div className="OnlineArtTwo-searchWrapper">
                <Search
                  className="OnlineArtTwo-searchIcon"
                  size={17}
                />

                <input
                  id="OnlineArtTwo-search"
                  className="OnlineArtTwo-input OnlineArtTwo-searchInput"
                  type="search"
                  placeholder="Drawing, watercolor, teacher"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label
                className="OnlineArtTwo-label"
                htmlFor="OnlineArtTwo-category"
              >
                Art category
              </label>

              <div className="OnlineArtTwo-selectWrapper">
                <select
                  id="OnlineArtTwo-category"
                  className="OnlineArtTwo-select"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label
                className="OnlineArtTwo-label"
                htmlFor="OnlineArtTwo-medium"
              >
                Medium
              </label>

              <div className="OnlineArtTwo-selectWrapper">
                <select
                  id="OnlineArtTwo-medium"
                  className="OnlineArtTwo-select"
                  value={medium}
                  onChange={(event) =>
                    setMedium(event.target.value)
                  }
                >
                  {mediums.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label
                className="OnlineArtTwo-label"
                htmlFor="OnlineArtTwo-age"
              >
                Age
              </label>

              <div className="OnlineArtTwo-selectWrapper">
                <select
                  id="OnlineArtTwo-age"
                  className="OnlineArtTwo-select"
                  value={age}
                  onChange={(event) =>
                    setAge(event.target.value)
                  }
                >
                  {ages.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label
                className="OnlineArtTwo-label"
                htmlFor="OnlineArtTwo-level"
              >
                Level
              </label>

              <div className="OnlineArtTwo-selectWrapper">
                <select
                  id="OnlineArtTwo-level"
                  className="OnlineArtTwo-select"
                  value={level}
                  onChange={(event) =>
                    setLevel(event.target.value)
                  }
                >
                  {levels.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label
                className="OnlineArtTwo-label"
                htmlFor="OnlineArtTwo-type"
              >
                Class type
              </label>

              <div className="OnlineArtTwo-selectWrapper">
                <select
                  id="OnlineArtTwo-type"
                  className="OnlineArtTwo-select"
                  value={classType}
                  onChange={(event) =>
                    setClassType(event.target.value)
                  }
                >
                  {classTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label className="OnlineArtTwo-label">
                Fee (₹)
              </label>

              <div className="OnlineArtTwo-feeInputs">
                <input
                  className="OnlineArtTwo-input"
                  type="number"
                  min="0"
                  placeholder="Min"
                  aria-label="Minimum fee"
                  value={minFee}
                  onChange={(event) =>
                    setMinFee(event.target.value)
                  }
                />

                <input
                  className="OnlineArtTwo-input"
                  type="number"
                  min="0"
                  placeholder="Max"
                  aria-label="Maximum fee"
                  value={maxFee}
                  onChange={(event) =>
                    setMaxFee(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <span className="OnlineArtTwo-label">
                Days
              </span>

              <div className="OnlineArtTwo-days">
                {weekDays.map((day) => (
                  <button
                    type="button"
                    key={day}
                    className={`OnlineArtTwo-dayButton ${
                      selectedDays.includes(day)
                        ? "OnlineArtTwo-dayButton--active"
                        : ""
                    }`}
                    aria-pressed={selectedDays.includes(day)}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="OnlineArtTwo-filterGroup">
              <label
                className="OnlineArtTwo-label"
                htmlFor="OnlineArtTwo-time"
              >
                Time
              </label>

              <div className="OnlineArtTwo-selectWrapper">
                <select
                  id="OnlineArtTwo-time"
                  className="OnlineArtTwo-select"
                  value={time}
                  onChange={(event) =>
                    setTime(event.target.value)
                  }
                >
                  {timeOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="OnlineArtTwo-checkboxGroup">
              <label className="OnlineArtTwo-checkLabel">
                <input
                  type="checkbox"
                  checked={trialOnly}
                  onChange={(event) =>
                    setTrialOnly(event.target.checked)
                  }
                />
                <span>Trial available</span>
              </label>

              <label className="OnlineArtTwo-checkLabel">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(event) =>
                    setVerifiedOnly(event.target.checked)
                  }
                />
                <span>Verified providers</span>
              </label>

              <label className="OnlineArtTwo-checkLabel">
                <input
                  type="checkbox"
                  checked={highRatedOnly}
                  onChange={(event) =>
                    setHighRatedOnly(event.target.checked)
                  }
                />
                <span>Highly rated (4.5+)</span>
              </label>
            </div>

            <div className="OnlineArtTwo-filterActions">
              <button
                type="button"
                className="OnlineArtTwo-applyButton"
                onClick={applyFilters}
              >
                Apply
              </button>

              <button
                type="button"
                className="OnlineArtTwo-clearButton"
                onClick={clearFilters}
              >
                Clear all
              </button>
            </div>
          </div>
        </aside>

        {/* =============================================
            CLASS RESULTS
        ============================================= */}

        <main className="OnlineArtTwo-results">
          <div className="OnlineArtTwo-resultsToolbar">
            <h2 className="OnlineArtTwo-resultsCount">
              {filteredClasses.length}{" "}
              {filteredClasses.length === 1
                ? "class"
                : "classes"}{" "}
              found
            </h2>

            <div className="OnlineArtTwo-toolbarActions">
              <div className="OnlineArtTwo-sortWrapper">
                <select
                  className="OnlineArtTwo-sortSelect"
                  value={sortBy}
                  aria-label="Sort art classes"
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                >
                  <option>Recommended</option>
                  <option>Top rated</option>
                  <option>Newest</option>
                  <option>Price: low to high</option>
                  <option>Price: high to low</option>
                </select>

                <ChevronDown size={18} />
              </div>

              <button
                type="button"
                className="OnlineArtTwo-nearButton"
                onClick={() => {
                  setClassType("Offline");
                  setAppliedFilters(null);
                }}
                title="Show offline classes"
              >
                <LocateFixed size={18} />
                <span>Near me</span>
              </button>
            </div>
          </div>

          {filteredClasses.length > 0 ? (
            <div className="OnlineArtTwo-classList">
              {filteredClasses.map((item) => {
                const Illustration = item.icon;

                return (
                  <article
                    className="OnlineArtTwo-resultCard"
                    key={item.id}
                  >
                    <div
                      className={`OnlineArtTwo-resultImage ${
                        item.color
                          ? `OnlineArtTwo-resultImage--${item.color}`
                          : ""
                      }`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="OnlineArtTwo-resultPhoto"
                          style={{
                            objectPosition: item.imagePosition,
                          }}
                        />
                      ) : (
                        <Illustration
                          className="OnlineArtTwo-resultIllustration"
                          strokeWidth={1.4}
                        />
                      )}
                    </div>

                    <div className="OnlineArtTwo-resultContent">
                      <div className="OnlineArtTwo-resultTop">
                        <div className="OnlineArtTwo-resultMain">
                          <div className="OnlineArtTwo-badges">
                            {item.featured && (
                              <span className="OnlineArtTwo-badge OnlineArtTwo-badge--featured">
                                Featured
                              </span>
                            )}

                            {item.verified && (
                              <span className="OnlineArtTwo-badge OnlineArtTwo-badge--verified">
                                <Check size={13} />
                                Verified
                              </span>
                            )}

                            <span className="OnlineArtTwo-badge OnlineArtTwo-badge--category">
                              {item.category}
                            </span>

                            {item.trial && (
                              <span className="OnlineArtTwo-badge OnlineArtTwo-badge--trial">
                                Trial available
                              </span>
                            )}
                          </div>

                          <h3 className="OnlineArtTwo-resultTitle">
                            <span>{item.title}</span>
                          </h3>

                          <p className="OnlineArtTwo-resultTeacher">
                            {item.teacher}
                          </p>
                        </div>

                        <div className="OnlineArtTwo-priceBlock">
                          <strong>
                            ₹{formatPrice(item.price)}
                          </strong>
                          <span>per {item.priceType}</span>
                        </div>
                      </div>

                      <p className="OnlineArtTwo-resultDescription">
                        {item.description}
                      </p>

                      <div className="OnlineArtTwo-resultMeta">
                        <span>{item.mode}</span>
                        <span>{item.age}</span>
                        <span>{item.level}</span>
                        <span>{item.location}</span>
                        <span>
                          {item.days.join(" ")} · {item.time}
                        </span>
                      </div>

                      <div className="OnlineArtTwo-resultFooter">
                        <span className="OnlineArtTwo-newListing">
                          New listing
                        </span>

                        <div className="OnlineArtTwo-resultActions">
                          <label className="OnlineArtTwo-compareLabel">
                            <input
                              type="checkbox"
                              checked={compareItems.includes(item.id)}
                              onChange={() => toggleCompare(item.id)}
                              disabled={
                                !compareItems.includes(item.id) &&
                                compareItems.length >= 3
                              }
                            />
                            <span>Compare</span>
                          </label>

                          <button
                            type="button"
                            className={`OnlineArtTwo-favoriteButton ${
                              favorites.includes(item.id)
                                ? "OnlineArtTwo-favoriteButton--active"
                                : ""
                            }`}
                            aria-label={
                              favorites.includes(item.id)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                            aria-pressed={favorites.includes(item.id)}
                            onClick={() => toggleFavorite(item.id)}
                          >
                            <Heart
                              size={19}
                              fill={
                                favorites.includes(item.id)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>

                          <button
                            type="button"
                            className="OnlineArtTwo-enquireButton"
                            onClick={() => selectClass(item)}
                          >
                            Enquire
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="OnlineArtTwo-emptyState">
              <div className="OnlineArtTwo-emptyIcon">
                <Search size={30} />
              </div>

              <h3>No art classes found</h3>

              <p>
                Try changing your filters or clearing them to explore
                available art classes across India.
              </p>

              <button
                type="button"
                className="OnlineArtTwo-applyButton"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* =============================================
          COMPARE BAR
      ============================================= */}

      {compareItems.length > 0 && (
        <div className="OnlineArtTwo-compareBar">
          <div className="OnlineArtTwo-compareBarText">
            <strong>
              {compareItems.length} of 3 classes selected
            </strong>
            <span>
              Compare fees, teaching formats and class details.
            </span>
          </div>

          <div className="OnlineArtTwo-compareBarActions">
            <button
              type="button"
              className="OnlineArtTwo-compareViewButton"
              onClick={() => setShowCompare(true)}
            >
              Compare classes
            </button>

            <button
              type="button"
              className="OnlineArtTwo-compareClearButton"
              onClick={() => setCompareItems([])}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* =============================================
          COMPARE MODAL
      ============================================= */}

      {showCompare && (
        <div
          className="OnlineArtTwo-modalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCompare(false);
            }
          }}
        >
          <div
            className="OnlineArtTwo-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="OnlineArtTwo-compareTitle"
          >
            <div className="OnlineArtTwo-modalHeader">
              <h2 id="OnlineArtTwo-compareTitle">
                Compare art classes
              </h2>

              <button
                type="button"
                className="OnlineArtTwo-modalClose"
                aria-label="Close comparison"
                onClick={() => setShowCompare(false)}
              >
                <X size={21} />
              </button>
            </div>

            <div className="OnlineArtTwo-compareTable">
              {[
                ["Class", "title"],
                ["Teacher", "teacher"],
                ["Category", "category"],
                ["Level", "level"],
                ["Format", "mode"],
                ["Age group", "age"],
                ["Schedule", "days"],
                ["Fee", "price"],
              ].map(([label, field]) => (
                <div
                  className="OnlineArtTwo-compareRow"
                  key={field}
                >
                  <strong>{label}</strong>

                  {compareItems.map((id) => {
                    const item = initialClasses.find(
                      (entry) => entry.id === id
                    );

                    let value = item[field];

                    if (field === "days") {
                      value = `${item.days.join(", ")} · ${item.time}`;
                    }

                    if (field === "price") {
                      value = `₹${formatPrice(item.price)} / ${item.priceType}`;
                    }

                    return (
                      <span key={id}>{value}</span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =============================================
          ENQUIRY MODAL
      ============================================= */}

      {enquiryClass && (
        <div
          className="OnlineArtTwo-modalOverlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEnquiryClass(null);
            }
          }}
        >
          <form
            className="OnlineArtTwo-modal OnlineArtTwo-enquiryModal"
            onSubmit={handleEnquirySubmit}
          >
            <div className="OnlineArtTwo-modalHeader">
              <div>
                <span className="OnlineArtTwo-modalEyebrow">
                  ART CLASS ENQUIRY
                </span>

                <h2>{enquiryClass.title}</h2>

                <p>{enquiryClass.teacher}</p>
              </div>

              <button
                type="button"
                className="OnlineArtTwo-modalClose"
                aria-label="Close enquiry"
                onClick={() => setEnquiryClass(null)}
              >
                <X size={21} />
              </button>
            </div>

            <label className="OnlineArtTwo-label" htmlFor="OnlineArtTwo-name">
              Your name
            </label>

            <input
              id="OnlineArtTwo-name"
              className="OnlineArtTwo-input"
              required
              value={enquiryName}
              onChange={(event) =>
                setEnquiryName(event.target.value)
              }
              placeholder="Enter your full name"
            />

            <label className="OnlineArtTwo-label" htmlFor="OnlineArtTwo-email">
              Email address
            </label>

            <input
              id="OnlineArtTwo-email"
              className="OnlineArtTwo-input"
              type="email"
              required
              value={enquiryEmail}
              onChange={(event) =>
                setEnquiryEmail(event.target.value)
              }
              placeholder="you@example.com"
            />

            <label
              className="OnlineArtTwo-label"
              htmlFor="OnlineArtTwo-message"
            >
              Message
            </label>

            <textarea
              id="OnlineArtTwo-message"
              className="OnlineArtTwo-textarea"
              rows="3"
              value={enquiryMessage}
              onChange={(event) =>
                setEnquiryMessage(event.target.value)
              }
              placeholder="Tell the teacher what you want to learn..."
            />

            <button
              type="submit"
              className="OnlineArtTwo-enquireButton OnlineArtTwo-enquireButton--modal"
            >
              Continue with email
            </button>

            <p className="OnlineArtTwo-modalNote">
              This opens your email application with the enquiry
              details. Connect your enquiry API to submit directly
              from your website.
            </p>
          </form>
        </div>
      )}
    </section>
  );
};

export default OnlineArtTwo;
