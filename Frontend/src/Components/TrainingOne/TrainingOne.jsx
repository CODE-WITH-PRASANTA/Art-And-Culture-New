
import React from "react";
import {
  Star,
  Check,
  ArrowRight,
  MapPin,
  Clock3,
  Palette,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import "./TrainingOne.css";

const TrainingOne = () => {
  const artClasses = [
    {
      id: 1,
      title: "Kids Painting Club (8–12)",
      studio: "Brushwood Art Studio",
      location: "Madhapur, Hyderabad",
      age: "8–12 yrs",
      price: "₹1,900",
      priceUnit: "month",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      featured: true,
      verified: true,
      format: "Offline",
    },
    {
      id: 2,
      title: "Wheel Throwing for Beginners",
      studio: "Terracotta Lane Studio",
      location: "Bandra West, Mumbai",
      age: "16–70 yrs",
      price: "₹6,000",
      priceUnit: "course",
      image:
        "https://images.unsplash.com/photo-1565193298595-6b6a2f3a2e6e?auto=format&fit=crop&w=900&q=85",
      featured: true,
      verified: true,
      format: "Offline",
    },
    {
      id: 3,
      title: "Watercolor Landscapes",
      studio: "Canvas Grove Art Academy",
      location: "Online",
      age: "16–75 yrs",
      price: "₹2,200",
      priceUnit: "month",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      featured: true,
      verified: true,
      format: "Online",
    },
    {
      id: 4,
      title: "Antique Drawing/Online & Offline Drawing classes for kids",
      studio: "Sweety jain",
      location: "Online",
      age: "5+ yrs",
      price: "₹1,000",
      priceUnit: "month",
      image:
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85",
      featured: true,
      verified: false,
      format: "Online",
    },
  ];

  return (
    <main className="TrainingOne">
      {/* Hero and breadcrumbs */}
      <section className="TrainingOne-hero">
        <div className="TrainingOne-container">
          <nav
            className="TrainingOne-breadcrumb"
            aria-label="Breadcrumb"
          >
            <a href="/">Home</a>
            <span className="TrainingOne-breadcrumbSeparator">/</span>
            <a href="/training">Art Classes</a>
            <span className="TrainingOne-breadcrumbSeparator">/</span>
           
            <span className="TrainingOne-breadcrumbSeparator">/</span>
            <span className="TrainingOne-breadcrumbCurrent">
              India
            </span>
          </nav>

          <div className="TrainingOne-heroContent">
            <span className="TrainingOne-heroEyebrow">
              <Palette size={17} />
              Discover your creative side
            </span>

            <h1 className="TrainingOne-title">
              Art Classes in India
            </h1>

            <p className="TrainingOne-description">
              Find drawing, painting, craft and other art classes in
              India for children, teens and adults — compare teachers,
              studios and workshops, then enquire directly.
            </p>

            <div className="TrainingOne-heroHighlights">
              <span>
                <Check size={15} />
                All skill levels
              </span>
              <span>
                <Check size={15} />
                Online &amp; offline
              </span>
              <span>
                <Check size={15} />
                Creative learning
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured classes */}
      <section className="TrainingOne-featured">
        <div className="TrainingOne-container">
          <div className="TrainingOne-sectionHeader">
            <div className="TrainingOne-sectionHeading">
              <span className="TrainingOne-sectionIcon">
                <Star size={17} fill="currentColor" />
              </span>

              <div>
                <h2 className="TrainingOne-sectionTitle">
                  Featured art classes in India
                </h2>

                <p className="TrainingOne-sectionSubtitle">
                  Handpicked classes to inspire your next masterpiece.
                </p>
              </div>
            </div>

            <a
              className="TrainingOne-allFeatured"
              href="/training"
            >
              All featured
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="TrainingOne-grid">
            {artClasses.map((artClass) => (
              <article
                className="TrainingOne-card"
                key={artClass.id}
              >
                <a
                  className="TrainingOne-cardImageLink"
                  href={`/training/class/${artClass.id}`}
                  aria-label={`View ${artClass.title}`}
                >
                  <div className="TrainingOne-cardImageWrapper">
                    <img
                      className="TrainingOne-cardImage"
                      src={artClass.image}
                      alt={artClass.title}
                      loading="lazy"
                    />

                    <span className="TrainingOne-featuredBadge">
                      Featured
                    </span>

                    <span
                      className={`TrainingOne-formatBadge ${
                        artClass.format === "Online"
                          ? "TrainingOne-formatBadge--online"
                          : "TrainingOne-formatBadge--offline"
                      }`}
                    >
                      {artClass.format}
                    </span>

                    {artClass.verified && (
                      <span className="TrainingOne-verifiedBadge">
                        <Check size={14} strokeWidth={2.5} />
                        Verified
                      </span>
                    )}
                  </div>
                </a>

                <div className="TrainingOne-cardBody">
                  <div className="TrainingOne-cardDetails">
                    <h3 className="TrainingOne-cardTitle">
                      <a href={`/training/class/${artClass.id}`}>
                        {artClass.title}
                      </a>
                    </h3>

                    <p className="TrainingOne-studio">
                      {artClass.studio}
                    </p>

                    <div className="TrainingOne-cardMeta">
                      <span className="TrainingOne-location">
                        <MapPin size={13} />
                        {artClass.location}
                      </span>

                      <span className="TrainingOne-metaDivider">·</span>

                      <span className="TrainingOne-age">
                        {artClass.age}
                      </span>
                    </div>
                  </div>

                  <div className="TrainingOne-cardFooter">
                    <div className="TrainingOne-price">
                      <strong>{artClass.price}</strong>
                      <span>/ {artClass.priceUnit}</span>
                    </div>

                    <span className="TrainingOne-newBadge">
                      New
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom information */}
          <div className="TrainingOne-bottomNote">
            <div className="TrainingOne-bottomIcon">
              <GraduationCap size={23} />
            </div>

            <div className="TrainingOne-bottomText">
              <h3>Make time for your creativity</h3>
              <p>
                Explore art, learn new skills and discover the artist within
                you.
              </p>
            </div>

            <Sparkles
              className="TrainingOne-bottomSparkle"
              size={27}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrainingOne;
