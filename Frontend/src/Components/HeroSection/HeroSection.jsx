
import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaExternalLinkAlt } from "react-icons/fa";

import "./HeroSection.css";
import heroArtwork from "../../assets/home2-banner-img.webp";

const HeroSection = () => {
  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get("search")?.toString().trim();

    if (searchTerm) {
      window.location.href = `/shop?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <section className="HeroSection">
      {/* Search Bar and Help Link */}
      <div className="HeroSection-topbar">
        <div className="HeroSection-container">
          <form
            className="HeroSection-search"
            onSubmit={handleSearch}
            role="search"
          >
            <input
              type="search"
              name="search"
              placeholder="Search your product here"
              aria-label="Search artworks"
            />

            <button type="submit" aria-label="Search">
              <FaSearch />
            </button>
          </form>

          <Link to="/contact" className="HeroSection-help">
            <span>Need Help?</span>
            <FaExternalLinkAlt />
          </Link>
        </div>
      </div>

      {/* Main Hero Banner */}
      <div className="HeroSection-container">
        <div className="HeroSection-banner">
          {/* Left Content */}
          <div className="HeroSection-content">
            <span className="HeroSection-eyebrow">
              Explore Exclusive Collections
            </span>

            <h1 className="HeroSection-title">
              Discover, Bid, and Collect
              <br className="HeroSection-desktop-break" /> Art from Around the
              <br className="HeroSection-desktop-break" /> World
            </h1>

            <p className="HeroSection-description">
              Unlock a world of imagination with our curated collection of
              original artworks.
            </p>

            <Link to="/shop" className="HeroSection-button">
              <span>Explore Auctions</span>
            </Link>
          </div>

          {/* Single Image Containing Three Artworks */}
          <div className="HeroSection-gallery">
            <img
              src={heroArtwork}
              alt="Collection of three classical artworks"
              className="HeroSection-gallery-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
