import React, { useEffect, useRef, useState } from "react";
import "./AboutClient.css";

const testimonials = [
  {
    id: 1,
    title: "Wonderful Bidding Deal",
    text: "I purchased a beautiful painting from this site, and the quality is incredible. The buying process was seamless, and the delivery was prompt. Highly recommend for anyone looking to buy unique art!",
    name: "Mr. Abid",
    role: "Exhibition Manager",
    date: "Dec 31, 2024",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=85",
    initials: "MA",
    rating: 5,
  },
  {
    id: 2,
    title: "Excellent Item for Auctions!",
    text: "Art & Culture made discovering original artwork such a wonderful experience. The collection is inspiring, the service is professional, and every detail feels thoughtfully curated.",
    name: "Mrs. Lucas",
    role: "Art Teacher",
    date: "Jan 01, 2025",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=85",
    initials: "ML",
    rating: 5,
  },
  {
    id: 3,
    title: "Amazing Bidding Items!",
    text: "The artwork exceeded my expectations. I loved the smooth bidding experience and the personal attention throughout the process. I will definitely return for my next art purchase.",
    name: "John Doe",
    role: "Independent Artist",
    date: "Jan 01, 2025",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=85",
    initials: "JD",
    rating: 5,
  },
  {
    id: 4,
    title: "A Beautiful Art Collection",
    text: "Every piece tells a story. The variety of artwork and the quality of the presentation made it easy to discover something truly special for my home.",
    name: "Sarah Williams",
    role: "Interior Designer",
    date: "Jan 12, 2025",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=85",
    initials: "SW",
    rating: 5,
  },
  {
    id: 5,
    title: "A Wonderful Experience",
    text: "From exploring the collection to completing my purchase, everything felt effortless. The team clearly understands art and makes collectors feel welcome.",
    name: "Daniel Martin",
    role: "Art Collector",
    date: "Jan 18, 2025",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=160&h=160&q=85",
    initials: "DM",
    rating: 5,
  },
];

const AboutClient = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRef = useRef(null);

  const [inView, setInView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);

  // Reveal the section when it enters the viewport.
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

  // Responsive card count.
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;

      setVisibleCount(width <= 640 ? 1 : width <= 1024 ? 2 : 3);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Keep the active position valid after a responsive layout change.
  useEffect(() => {
    setCurrentIndex((index) =>
      Math.min(index, Math.max(0, testimonials.length - visibleCount))
    );
  }, [visibleCount]);

  // Advance automatically every 3 seconds.
  useEffect(() => {
    if (!inView || paused || maxIndex === 0) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1));
    }, 3000);

    return () => window.clearInterval(timer);
  }, [inView, paused, maxIndex]);

  // Measure the actual card width and gap for accurate sliding.
  useEffect(() => {
    const track = trackRef.current;
    const card = cardRef.current;

    if (!track || !card) return;

    const updatePosition = () => {
      const cardWidth = card.getBoundingClientRect().width;
      const trackStyle = window.getComputedStyle(track);
      const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;

      track.style.setProperty(
        "--AboutClient-offset",
        `${currentIndex * (cardWidth + gap)}px`
      );
    };

    updatePosition();

    const observer = new ResizeObserver(updatePosition);
    observer.observe(card);

    return () => observer.disconnect();
  }, [currentIndex, visibleCount]);

  return (
    <section
      ref={sectionRef}
      className={`AboutClient ${inView ? "AboutClient-visible" : ""}`}
      aria-labelledby="AboutClient-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <div className="AboutClient-container">
        {/* Section heading */}
        <header className="AboutClient-header">
          <div className="AboutClient-headingContent">
            <div className="AboutClient-eyebrow">
              <span className="AboutClient-eyebrowLine" />
              <span>WORDS FROM OUR COMMUNITY</span>
            </div>

            <h2 id="AboutClient-heading" className="AboutClient-title">
              Client <span>Acknowledgment</span>
            </h2>

            <p className="AboutClient-subtitle">
              Join us for an exhilarating live auction experience where art
              meets excitement.
            </p>
          </div>

          <div className="AboutClient-ratingBadge">
            <div className="AboutClient-ratingStars" aria-label="5 out of 5 stars">
              {"★ ★ ★ ★ ★"}
            </div>
            <span className="AboutClient-ratingText">
              Loved by art enthusiasts
            </span>
          </div>
        </header>

        {/* Automatically moving testimonial cards */}
        <div className="AboutClient-carousel">
          <div
            ref={trackRef}
            className="AboutClient-track"
            style={{
              transform: "translate3d(calc(var(--AboutClient-offset, 0px) * -1), 0, 0)",
            }}
            aria-live="off"
          >
            {testimonials.map((testimonial, index) => (
              <article
                ref={index === 0 ? cardRef : null}
                key={testimonial.id}
                className="AboutClient-card"
                style={{ "--AboutClient-delay": `${index * 100}ms` }}
              >
                <div className="AboutClient-cardTop">
                  <span className="AboutClient-cardLabel">
                    CUSTOMER STORY
                  </span>

                  <span className="AboutClient-quoteMark" aria-hidden="true">
                    “
                  </span>
                </div>

                <div className="AboutClient-cardHeading">
                  <h3 className="AboutClient-cardTitle">
                    {testimonial.title}
                  </h3>

                  <span className="AboutClient-stars" aria-label="5 out of 5 stars">
                    {"★ ★ ★ ★ ★"}
                  </span>
                </div>

                <p className="AboutClient-review">
                  “{testimonial.text}”
                </p>

                <div className="AboutClient-divider" />

                <footer className="AboutClient-cardFooter">
                  <div className="AboutClient-author">
                    <div className="AboutClient-avatarWrap">
                      <img
                        className="AboutClient-avatar"
                        src={testimonial.image}
                        alt={testimonial.name}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.nextElementSibling.style.display =
                            "grid";
                        }}
                      />

                      <span
                        className="AboutClient-avatarFallback"
                        aria-hidden="true"
                      >
                        {testimonial.initials}
                      </span>
                    </div>

                    <div className="AboutClient-authorInfo">
                      <h4 className="AboutClient-authorName">
                        {testimonial.name}
                      </h4>
                      <p className="AboutClient-authorRole">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <time className="AboutClient-date">
                    {testimonial.date}
                  </time>
                </footer>

                <span className="AboutClient-cardAccent" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>

        {/* Minimal progress indicator; no arrow buttons */}
        <div className="AboutClient-bottom">
          <div
            className="AboutClient-progress"
            role="group"
            aria-label="Choose testimonial"
          >
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                type="button"
                className={`AboutClient-progressDot ${
                  currentIndex === index ? "AboutClient-progressDotActive" : ""
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Show testimonial set ${index + 1}`}
                aria-pressed={currentIndex === index}
              />
            ))}
          </div>

          <span className="AboutClient-bottomText">
            REAL EXPERIENCES. LASTING IMPRESSIONS.
          </span>
        </div>
      </div>
    </section>
  );
};

export default AboutClient; 