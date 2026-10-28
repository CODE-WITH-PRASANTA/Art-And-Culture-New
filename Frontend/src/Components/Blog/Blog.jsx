
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
} from "lucide-react";

import "./Blog.css";

const Blog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [liveBlogs, setLiveBlogs] = useState([]);

  useEffect(() => {
    fetch(`${BLOGS_API_URL}?status=Published`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.blogs)) {
          setLiveBlogs(data.blogs);
        }
      })
      .catch((err) => console.error("Error fetching published blogs:", err));
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const categories = [
    { name: "All Posts", icon: null },
    { name: "Painting", icon: Palette },
    { name: "Heritage", icon: Landmark },
    { name: "Traditions", icon: Leaf },
    { name: "Artists", icon: UserRound },
    { name: "Museum", icon: BookOpen },
    { name: "Tips & Guides", icon: Lightbulb },
  ];

  const blogPosts = [
    {
      id: 1,
      category: "Painting",
      date: "30 December, 2024",
      comments: 0,
      title: "Effective Ways to Save Money While Shopping",
      description:
        "Discover smart tips to shop for authentic art pieces without overspending. Learn how to find quality, value and timeless beauty.",
      image:
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
      tagColor: "orange",
      readTime: "5 min read",
    },
    {
      id: 2,
      category: "Artists",
      date: "30 December, 2024",
      comments: 0,
      title: "Top Marketing Trends to Watch This Year",
      description:
        "Explore the latest trends shaping the art and culture world, from digital exhibitions to emerging artists making waves.",
      image:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
      tagColor: "green",
      readTime: "7 min read",
    },
    {
      id: 3,
      category: "Tips & Guides",
      date: "30 December, 2024",
      comments: 0,
      title: "Transform Your Backyard into a Relaxing Oasis",
      description:
        "Create a serene and inspiring space with artistic elements, sculptures and cultural décor ideas that blend nature and creativity.",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      tagColor: "orange",
      readTime: "6 min read",
    },
    {
      id: 4,
      category: "Heritage",
      date: "25 December, 2024",
      comments: 2,
      title: "Discover the Beauty of Contemporary Art",
      description:
        "Dive into the vibrant world of modern art, where tradition meets innovation. Explore styles, artists and the stories behind them.",
      image:
        "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=85",
      tagColor: "blue",
      readTime: "8 min read",
    },
    {
      id: 5,
      category: "Traditions",
      date: "22 December, 2024",
      comments: 4,
      title: "The Living Traditions Behind Indian Art",
      description:
        "Discover the stories, rituals and traditional craftsmanship that continue to inspire generations of artists and makers.",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
      tagColor: "green",
      readTime: "6 min read",
    },
    {
      id: 6,
      category: "Museum",
      date: "18 December, 2024",
      comments: 1,
      title: "A Journey Through the World's Art Museums",
      description:
        "Step inside remarkable collections and discover the masterpieces, historic objects and cultural treasures they preserve.",
      image:
        "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=85",
      tagColor: "blue",
      readTime: "9 min read",
    },
    {
      id: 7,
      category: "Painting",
      date: "15 December, 2024",
      comments: 3,
      title: "The Timeless Beauty of Handcrafted Paintings",
      description:
        "Learn how brushstrokes, pigments and the artist's imagination turn a simple canvas into a meaningful work of art.",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
      tagColor: "orange",
      readTime: "5 min read",
    },
    {
      id: 8,
      category: "Heritage",
      date: "10 December, 2024",
      comments: 2,
      title: "Architectural Wonders That Tell Our Story",
      description:
        "Explore the intricate details, ancient techniques and cultural significance of remarkable architectural landmarks.",
      image:
        "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=85",
      tagColor: "blue",
      readTime: "7 min read",
    },
  ];

  const tagColors = ["orange", "green", "blue"];

  const dynamicPosts = useMemo(() => {
    if (liveBlogs && liveBlogs.length > 0) {
      return liveBlogs.map((b, idx) => ({
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
        description:
          b.excerpt ||
          (b.description
            ? b.description.replace(/<[^>]+>/g, " ").slice(0, 150)
            : ""),
        image: formatImageUrl(b.mainImage || b.image),
        tagColor: tagColors[idx % tagColors.length],
        readTime: b.readTime || "5 min read",
      }));
    }
    return blogPosts;
  }, [liveBlogs]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All Posts") return dynamicPosts;

    return dynamicPosts.filter(
      (post) => post.category === activeCategory
    );
  }, [activeCategory, dynamicPosts]);

  const visiblePosts = useMemo(() => {
    if (showAll) return filteredPosts;

    if (filteredPosts.length <= 4) return filteredPosts;

    return Array.from({ length: 4 }, (_, index) => {
      return filteredPosts[
        (currentIndex + index) % filteredPosts.length
      ];
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
    setCurrentIndex((previous) =>
      (previous + 1) % filteredPosts.length
    );
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

        {/* Category Filters */}
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
                    size={22}
                    strokeWidth={1.7}
                  />
                )}
                <span>{category.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Article Carousel */}
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

          <div
            className={`Blog-grid ${
              showAll ? "Blog-grid--expanded" : ""
            }`}
          >
            {visiblePosts.map((post) => (
              <article className="Blog-card" key={post.id}>
                <div className="Blog-cardImageWrapper" style={{ cursor: "pointer" }} onClick={() => handleReadArticle(post)}>
                  <img
                    className="Blog-cardImage"
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
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

                  <h3 className="Blog-cardTitle" style={{ cursor: "pointer" }} onClick={() => handleReadArticle(post)}>
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

          {filteredPosts.length === 0 && (
            <div className="Blog-empty">
              <Palette size={36} />
              <h3>No articles found</h3>
              <p>Explore another category for more art and culture stories.</p>
            </div>
          )}
        </div>

        {/* View All Blogs */}
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
