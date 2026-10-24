
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./HomeBlog.css";

const blogArticles = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Simple Hacks for a Healthier Daily Routine",
    slug: "/blog/healthier-daily-routine",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Effective Ways to Save Money While Shopping",
    slug: "/blog/save-money-while-shopping",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Top Marketing Trends to Watch This Year",
    slug: "/blog/marketing-trends",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Transform Your Backyard into a Relaxing Oasis",
    slug: "/blog/relaxing-oasis",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=85",
    date: "28 December, 2024",
    comments: 2,
    title: "Discover the Beauty of Contemporary Art",
    slug: "/blog/contemporary-art",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=85",
    date: "25 December, 2024",
    comments: 4,
    title: "Creative Ideas to Inspire Your Next Masterpiece",
    slug: "/blog/creative-art-ideas",
  },
];

const HomeBlog = () => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const autoplayRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDistance, setSlideDistance] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const measureCarousel = useCallback(() => {
    const viewport = viewportRef.current;
    const firstCard = cardRefs.current[0];
    const track = trackRef.current;

    if (!viewport || !firstCard || !track) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap) || 0;
    const viewportWidth = viewport.getBoundingClientRect().width;

    if (!cardWidth || !viewportWidth) return;

    const visibleCount = Math.max(
      1,
      Math.floor((viewportWidth + gap + 0.5) / (cardWidth + gap))
    );

    const nextMaxIndex = Math.max(
      0,
      blogArticles.length - visibleCount
    );

    setSlideDistance(cardWidth + gap);
    setMaxIndex(nextMaxIndex);

    setActiveIndex((current) => Math.min(current, nextMaxIndex));
  }, []);

  useEffect(() => {
    measureCarousel();

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined" && viewportRef.current) {
      resizeObserver = new ResizeObserver(measureCarousel);
      resizeObserver.observe(viewportRef.current);

      if (cardRefs.current[0]) {
        resizeObserver.observe(cardRefs.current[0]);
      }
    } else {
      window.addEventListener("resize", measureCarousel);
    }

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureCarousel);
    };
  }, [measureCarousel]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current >= maxIndex ? 0 : current + 1
    );
  }, [maxIndex]);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current <= 0 ? maxIndex : current - 1
    );
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || maxIndex === 0) return undefined;

    autoplayRef.current = window.setInterval(() => {
      setActiveIndex((current) =>
        current >= maxIndex ? 0 : current + 1
      );
    }, 5000);

    return () => window.clearInterval(autoplayRef.current);
  }, [isPaused, maxIndex]);

  return (
    <section className="HomeBlog" aria-labelledby="HomeBlog-title">
      <div className="HomeBlog-container">
        {/* Section heading */}
        <div className="HomeBlog-header">
          <div className="HomeBlog-heading">
            <h2 className="HomeBlog-title" id="HomeBlog-title">
              Latest Article
            </h2>
          </div>

          <div className="HomeBlog-header-content">
            <p className="HomeBlog-subtitle">
              Join us for an exhilarating live auction experience
              where art meets excitement.
            </p>

            <Link to="/blog" className="HomeBlog-view-all">
              View All
            </Link>
          </div>
        </div>

        {/* Article carousel */}
        <div
          className="HomeBlog-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false);
            }
          }}
        >
          <button
            type="button"
            className="HomeBlog-arrow HomeBlog-arrow--left"
            onClick={showPrevious}
            aria-label="Show previous article"
            title="Previous article"
          >
            <FaChevronLeft />
          </button>

          <div className="HomeBlog-viewport" ref={viewportRef}>
            <div
              className="HomeBlog-track"
              ref={trackRef}
              style={{
                transform: `translate3d(-${activeIndex * slideDistance}px, 0, 0)`,
              }}
            >
              {blogArticles.map((article, index) => (
                <article
                  className="HomeBlog-card"
                  key={article.id}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                >
                  <Link
                    to={article.slug}
                    className="HomeBlog-image-link"
                    aria-label={`Read ${article.title}`}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="HomeBlog-image"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                  </Link>

                  <div className="HomeBlog-card-content">
                    <div className="HomeBlog-meta">
                      <time>{article.date}</time>
                      <span className="HomeBlog-meta-divider" />
                      <span>
                        {article.comments}{" "}
                        {article.comments === 1 ? "Comment" : "Comments"}
                      </span>
                    </div>

                    <h3 className="HomeBlog-card-title">
                      <Link to={article.slug}>
                        {article.title}
                      </Link>
                    </h3>

                    <Link
                      to={article.slug}
                      className="HomeBlog-read-more"
                    >
                      Read Article
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="HomeBlog-arrow HomeBlog-arrow--right"
            onClick={showNext}
            aria-label="Show next article"
            title="Next article"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeBlog;
