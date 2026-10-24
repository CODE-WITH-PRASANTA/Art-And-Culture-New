
import React, { useEffect, useState } from "react";
import {
  FaQuoteRight,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";

import "./Testimonial.css";
import testimonialImage from "../../assets/home2-artistic-img.webp";

const testimonialData = [
  {
    id: 1,
    title: "Excellent Item for Auctions!",
    message:
      '"I purchased a beautiful painting from this site, and the quality is incredible. The buying process was seamless, and the delivery was prompt. Highly recommend for anyone looking to buy unique art."',
    name: "Mrs. Lucas",
    role: "Art Teacher",
    date: "2025-01-01 23:00",
    initials: "ML",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    title: "Amazing Bidding Items!",
    message:
      '"The artwork exceeded my expectations. The details, colors, and overall quality are wonderful. I had a great experience exploring and purchasing art through this platform."',
    name: "John Doe",
    role: "Art Collector",
    date: "2025-01-03 12:30",
    initials: "JD",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    title: "A Wonderful Art Experience!",
    message:
      '"A beautiful collection and a very straightforward purchasing experience. I found an artwork that perfectly complements my home. I would absolutely recommend this platform."',
    name: "Mr. Abio",
    role: "Exhibition Manager",
    date: "2024-12-31 17:45",
    initials: "MA",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 4,
    title: "Beautiful Art Collection!",
    message:
      '"The selection of artwork is impressive, and the entire experience felt simple and enjoyable. I appreciate the variety of original styles available."',
    name: "Sarah Wilson",
    role: "Art Enthusiast",
    date: "2025-01-05 10:15",
    initials: "SW",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
  },
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalTestimonials = testimonialData.length;

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % totalTestimonials);
  };

  const showPrevious = () => {
    setActiveIndex(
      (current) => (current - 1 + totalTestimonials) % totalTestimonials
    );
  };

  useEffect(() => {
    if (isPaused) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalTestimonials);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPaused, totalTestimonials]);

  return (
    <section className="Testimonial">
      <div className="Testimonial-container">
        {/* Left artist photograph */}
        <div className="Testimonial-visual">
          <img
            src={testimonialImage}
            alt="Artist painting a landscape outdoors"
            className="Testimonial-image"
            loading="lazy"
          />
        </div>

        {/* Right testimonial carousel */}
        <div className="Testimonial-content">
          <div
            className="Testimonial-viewport"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsPaused(false);
              }
            }}
          >
            <div
              className="Testimonial-track"
              style={{
                "--Testimonial-index": activeIndex,
              }}
            >
              {testimonialData.map((testimonial) => (
                <article
                  className="Testimonial-card"
                  key={testimonial.id}
                  aria-label={`Testimonial from ${testimonial.name}`}
                >
                  <FaQuoteRight
                    className="Testimonial-quote-icon"
                    aria-hidden="true"
                  />

                  <h3 className="Testimonial-card-title">
                    {testimonial.title}
                  </h3>

                  <p className="Testimonial-message">
                    {testimonial.message}
                  </p>

                  <div className="Testimonial-card-divider" />

                  <div className="Testimonial-reviewer">
                    <img
                      className="Testimonial-avatar"
                      src={testimonial.avatar}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <div className="Testimonial-reviewer-info">
                      <h4 className="Testimonial-reviewer-name">
                        {testimonial.name}
                      </h4>

                      <p className="Testimonial-reviewer-role">
                        {testimonial.role}
                      </p>
                    </div>

                    <time className="Testimonial-date">
                      {testimonial.date}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Vertical navigation controls */}
          <div className="Testimonial-controls">
            <button
              type="button"
              className="Testimonial-control"
              onClick={showPrevious}
              aria-label="Previous testimonial"
              title="Previous testimonial"
            >
              <FaChevronUp />
            </button>

            <button
              type="button"
              className="Testimonial-control"
              onClick={showNext}
              aria-label="Next testimonial"
              title="Next testimonial"
            >
              <FaChevronDown />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
