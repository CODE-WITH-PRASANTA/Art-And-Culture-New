
import React, { useMemo, useState } from "react";
import {
  Star,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import "./OnlineArtOne.css";

const OnlineArtOne = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Drawing",
    "Painting",
    "Watercolor",
    "Acrylic",
    "Digital Art",
    "Sketching",
    "Calligraphy",
    "For Kids",
  ];

  const classes = [
    {
      id: 1,
      title: "Watercolor Landscapes",
      provider: "Canvas Grove Art Academy",
      mode: "Online",
      age: "16–75 yrs",
      category: "Watercolor",
      price: 2200,
      priceUnit: "month",
      featured: true,
      verified: true,
      status: "New",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      imagePosition: "center",
    },
    {
      id: 2,
      title: "Antique Drawing/Online & Offline Drawing classes for kids",
      provider: "Sweety jain",
      mode: "Online",
      age: "5+ yrs",
      category: "For Kids",
      price: 1000,
      priceUnit: "month",
      featured: true,
      verified: false,
      status: "New",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      imagePosition: "bottom",
    },
  ];

  const filteredClasses = useMemo(() => {
    if (activeCategory === "All") return classes;

    if (activeCategory === "Acrylic") {
      return classes.filter((item) => item.category === "Acrylic");
    }

    if (activeCategory === "Drawing") {
      return classes.filter(
        (item) =>
          item.category === "Drawing" ||
          item.category === "For Kids"
      );
    }

    if (activeCategory === "Painting") {
      return classes.filter(
        (item) =>
          item.category === "Painting" ||
          item.category === "Watercolor"
      );
    }

    return classes.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN").format(price);

  return (
    <section className="OnlineArtOne">
      {/* ================================================
          HERO AND CATEGORY FILTERS
      ================================================ */}

      <div className="OnlineArtOne-hero">
        <div className="OnlineArtOne-container">
          <div className="OnlineArtOne-heroContent">
            <span className="OnlineArtOne-eyebrow">
              <Sparkles size={16} />
              Discover your creativity
            </span>

            <h1 className="OnlineArtOne-heroTitle">
              Online Art Classes
            </h1>

            <p className="OnlineArtOne-heroDescription">
              Learn art live from teachers and studios across India.
              Compare fees, schedules and levels, then send an enquiry.
            </p>

            <div
              className="OnlineArtOne-categoryFilters"
              role="group"
              aria-label="Filter online art classes by category"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`OnlineArtOne-filterButton ${
                    activeCategory === category
                      ? "OnlineArtOne-filterButton--active"
                      : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================
          FEATURED CLASSES
      ================================================ */}

      <section className="OnlineArtOne-featured">
        <div className="OnlineArtOne-container">
          <div className="OnlineArtOne-featuredHeader">
            <div className="OnlineArtOne-featuredHeading">
              <span className="OnlineArtOne-featuredStar">
                <Star size={18} fill="currentColor" />
              </span>

              <h2 className="OnlineArtOne-featuredTitle">
                Featured online classes
              </h2>
            </div>

            <span className="OnlineArtOne-featuredCount">
              {filteredClasses.length}{" "}
              {filteredClasses.length === 1 ? "class" : "classes"}
            </span>
          </div>

          <div className="OnlineArtOne-featuredGrid">
            {filteredClasses.map((artClass) => (
              <article
                className="OnlineArtOne-classCard"
                key={artClass.id}
              >
                {/* Image */}
                <div className="OnlineArtOne-cardImageWrapper">
                  <img
                    className="OnlineArtOne-cardImage"
                    src={artClass.image}
                    alt={artClass.title}
                    loading="lazy"
                    style={{
                      objectPosition: artClass.imagePosition,
                    }}
                  />

                  {artClass.featured && (
                    <span className="OnlineArtOne-featuredBadge">
                      Featured
                    </span>
                  )}

                  {artClass.verified && (
                    <span className="OnlineArtOne-verifiedBadge">
                      <Check size={14} strokeWidth={2.7} />
                      Verified
                    </span>
                  )}
                </div>

                {/* Card details */}
                <div className="OnlineArtOne-cardBody">
                  <h3 className="OnlineArtOne-cardTitle">
                    {artClass.title}
                  </h3>

                  <p className="OnlineArtOne-cardProvider">
                    {artClass.provider}
                  </p>

                  <p className="OnlineArtOne-cardMeta">
                    {artClass.mode} <span>·</span> {artClass.age}
                  </p>

                  <div className="OnlineArtOne-cardFooter">
                    <p className="OnlineArtOne-cardPrice">
                      <strong>
                        ₹{formatPrice(artClass.price)}
                      </strong>

                      <span>/ {artClass.priceUnit}</span>
                    </p>

                    <span className="OnlineArtOne-cardStatus">
                      {artClass.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {/* Promotional card */}
            <article className="OnlineArtOne-promoCard">
              <div className="OnlineArtOne-promoIcon">
                <Star size={19} fill="currentColor" />
              </div>

              <h3 className="OnlineArtOne-promoTitle">
                Get featured here
              </h3>

              <p className="OnlineArtOne-promoDescription">
                Teachers and studios can appear in this spot.
              </p>

              <a
                href="#OnlineArtOne-featured-enquiry"
                className="OnlineArtOne-promoLink"
              >
                See plans
                <ArrowRight size={17} />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ================================================
          FEATURE ENQUIRY
      ================================================ */}

      <div
        className="OnlineArtOne-enquiryAnchor"
        id="OnlineArtOne-featured-enquiry"
      >
        <div className="OnlineArtOne-container">
          <div className="OnlineArtOne-enquiryContent">
            <div>
              <h2 className="OnlineArtOne-enquiryTitle">
                Showcase your art classes
              </h2>

              <p className="OnlineArtOne-enquiryDescription">
                Reach more art enthusiasts across India.
              </p>
            </div>

            <a
              href="mailto:hello@example.com?subject=Featured%20Art%20Class%20Enquiry"
              className="OnlineArtOne-enquiryButton"
            >
              Enquire now
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlineArtOne;
