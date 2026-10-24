
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./Endeavor.css";

import endeavorImage from "../../assets/home2-artistic-img.webp";
import endeavorBanner from "../../assets/home2-artistic-banner-img.webp";

const Endeavor = () => {
  const missionPoints = [
    "Empowering Artists",
    "Connecting Collectors",
    "Fostering Diversity",
    "Ensuring Integrity",
    "Building Community",
  ];

  return (
    <section className="Endeavor">
      <div className="Endeavor-container">
        {/* Top banner with three artworks */}
        <div className="Endeavor-banner">
          <img
            src={endeavorBanner}
            alt="Three artistic illustrations celebrating creativity"
            className="Endeavor-banner-image"
          />

          <div className="Endeavor-banner-overlay" />

          <h2 className="Endeavor-banner-title">
            Our Artistic Endeavor
          </h2>
        </div>

        {/* Main content section */}
        <div className="Endeavor-content">
          {/* Overlapping portrait */}
          <div className="Endeavor-visual">
            <div className="Endeavor-image-wrapper">
              <img
                src={endeavorImage}
                alt="Illustration of a red-haired girl holding a rabbit among flowers"
                className="Endeavor-image"
                loading="lazy"
              />
            </div>
          </div>

          {/* Mission statement */}
          <div className="Endeavor-details">
            <p className="Endeavor-intro">
              At Artmart, our mission is to revolutionize the art
              experience. We are committed to:
            </p>

            <ul className="Endeavor-list">
              {missionPoints.map((point) => (
                <li className="Endeavor-list-item" key={point}>
                  <span className="Endeavor-arrow" aria-hidden="true">
                    <FaArrowRight />
                  </span>

                  <span className="Endeavor-list-text">{point}</span>
                </li>
              ))}
            </ul>

            <p className="Endeavor-description">
              We believe that art has the power to inspire, transform,
              and connect people. Our goal is to bring this power to life
              by creating a vibrant platform where artists can share
              their creativity and collectors can discover meaningful
              works of art.
            </p>

            <Link to="/about-us" className="Endeavor-button">
              Discover Our Story
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Endeavor;
