
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Essence.css";

// Import your artwork from the assets folder.
// Replace this filename with your actual image filename.
import essenceArtwork from "../../assets/home2-about-img.webp";

const Essence = () => {
  const sectionRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  const statistics = [
    { value: 65, suffix: "K", label: "Customers" },
    { value: 1.5, suffix: "K", label: "Collections", decimals: 1 },
    { value: 800, suffix: "", label: "Auctions" },
    { value: 1, suffix: "K", label: "Bidders" },
  ];

  const features = [
    "Integrity",
    "Diversity",
    "Accessibility",
    "Support",
  ];

  // Animate statistics when the section enters the viewport.
  useEffect(() => {
    const section = sectionRef.current;

    if (!section || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Smooth counting animation.
  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1800;
    let animationFrame;

    const startTime = performance.now();

    const animateCounts = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Ease-out animation.
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCounts(
        statistics.map((stat) => {
          const value = stat.value * easedProgress;

          return stat.decimals
            ? Number(value.toFixed(stat.decimals))
            : Math.floor(value);
        })
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateCounts);
      }
    };

    animationFrame = requestAnimationFrame(animateCounts);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasAnimated]);

  return (
    <section
      className="Essence"
      ref={sectionRef}
      aria-labelledby="Essence-title"
    >
      <div className="Essence-container">
        <div className="Essence-layout">
          {/* LEFT: ARTWORK AND STATISTICS */}
          <div className="Essence-visual">
            <div className="Essence-image-wrapper">
              <img
                src={essenceArtwork}
                alt="Watercolor painting of a beautiful European village surrounded by mountains"
                className="Essence-image"
                loading="lazy"
              />
            </div>

            {/* OVERLAPPING STATISTICS */}
            <div className="Essence-stats">
              {statistics.map((stat, index) => (
                <div className="Essence-stat" key={stat.label}>
                  <div className="Essence-stat-number">
                    {stat.decimals
                      ? counts[index].toFixed(stat.decimals)
                      : counts[index]}
                    {stat.suffix}
                  </div>

                  <div className="Essence-stat-label">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="Essence-content">
            <h2 className="Essence-title" id="Essence-title">
              Discover Our Essence
            </h2>

            <p className="Essence-description">
              At Artmart, we are passionate art enthusiasts dedicated
              to connecting artists and collectors through dynamic
              and exciting auctions. Our platform celebrates the
              creativity and diversity of artists from around the
              world, providing a space where their works can be
              appreciated and acquired by art lovers everywhere.
            </p>

            <div className="Essence-bottom">
              {/* FEATURES */}
              <ul className="Essence-features">
                {features.map((feature) => (
                  <li className="Essence-feature" key={feature}>
                    <span
                      className="Essence-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* STARBURST BUTTON */}
              <Link
                to="/about-us"
                className="Essence-learn-more"
                aria-label="Learn more about Artmart"
              >
                <span>
                  Learn
                  <br />
                  More
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Essence;
