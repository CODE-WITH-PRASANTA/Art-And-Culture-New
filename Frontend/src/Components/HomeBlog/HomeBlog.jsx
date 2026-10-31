import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { BLOGS_API_URL, formatImageUrl } from "../../config/api";
import "./HomeBlog.css";

const defaultBlogArticles = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Simple Hacks for a Healthier Daily Routine",
    description:
      "Discover simple yet transformative daily rituals to revitalize your energy, mental clarity, and wellness.",
    slug: "/blog/healthier-daily-routine",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Effective Ways to Save Money While Shopping",
    description:
      "Smart, proven shopping strategies and mindful budget techniques for art enthusiasts and collectors.",
    slug: "/blog/save-money-while-shopping",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Top Marketing Trends to Watch This Year",
    description:
      "Key creative trends and cultural shifts reshaping the modern digital art and design landscape.",
    slug: "/blog/marketing-trends",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=85",
    date: "30 December, 2024",
    comments: 0,
    title: "Transform Your Backyard into a Relaxing Oasis",
    description:
      "Elevate your outdoor sanctuary with timeless sculptural accents and soothing natural aesthetics.",
    slug: "/blog/relaxing-oasis",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=800&q=85",
    date: "28 December, 2024",
    comments: 2,
    title: "Discover the Beauty of Contemporary Art",
    description:
      "An inspiring journey into vibrant textures, bold expressions, and thought-provoking cultural narratives.",
    slug: "/blog/contemporary-art",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=85",
    date: "25 December, 2024",
    comments: 4,
    title: "Creative Ideas to Inspire Your Next Masterpiece",
    description:
      "Unleash your artistic potential with insightful techniques and creative concepts from celebrated artisans.",
    slug: "/blog/creative-art-ideas",
  },
];

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const HomeBlog = () => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const autoplayRef = useRef(null);

  const [articles, setArticles] = useState(defaultBlogArticles);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDistance, setSlideDistance] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch published blogs from API
  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BLOGS_API_URL}?status=Published`);
        const data = await res.json();

        if (isMounted && data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          const mapped = data.blogs.map((b, idx) => {
            const rawDate = b.publishDate || b.createdAt;
            let formattedDate = "Recent";
            if (rawDate) {
              const d = new Date(rawDate);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
              }
            }

            const imgUrl = formatImageUrl(b.mainImage || b.image);
            const fallbackImg = defaultBlogArticles[idx % defaultBlogArticles.length]?.image;

            const rawDescription =
              (b.excerpt && stripHtml(b.excerpt)) ||
              (b.description && stripHtml(b.description)) ||
              (b.metaDescription && stripHtml(b.metaDescription)) ||
              "";

            const cleanDescription =
              rawDescription.length > 115
                ? rawDescription.slice(0, 115).trim() + "..."
                : rawDescription ||
                  defaultBlogArticles[idx % defaultBlogArticles.length]?.description ||
                  "Discover the authentic artistry, craftsmanship, and cultural heritage behind this piece.";

            return {
              id: b._id || b.slug || `blog-${idx}`,
              image: imgUrl || fallbackImg,
              date: formattedDate,
              comments: typeof b.commentsCount === "number" ? b.commentsCount : 0,
              title: b.title || "Untitled Article",
              description: cleanDescription,
              slug: `/blog/${b.slug || b._id}`,
            };
          });

          setArticles(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch blogs for Latest Article:", err);
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

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
      articles.length - visibleCount
    );

    setSlideDistance(cardWidth + gap);
    setMaxIndex(nextMaxIndex);

    setActiveIndex((current) => Math.min(current, nextMaxIndex));
  }, [articles.length]);

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
  }, [measureCarousel, articles]);

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
          <div className="HomeBlog-header-left">
            <div className="HomeBlog-eyebrow">
              <span className="HomeBlog-eyebrow-spark">✦</span>
              <span>CURATED EDITORIAL & JOURNAL</span>
            </div>
            <h2 className="HomeBlog-title" id="HomeBlog-title">
              Latest Articles <span className="HomeBlog-title-accent">& Heritage Stories</span>
            </h2>
          </div>

          <div className="HomeBlog-header-right">
            <p className="HomeBlog-subtitle">
              Explore in-depth cultural chronicles, master artisan dialogues, and timeless reflections celebrating India's living art traditions.
            </p>

            <div className="HomeBlog-header-actions">
              <Link to="/blog" className="HomeBlog-view-all-btn">
                <span>Explore All Articles</span>
                <FaArrowRight className="HomeBlog-view-all-icon" />
              </Link>
            </div>
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
              {articles.map((article, index) => (
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
                      onError={(e) => {
                        const fallback =
                          defaultBlogArticles[index % defaultBlogArticles.length]?.image ||
                          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85";
                        if (e.target.src !== fallback) {
                          e.target.src = fallback;
                        }
                      }}
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

                    {article.description && (
                      <p className="HomeBlog-description">
                        {article.description}
                      </p>
                    )}

                    <Link
                      to={article.slug}
                      className="HomeBlog-read-more"
                    >
                      <span>Read Article</span>
                      <FaArrowRight className="HomeBlog-read-more-arrow" />
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
