import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { formatImageUrl } from "../../config/api";
import "./BlogDetailsTwo.css";

const BlogDetailsTwo = ({ blog }) => {
  const defaultCharacteristics = [
    "The Art of Storytelling: How Artists Convey Narratives Through Their Work",
    "Exploring the World of Contemporary Art: Trends and Insights How Art Reflects Society",
    "Masterpieces Under the Hammer: A Guide to Upcoming Art Auctions",
    "The Role of Art in Mental Well-Being: Creativity as Therapy How Artists Convey Narratives Through Their Work",
  ];

  const characteristics =
    blog?.characteristics && blog.characteristics.length > 0
      ? blog.characteristics
      : defaultCharacteristics;

  const interiorArtwork =
    formatImageUrl(blog?.bodyImages?.[0]) ||
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85";

  const artistArtwork =
    formatImageUrl(blog?.bodyImages?.[1]) ||
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1100&q=85";

  const renderCharacteristics = (listClass, items) => (
    <ul className={`BlogDetailsTwo-characteristics-list ${listClass}`}>
      {items.map((item, index) => (
        <li className="BlogDetailsTwo-characteristic-item" key={index}>
          <FaRegCheckCircle
            className="BlogDetailsTwo-check-icon"
            aria-hidden="true"
          />
          <span className="BlogDetailsTwo-characteristic-text">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );

  const half = Math.ceil(characteristics.length / 2);
  const firstHalfChars = characteristics.slice(0, half);
  const secondHalfChars = characteristics.slice(half);

  return (
    <section className="BlogDetailsTwo">
      <div className="BlogDetailsTwo-container">
        {/* Article title */}
        <header className="BlogDetailsTwo-header">
          <h1 className="BlogDetailsTwo-title">
            {blog?.title || "How To Achieve Financial Freedom By 30"}
          </h1>
        </header>

        {/* Content / description */}
        <div className="BlogDetailsTwo-introduction">
          {blog?.description ? (
            <div
              className="BlogDetailsTwo-html"
              style={{ lineHeight: 1.8, fontSize: "1.05rem", color: "#444" }}
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          ) : (
            <>
              <p className="BlogDetailsTwo-paragraph">
                Art reflects and influences modern culture by acting as a mirror
                and a catalyst for societal change. It captures the spirit of the
                times, expressing contemporary issues like identity, politics, and
                social justice. Artists use their work to comment on and challenge
                cultural norms, often sparking discussions and inspiring new
                perspectives. In turn, culture shapes art by providing context and
                meaning. This dynamic relationship between art and culture fosters
                a continuous dialogue that drives evolution in both realms.
              </p>

              <p className="BlogDetailsTwo-paragraph">
                Capturing the essence of societal values, trends, and challenges.
                Through various mediums, artists explore issues like identity,
                technology, and politics, offering commentary and provoking
                thought. Contemporary art often mirrors the complexities of modern
                life, from social justice movements to environmental concerns. By
                engaging with current events and cultural shifts, art serves as a
                visual narrative of our collective experiences and evolving
                worldviews.
              </p>
            </>
          )}
        </div>

        {/* Alternating two-column feature grid */}
        {(interiorArtwork || artistArtwork || characteristics.length > 0) && (
          <div className="BlogDetailsTwo-feature-grid">
            {/* Top-left: Interior artwork */}
            <div className="BlogDetailsTwo-feature-cell BlogDetailsTwo-feature-cell--interior">
              <div className="BlogDetailsTwo-image-wrapper">
                <img
                  src={interiorArtwork}
                  alt={blog?.title || "Artwork presentation"}
                  className="BlogDetailsTwo-interior-image"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Top-right: Heading and characteristics */}
            <div className="BlogDetailsTwo-feature-cell BlogDetailsTwo-feature-cell--top-list">
              <div className="BlogDetailsTwo-characteristics">
                <h2 className="BlogDetailsTwo-characteristics-title">
                  Key Characteristics :
                </h2>
                {renderCharacteristics("BlogDetailsTwo-characteristics-list--top", firstHalfChars.length ? firstHalfChars : characteristics)}
              </div>
            </div>

            {/* Bottom-left: Second checklist */}
            <div className="BlogDetailsTwo-feature-cell BlogDetailsTwo-feature-cell--bottom-list">
              <div className="BlogDetailsTwo-characteristics">
                {renderCharacteristics(
                  "BlogDetailsTwo-characteristics-list--bottom",
                  secondHalfChars.length ? secondHalfChars : characteristics
                )}
              </div>
            </div>

            {/* Bottom-right: Artist artwork */}
            <div className="BlogDetailsTwo-feature-cell BlogDetailsTwo-feature-cell--artist">
              <div className="BlogDetailsTwo-secondary-image-wrapper">
                <img
                  src={artistArtwork}
                  alt={blog?.title || "Creative artwork"}
                  className="BlogDetailsTwo-secondary-image"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="BlogDetailsTwo-divider" />

        {/* Closing paragraph */}
        <div className="BlogDetailsTwo-conclusion">
          <p className="BlogDetailsTwo-paragraph">
            As we reflect on this moment, we express our deepest gratitude to
            our clients, partners, and everyone who has been a part of this
            incredible journey. Your trust and collaboration have been
            instrumental in our success, and we look forward to continuing to
            create meaningful experiences through authentic art and cultural heritage.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsTwo;
