import React, { useEffect, useRef, useState } from "react";
import aboutImage from "../../assets/about-us-3.webp";
import "./AboutMainArtistic.css";

const commitments = [
  "Empowering Artists",
  "Connecting Collectors",
  "Fostering Diversity",
  "Ensuring Integrity",
  "Building Community",
];

const AboutMainArtistic = () => {
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
      { threshold: 0.12 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`AboutMainArtistic ${
        inView ? "AboutMainArtistic-visible" : ""
      }`}
      aria-labelledby="AboutMainArtistic-heading"
    >
      <div
        className="AboutMainArtistic-decoration"
        aria-hidden="true"
      >
        <span className="AboutMainArtistic-orb AboutMainArtistic-orbOne" />
        <span className="AboutMainArtistic-orb AboutMainArtistic-orbTwo" />
      </div>

      <div className="AboutMainArtistic-container">
        {/* Premium layered artwork */}
        <div className="AboutMainArtistic-media">
          <div className="AboutMainArtistic-mediaLabel">
            <span className="AboutMainArtistic-labelLine" />
            <span>ARTISTRY &amp; IMAGINATION</span>
          </div>

          <div className="AboutMainArtistic-imageStage">
            <span
              className="AboutMainArtistic-frame"
              aria-hidden="true"
            />

            <span
              className="AboutMainArtistic-glow"
              aria-hidden="true"
            />

            <figure className="AboutMainArtistic-figure">
              <div className="AboutMainArtistic-imageWrap">
                <img
                  className="AboutMainArtistic-image"
                  src={aboutImage}
                  alt="Expressive starry-night-inspired paintings presented in an artistic gallery composition"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </figure>

            <span
              className="AboutMainArtistic-imageCorner"
              aria-hidden="true"
            />
          </div>

          <div className="AboutMainArtistic-mediaFooter">
            <span>01</span>
            <span className="AboutMainArtistic-footerDivider" />
            <span>CREATIVITY WITHOUT BOUNDARIES</span>
          </div>
        </div>

        {/* Artistic mission */}
        <div className="AboutMainArtistic-content">
          <div className="AboutMainArtistic-eyebrow">
            <span className="AboutMainArtistic-eyebrowLine" />
            <span>OUR PHILOSOPHY</span>
          </div>

          <h2
            id="AboutMainArtistic-heading"
            className="AboutMainArtistic-title"
          >
            Our Artistic
            <span className="AboutMainArtistic-titleAccent">
              {" "}Endeavor
            </span>
          </h2>

          <span
            className="AboutMainArtistic-titleLine"
            aria-hidden="true"
          />

          <p className="AboutMainArtistic-intro">
            At Art &amp; Culture, our mission is to revolutionize the art
            experience. We are committed to creating a space where
            creativity thrives, artistic voices are celebrated, and
            meaningful connections flourish.
          </p>

          <ul className="AboutMainArtistic-list">
            {commitments.map((item, index) => (
              <li
                key={item}
                className="AboutMainArtistic-listItem"
                style={{ "--delay": `${0.45 + index * 0.1}s` }}
              >
                <span
                  className="AboutMainArtistic-arrow"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 12h17M14 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="AboutMainArtistic-listText">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p className="AboutMainArtistic-outro">
            We believe that art has the power to inspire, transform,
            and connect people. Our goal is to bring this power to life
            by creating an inclusive and inspiring artistic community.
          </p>

          <div className="AboutMainArtistic-signature">
            <span className="AboutMainArtistic-signatureLine" />
            <span>INSPIRED BY CREATIVITY. UNITED THROUGH ART.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMainArtistic;