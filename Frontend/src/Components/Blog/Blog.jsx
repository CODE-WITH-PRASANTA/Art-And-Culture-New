import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BLOGS_API_URL, formatImageUrl } from "../../config/api";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Leaf,
  Lightbulb,
  MessageCircle,
  Palette,
  UserRound,
  Flower2,
  Sparkles,
} from "lucide-react";

import "./Blog.css";

const CATEGORY_ICONS_MAP = {
  "All Posts": null,
  "Art & Culture": Flower2,
  Heritage: Landmark,
  Painting: Palette,
  Traditions: Leaf,
  Artists: UserRound,
  Museum: BookOpen,
  "Tips & Guides": Lightbulb,
};

const tagColors = ["orange", "green", "blue"];

const Blog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [liveBlogs, setLiveBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Fetch real published blogs from database
  useEffect(() => {
    setLoading(true);
    fetch(`${BLOGS_API_URL}?status=Published`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs)) {
          setLiveBlogs(data.blogs);
        } else {
          setLiveBlogs([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching published blogs:", err);
        setLiveBlogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Dynamically compute categories from real published blogs
  const categories = useMemo(() => {
    const catsSet = new Set();
    liveBlogs.forEach((b) => {
      if (b.category && b.category.trim()) {
        catsSet.add(b.category.trim());
      }
    });

    const list = [{ name: "All Posts", icon: null }];
    catsSet.forEach((catName) => {
      list.push({
        name: catName,
        icon: CATEGORY_ICONS_MAP[catName] || Sparkles,
      });
    });

    return list;
  }, [liveBlogs]);

  // Map real database blogs only (no dummy or fallback blogs)
  const realPosts = useMemo(() => {
    if (!liveBlogs || liveBlogs.length === 0) return [];

    return liveBlogs.map((b, idx) => {
      const stripHtml = (html) => {
        if (!html) return "";
        return html
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      };

      const cleanDescription =
        b.excerpt ||
        (b.description
          ? stripHtml(b.description).slice(0, 160) + "..."
          : "Explore the authentic history, craftsmanship, and cultural significance behind this artwork.");

      const fallbackImg =
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85";

      return {
        id: b._id || b.id,
        slug: b.slug,
        category: b.category || "Art & Culture",
        date: b.publishDate
          ? new Date(b.publishDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "Recent",
        comments: b.commentsCount || 0,
        title: b.title,
        description: cleanDescription,
        image: formatImageUrl(b.mainImage || b.image) || fallbackImg,
        tagColor: tagColors[idx % tagColors.length],
        readTime: b.readTime || "5 min read",
      };
    });
  }, [liveBlogs]);

  // Filter posts by active category
  const filteredPosts = useMemo(() => {
    if (activeCategory === "All Posts") return realPosts;
    return realPosts.filter((post) => post.category === activeCategory);
  }, [activeCategory, realPosts]);

  // Visible carousel/grid slice
  const visiblePosts = useMemo(() => {
    if (showAll || filteredPosts.length <= 4) return filteredPosts;

    return Array.from({ length: 4 }, (_, index) => {
      return filteredPosts[(currentIndex + index) % filteredPosts.length];
    });
  }, [filteredPosts, currentIndex, showAll]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setShowAll(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((previous) =>
      previous === 0 ? filteredPosts.length - 1 : previous - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((previous) => (previous + 1) % filteredPosts.length);
  };

  const handleReadArticle = (post) => {
    const slugOrId = post.slug || post.id;
    navigate(`/blog/${slugOrId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="Blog" id="blog">
      <div className="Blog-decoration Blog-decoration--left" />
      <div className="Blog-decoration Blog-decoration--right" />

      <div className="Blog-container">
        {/* Blog Heading */}
        <header className="Blog-header">
          <div className="Blog-headingIcon">
            <Flower2 size={35} strokeWidth={1.25} />
          </div>

          <div className="Blog-eyebrow">
            <span className="Blog-eyebrowLine" />
            <span>Latest Insights</span>
            <span className="Blog-eyebrowLine" />
          </div>

          <h2 className="Blog-title">
            Our <span>Art &amp; Culture</span> Blog
          </h2>

          <p className="Blog-subtitle">
            Stories, insights, and inspirations from the world of art,
            culture, heritage and creativity.
            <br className="Blog-desktopBreak" />
            Explore articles, tips, trends and traditions that
            celebrate our rich artistic legacy.
          </p>

          <div className="Blog-headingOrnament">
            <span />
            <i />
            <span />
          </div>
        </header>

        {/* Dynamic Category Filters */}
        {categories.length > 1 && (
          <nav className="Blog-categories" aria-label="Blog categories">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  className={`Blog-category ${
                    isActive ? "Blog-category--active" : ""
                  }`}
                  onClick={() => handleCategoryChange(category.name)}
                  aria-pressed={isActive}
                >
                  {Icon && (
                    <Icon
                      className="Blog-categoryIcon"
                      size={20}
                      strokeWidth={1.7}
                    />
                  )}
                  <span>{category.name}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Article Display Area */}
        <div className="Blog-carousel">
          {filteredPosts.length > 4 && !showAll && (
            <>
              <button
                className="Blog-carouselArrow Blog-carouselArrow--left"
                type="button"
                onClick={handlePrevious}
                aria-label="Previous articles"
              >
                <ChevronLeft size={23} />
              </button>

              <button
                className="Blog-carouselArrow Blog-carouselArrow--right"
                type="button"
                onClick={handleNext}
                aria-label="Next articles"
              >
                <ChevronRight size={23} />
              </button>
            </>
          )}

          {loading ? (
            <div className="Blog-empty">
              <Flower2 size={36} className="spin-icon" />
              <h3>Loading articles...</h3>
              <p>Fetching real published stories from the database.</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="Blog-empty">
              <Palette size={36} />
              <h3>No articles found</h3>
              <p>
                {activeCategory !== "All Posts"
                  ? `No published articles under "${activeCategory}". Try "All Posts".`
                  : "No published blog articles currently available."}
              </p>
            </div>
          ) : (
            <div
              className={`Blog-grid ${
                showAll ? "Blog-grid--expanded" : ""
              }`}
            >
              {visiblePosts.map((post) => (
                <article className="Blog-card" key={post.id}>
                  <div
                    className="Blog-cardImageWrapper"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleReadArticle(post)}
                  >
                    <img
                      className="Blog-cardImage"
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85";
                      }}
                    />

                    <span
                      className={`Blog-cardTag Blog-cardTag--${post.tagColor}`}
                    >
                      {post.category}
                    </span>

                    <div className="Blog-imageOverlay" />
                  </div>

                  <div className="Blog-cardContent">
                    <div className="Blog-cardMeta">
                      <span className="Blog-cardDate">
                        <CalendarDays size={16} />
                        {post.date}
                      </span>

                      <span className="Blog-metaDivider" />

                      <span className="Blog-cardComments">
                        <MessageCircle size={16} />
                        {post.comments} Comments
                      </span>
                    </div>

                    <h3
                      className="Blog-cardTitle"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleReadArticle(post)}
                    >
                      {post.title}
                    </h3>

                    <p className="Blog-cardDescription">
                      {post.description}
                    </p>

                    <div className="Blog-cardFooter">
                      <span className="Blog-readTime">
                        {post.readTime}
                      </span>

                      <button
                        className="Blog-readMore"
                        type="button"
                        onClick={() => handleReadArticle(post)}
                        aria-label={`Read article: ${post.title}`}
                      >
                        Read Article
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* View All Blogs Toggle (only when more than 4 articles) */}
        {filteredPosts.length > 4 && (
          <div className="Blog-viewAllWrapper">
            <button
              className="Blog-viewAllButton"
              type="button"
              onClick={() => {
                setShowAll((previous) => !previous);
                setCurrentIndex(0);
              }}
            >
              {showAll ? "Show Featured Blogs" : "View All Blogs"}
              <ArrowRight
                className={showAll ? "Blog-viewAllArrow--reverse" : ""}
                size={21}
              />
            </button>
          </div>
        )}
      </div>

      {/* Heritage-inspired bottom decoration */}
      <div className="Blog-bottomDecoration" aria-hidden="true">
        <span>✳</span>
        <span>◇</span>
        <span>✳</span>
      </div>
    </section>
  );
};

export default Blog;
