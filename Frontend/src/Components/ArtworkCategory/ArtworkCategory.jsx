
import React from "react";
import { Link } from "react-router-dom";
import "./ArtworkCategory.css";

const categories = [
  {
    id: 1,
    title: "Abstract Art",
    className: "abstract",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=90",
    path: "/shop?category=abstract-art",
  },
  {
    id: 2,
    title: "Painting",
    className: "painting",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=90",
    path: "/shop?category=painting",
  },
  {
    id: 3,
    title: "Artwork",
    className: "artwork",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=90",
    path: "/shop?category=artwork",
  },
  {
    id: 4,
    title: "Modern Art",
    className: "modern",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=90",
    path: "/shop?category=modern-art",
  },
  {
    id: 5,
    title: "Poetry",
    className: "poetry",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=90",
    path: "/shop?category=poetry",
  },
  {
    id: 6,
    title: "Sculpture",
    className: "sculpture",
    image:
      "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=800&q=90",
    path: "/shop?category=sculpture",
  },
  {
    id: 7,
    title: "Natura",
    className: "natura",
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=90",
    path: "/shop?category=natura",
  },
  {
    id: 8,
    title: "Street Art",
    className: "street",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=90",
    path: "/shop?category=street-art",
  },
];

const ArtworkCategory = () => {
  return (
    <section
      className="ArtworkCategory"
      aria-labelledby="ArtworkCategory-title"
    >
      <div className="ArtworkCategory-container">
        {/* Header */}
        <div className="ArtworkCategory-header">
          <div className="ArtworkCategory-heading">
            <h2
              className="ArtworkCategory-title"
              id="ArtworkCategory-title"
            >
              Artwork Category
            </h2>
          </div>

          <div className="ArtworkCategory-header-right">
            <p className="ArtworkCategory-subtitle">
              Join us for an exhilarating live auction experience
              where art meets excitement.
            </p>

            <Link
              to="/shop"
              className="ArtworkCategory-view-all"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="ArtworkCategory-grid">
          {categories.map((category) => (
            <Link
              to={category.path}
              className={`ArtworkCategory-card ArtworkCategory-card--${category.className}`}
              key={category.id}
              aria-label={`Explore ${category.title}`}
            >
              <img
                src={category.image}
                alt={category.title}
                className="ArtworkCategory-image"
                loading={category.id <= 4 ? "eager" : "lazy"}
              />

              <div className="ArtworkCategory-overlay" />

              <h3 className="ArtworkCategory-card-title">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtworkCategory;
