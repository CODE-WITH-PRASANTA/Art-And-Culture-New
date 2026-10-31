import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { GALLERY_API_URL, formatImageUrl } from "../../config/api";
import "./ArtworkCategory.css";

const ArtworkCategory = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch(GALLERY_API_URL);
        const data = await res.json();

        if (isMounted && data.success && Array.isArray(data.data)) {
          // Map real database items only - no dummy or fallback items
          const realItems = data.data
            .map((item) => {
              const rawImg = item.photo || item.image;
              const imgUrl = rawImg ? formatImageUrl(rawImg) : "";
              return {
                id: item._id || item.id,
                title: item.title ? item.title.trim() : "Artwork",
                image: imgUrl,
              };
            })
            .filter((item) => Boolean(item.image))
            // Limit to max 8 items so it only fills a maximum of two rows (4 per row)
            .slice(0, 8);

          setGalleryItems(realItems);
        } else if (isMounted) {
          setGalleryItems([]);
        }
      } catch (err) {
        console.error("Failed to load real gallery items:", err);
        if (isMounted) setGalleryItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  // If there are no real items in database yet, don't show empty block
  if (!loading && galleryItems.length === 0) {
    return null;
  }

  return (
    <section className="ArtworkCategory" aria-labelledby="ArtworkCategory-title">
      <div className="ArtworkCategory-container">
        {/* Section Header */}
        <div className="ArtworkCategory-header">
          <div className="ArtworkCategory-heading">
            <h2 className="ArtworkCategory-title" id="ArtworkCategory-title">
              Artwork Category
            </h2>
            <p className="ArtworkCategory-subtitle">
              Join us for an exhilarating live auction experience where art meets excitement.
            </p>
          </div>

          <div className="ArtworkCategory-header-right">
            <Link to="/gallary" className="ArtworkCategory-view-all">
              <span>View All</span>
              <FiArrowRight size={17} className="ArtworkCategory-view-all-arrow" />
            </Link>
          </div>
        </div>

        {/* Gallery Cards - Two rows maximum */}
        <div className="ArtworkCategory-grid">
          {galleryItems.map((item, index) => (
            <Link
              to="/gallary"
              className="ArtworkCategory-card"
              key={item.id || index}
              aria-label={`View ${item.title}`}
            >
              <div className="ArtworkCategory-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="ArtworkCategory-image"
                  loading={index < 4 ? "eager" : "lazy"}
                />

                <div className="ArtworkCategory-overlay" />

                <div className="ArtworkCategory-card-content">
                  <h3 className="ArtworkCategory-card-title">{item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtworkCategory;
