import React, { useState, useEffect } from "react";
import logo from "../../assets/Art_and_Culture_logo-removebg-preview.png";
import "./Preloader.css";

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Elegant duration for the luxury golden logo presentation
    const timer = setTimeout(() => {
      setFadeOut(true);
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 600);
      return () => clearTimeout(removeTimer);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`luxury-preloader ${fadeOut ? "preloader-exit" : ""}`}
      aria-label="Art & Culture"
      role="status"
    >
      <div className="preloader-backdrop-glow" />

      <div className="preloader-emblem-container">
        {/* Subtle Luxury Gold Orbit Rings */}
        <div className="preloader-orbit-ring outer" />
        <div className="preloader-orbit-ring inner" />

        {/* Brand Golden Logo (Transparent PNG) */}
        <div className="preloader-logo-frame">
          <img
            src={logo}
            alt="Art & Culture"
            className="preloader-luxury-logo"
          />
        </div>

        {/* Slender Gold Progress Ray */}
        <div className="preloader-gold-track">
          <div className="preloader-gold-ray" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
