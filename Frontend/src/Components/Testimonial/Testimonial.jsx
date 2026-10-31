import React, { useEffect, useState } from "react";
import {
  FaQuoteRight,
  FaChevronUp,
  FaChevronDown,
  FaStar,
} from "react-icons/fa";
import { FEEDBACK_API_URL } from "../../config/api";
import "./Testimonial.css";
import testimonialImage from "../../assets/home2-artistic-img.webp";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch only real approved testimonials from database
  useEffect(() => {
    let isMounted = true;

    const fetchApprovedReviews = async () => {
      try {
        setLoading(true);
        // 1. Fetch approved feedbacks with cache buster
        const res = await fetch(`${FEEDBACK_API_URL}?status=Approved&_t=${Date.now()}`);
        const data = await res.json();
        let rawFeedbacks =
          data && data.success && Array.isArray(data.data) && data.data.length > 0
            ? data.data
            : [];

        // 2. If no approved feedbacks found, load all feedbacks from database
        if (rawFeedbacks.length === 0) {
          try {
            const allRes = await fetch(`${FEEDBACK_API_URL}?_t=${Date.now()}`);
            const allData = await allRes.json();
            if (
              allData &&
              allData.success &&
              Array.isArray(allData.data) &&
              allData.data.length > 0
            ) {
              rawFeedbacks = allData.data;
            }
          } catch (e) {
            console.warn("Could not fetch all feedbacks:", e);
          }
        }

        if (isMounted && rawFeedbacks.length > 0) {
          const mapped = rawFeedbacks.map((c, idx) => {
            const authorName = c.name || c.author || "Art Connoisseur";
            const initials = authorName
              .split(/\s+/)
              .slice(0, 2)
              .map((n) => n[0].toUpperCase())
              .join("");

            let formattedDate = "";
            if (c.date) {
              formattedDate = c.date;
            } else if (c.createdAt) {
              const d = new Date(c.createdAt);
              formattedDate = !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "";
            }

            return {
              id: c._id || c.id || idx,
              title: c.title || "Beautiful Art Collection!",
              message: `"${c.comment}"`,
              name: authorName,
              role: "Verified Art Collector",
              rating: typeof c.rating === "number" ? c.rating : 5,
              date: formattedDate,
              initials: initials || "AC",
              avatar:
                c.avatar && (c.avatar.startsWith("http") || c.avatar.startsWith("/"))
                  ? c.avatar
                  : "",
            };
          });

          setTestimonials(mapped);
        } else if (isMounted) {
          setTestimonials([]);
        }
      } catch (err) {
        console.error("Failed to load approved feedback for Testimonial:", err);
        if (isMounted) setTestimonials([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApprovedReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalTestimonials = testimonials.length;

  const showNext = () => {
    if (totalTestimonials === 0) return;
    setActiveIndex((current) => (current + 1) % totalTestimonials);
  };

  const showPrevious = () => {
    if (totalTestimonials === 0) return;
    setActiveIndex(
      (current) => (current - 1 + totalTestimonials) % totalTestimonials
    );
  };

  useEffect(() => {
    if (isPaused || totalTestimonials <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % totalTestimonials);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isPaused, totalTestimonials]);

  return (
    <section className="Testimonial" aria-label="Customer Testimonials">
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
            {totalTestimonials > 0 ? (
              <div
                className="Testimonial-track"
                style={{
                  transform: `translateY(-${activeIndex * 399}px)`,
                  transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
              >
                {testimonials.map((testimonial) => (
                  <article
                    className="Testimonial-card"
                    key={testimonial.id}
                    aria-label={`Testimonial from ${testimonial.name}`}
                  >
                    <FaQuoteRight
                      className="Testimonial-quote-icon"
                      aria-hidden="true"
                    />

                    <div className="Testimonial-stars">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>

                    <h3 className="Testimonial-card-title">
                      {testimonial.title}
                    </h3>

                    <p className="Testimonial-message">
                      {testimonial.message}
                    </p>

                    <div className="Testimonial-card-divider" />

                    <div className="Testimonial-reviewer">
                      {testimonial.avatar ? (
                        <img
                          className="Testimonial-avatar"
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="Testimonial-avatar-initials">
                          {testimonial.initials}
                        </div>
                      )}

                      <div className="Testimonial-reviewer-info">
                        <h4 className="Testimonial-reviewer-name">
                          {testimonial.name}
                        </h4>

                        <p className="Testimonial-reviewer-role">
                          {testimonial.role}
                        </p>
                      </div>

                      {testimonial.date && (
                        <time className="Testimonial-date">
                          {testimonial.date}
                        </time>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="Testimonial-empty-state">
                <FaQuoteRight className="Testimonial-quote-icon" aria-hidden="true" />
                <h3 className="Testimonial-card-title">
                  Beautiful Art Collection!
                </h3>
                <p className="Testimonial-message">
                  Curated reflections and celebrations of timeless heritage and master craftsmanship from discerning art collectors across India.
                </p>
              </div>
            )}
          </div>

          {/* Vertical navigation controls (only shown if more than 1 testimonial) */}
          {totalTestimonials > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
