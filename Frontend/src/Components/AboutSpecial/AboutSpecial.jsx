import React, { useEffect, useRef, useState } from "react";
import aboutImage from "../../assets/about-us-5.webp";
import "./AboutSpecial.css";

/* Small inline icons (no extra packages needed) */
const iconProps = {
  viewBox: "0 0 24 24",
  width: 22,
  height: 22,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const HandshakeIcon = () => (
  <svg {...iconProps}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </svg>
);

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const UsersIcon = () => (
  <svg {...iconProps}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SparkIcon = () => (
  <svg {...iconProps}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
);

const features = [
  {
    id: 1,
    Icon: HandshakeIcon,
    title: "Support Artists",
    text: "Supporting their creative endeavors helps them continue to produce extraordinary works.",
  },
  {
    id: 2,
    Icon: ShieldIcon,
    title: "Secure Transactions",
    text: "Every bid and payment is protected, so artists and collectors can trade with confidence.",
  },
  {
    id: 3,
    Icon: UsersIcon,
    title: "User-Friendly Platform",
    text: "Our website is designed for ease of use.",
  },
  {
    id: 4,
    Icon: SparkIcon,
    title: "Seamless Experience",
    text: "We connect artists and collectors from around the world.",
  },
];

const AboutSpecial = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  /* Start every animation when the section enters the viewport */
  useEffect(() => {
    const node = sectionRef.current;
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
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`AboutSpecial ${inView ? "AboutSpecial-visible" : ""}`}
      aria-labelledby="AboutSpecial-heading"
    >
      <span className="AboutSpecial-glow" aria-hidden="true" />

      <div className="AboutSpecial-container">
        {/* ---------------- Content ---------------- */}
        <div className="AboutSpecial-content">
          <h2 id="AboutSpecial-heading" className="AboutSpecial-title">
            What Makes Us Special
          </h2>
          <span className="AboutSpecial-titleLine" aria-hidden="true" />

          <p className="AboutSpecial-intro">
            An unparalleled art auction experience where quality, integrity,
            and passion for art come together.
          </p>

          <ul className="AboutSpecial-list">
            {features.map(({ id, Icon, title, text }, index) => (
              <li
                key={id}
                className="AboutSpecial-item"
                style={{ "--delay": `${0.5 + index * 0.13}s` }}
              >
                <span className="AboutSpecial-icon">
                  <Icon />
                </span>
                <div className="AboutSpecial-itemBody">
                  <h3 className="AboutSpecial-itemTitle">{title}</h3>
                  <p className="AboutSpecial-itemText">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Image ---------------- */}
        <div className="AboutSpecial-media">
          <span className="AboutSpecial-accent" aria-hidden="true" />
          <figure className="AboutSpecial-figure">
            <div className="AboutSpecial-imageWrap">
              <img
                className="AboutSpecial-image"
                src={aboutImage}
                alt="A couple in a tender embrace, painted among soft flowers"
                loading="lazy"
              />
              <span className="AboutSpecial-shade" aria-hidden="true" />
            </div>
          </figure>

          <div className="AboutSpecial-badge">
            <strong className="AboutSpecial-badgeNumber">65K</strong>
            <span className="AboutSpecial-badgeText">
              collectors trust Art &amp; Culture
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSpecial;