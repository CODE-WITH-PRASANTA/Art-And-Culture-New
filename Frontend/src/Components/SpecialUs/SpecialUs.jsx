
import React from "react";
import {
  FaHandshake,
  FaShieldAlt,
  FaPalette,
  FaUsers,
} from "react-icons/fa";

import "./SpecialUs.css";
import specialUsImage from "../../assets/home2-feature-img.webp";

const SpecialUs = () => {
  const features = [
    {
      id: 1,
      title: "Support Artists",
      description:
        "Supporting their creative endeavors, helping them continue to produce extraordinary works.",
      icon: FaHandshake,
    },
    {
      id: 2,
      title: "Secure Transactions",
      description:
        "Supporting their creative endeavors, helping them continue to produce extraordinary works.",
      icon: FaShieldAlt,
    },
    {
      id: 3,
      title: "Seamless Experience",
      description:
        "Supporting their creative endeavors, helping them continue to produce extraordinary works.",
      icon: FaPalette,
    },
    {
      id: 4,
      title: "User-Friendly Platform",
      description:
        "Supporting their creative endeavors, helping them continue to produce extraordinary works.",
      icon: FaUsers,
    },
  ];

  return (
    <section className="SpecialUs">
      <div className="SpecialUs-container">
        {/* Left: Overlapping Artwork */}
        <div className="SpecialUs-visual">
          <img
            src={specialUsImage}
            alt="A collection of colorful folk art and a traditional portrait"
            className="SpecialUs-image"
            loading="lazy"
          />
        </div>

        {/* Right: Heading and Features */}
        <div className="SpecialUs-content">
          <div className="SpecialUs-heading">
            <h2 className="SpecialUs-title">
              What Makes Us Special
            </h2>

            <p className="SpecialUs-subtitle">
              An unparalleled art auction experience where quality,
              integrity, and passion for art come together.
            </p>
          </div>

          <div className="SpecialUs-divider" />

          <div className="SpecialUs-features">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className="SpecialUs-feature"
                  key={feature.id}
                >
                  <div className="SpecialUs-feature-heading">
                    <span
                      className="SpecialUs-icon"
                      aria-hidden="true"
                    >
                      <Icon />
                    </span>

                    <h3 className="SpecialUs-feature-title">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="SpecialUs-feature-description">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialUs;
