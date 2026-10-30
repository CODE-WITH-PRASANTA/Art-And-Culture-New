import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { formatImageUrl } from "../../config/api";
import "./BlogDetailsOne.css";

const BlogDetailsOne = ({ blog }) => {
  const articleTitle = blog?.title || "How to Achieve Financial Freedom by 30";
  const authorName = blog?.authorName || "Shafiqul";

  const formattedDate = blog?.publishDate
    ? new Date(blog.publishDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase()
    : "30 DEC, 2024";

  const featuredImage =
    formatImageUrl(blog?.mainImage) ||
    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1800&q=90";

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const shareLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(articleTitle)}`,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      url: "https://www.instagram.com/",
    },
  ];

  return (
    <section className="BlogDetailsOne">
      <div className="BlogDetailsOne-container">
        {/* Breadcrumb */}
        <nav
          className="BlogDetailsOne-breadcrumb"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="BlogDetailsOne-breadcrumb-home"
            aria-label="Home"
          >
            <FaHome />
          </Link>

          <span className="BlogDetailsOne-breadcrumb-separator">/</span>

          <Link
            to="/blog"
            className="BlogDetailsOne-breadcrumb-link"
          >
            Blog
          </Link>

          <span className="BlogDetailsOne-breadcrumb-separator">/</span>

          <span
            className="BlogDetailsOne-breadcrumb-current"
            aria-current="page"
          >
            {articleTitle}
          </span>
        </nav>

        {/* Article Information */}
        <div className="BlogDetailsOne-information">
          <div className="BlogDetailsOne-author">
            <div className="BlogDetailsOne-author-avatar">
              <svg
                viewBox="0 0 100 100"
                role="img"
                aria-label="Author profile"
              >
                <circle cx="50" cy="50" r="50" fill="#c8c8c8" />
                <circle cx="50" cy="37" r="20" fill="#ffffff" />
                <path
                  d="M10 100 C12 73 28 61 50 61 C72 61 88 73 90 100 Z"
                  fill="#ffffff"
                />
              </svg>
            </div>

            <div className="BlogDetailsOne-author-details">
              <span className="BlogDetailsOne-label">Author</span>
              <h3 className="BlogDetailsOne-author-name">{authorName}</h3>
            </div>
          </div>

          <div className="BlogDetailsOne-published">
            <span className="BlogDetailsOne-label">Published Date</span>
            <time
              className="BlogDetailsOne-published-date"
              dateTime={blog?.publishDate || "2024-12-30"}
            >
              {formattedDate}
            </time>
          </div>

          <div className="BlogDetailsOne-share">
            <span className="BlogDetailsOne-share-label">Share:</span>

            <div className="BlogDetailsOne-share-icons">
              {shareLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className="BlogDetailsOne-share-button"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${item.name}`}
                  title={item.name}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Article Image */}
        <div className="BlogDetailsOne-featured">
          <img
            className="BlogDetailsOne-featured-image"
            src={featuredImage}
            alt={articleTitle}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsOne;
