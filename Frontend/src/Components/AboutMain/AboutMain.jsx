import React, { useEffect, useRef, useState } from "react";
import "./AboutMain.css";

import imageOne from "../../assets/about-us-1.webp";
import imageTwo from "../../assets/about-us-2.webp";

const values = ["Integrity", "Diversity", "Accessibility", "Support"];

const stats = [
  { id: 1, end: 65, decimals: 0, suffix: "K", label: "Customers" },
  { id: 2, end: 1.5, decimals: 1, suffix: "K", label: "Collections" },
  { id: 3, end: 800, decimals: 0, suffix: "", label: "Auctions" },
  { id: 4, end: 1, decimals: 0, suffix: "K", label: "Bidders" },
];

const AboutMainCounter = ({ end, decimals, suffix, start }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setValue(end);
      return;
    }

    const duration = 1800;
    let frame;
    let startTime = null;

    const tick = (now) => {
      if (startTime === null) startTime = now;

      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setValue(end * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [start, end]);

  return (
    <span>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const AboutMain = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) return;

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
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`AboutMain ${inView ? "AboutMain-visible" : ""}`}
      aria-labelledby="AboutMain-heading"
    >
      <div className="AboutMain-container">
        <div className="AboutMain-content">
          <span className="AboutMain-eyebrow">
            OUR STORY &amp; OUR PASSION
          </span>

          <h2 id="AboutMain-heading" className="AboutMain-title">
            Discover Our Essence
          </h2>

          <span className="AboutMain-titleLine" aria-hidden="true" />

          <p className="AboutMain-text">
            At Art &amp; Culture, we are passionate art enthusiasts
            dedicated to connecting artists and collectors through
            dynamic and exciting auctions. Our platform celebrates
            the creativity and diversity of artists from around the
            world, providing a space where their works can be
            appreciated and acquired by collectors who value them.
          </p>

          <ul className="AboutMain-values">
            {values.map((item, index) => (
              <li
                key={item}
                className="AboutMain-valueItem"
                style={{ "--delay": `${0.55 + index * 0.1}s` }}
              >
                <svg
                  className="AboutMain-check"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>

                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="AboutMain-stats">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="AboutMain-statItem"
                style={{ "--delay": `${0.8 + index * 0.12}s` }}
              >
                <h3 className="AboutMain-statNumber">
                  <AboutMainCounter
                    end={stat.end}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    start={inView}
                  />
                </h3>

                <p className="AboutMain-statLabel">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="AboutMain-gallery">
          <figure className="AboutMain-figure AboutMain-figureOne">
            <div className="AboutMain-imageWrap">
              <img
                className="AboutMain-image"
                src={imageOne}
                alt="Artwork and colorful floral details"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>

          <figure className="AboutMain-figure AboutMain-figureTwo">
            <div className="AboutMain-imageWrap">
              <img
                className="AboutMain-image"
                src={imageTwo}
                alt="Creative portrait surrounded by colorful nature"
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>

          <span className="AboutMain-glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default AboutMain;