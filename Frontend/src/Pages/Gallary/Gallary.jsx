import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowDownWideNarrow,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Maximize2,
  Search,
  X,
} from "lucide-react";

import "./Gallary.css";

import { API_BASE_URL, GALLERY_API_URL as API_URL } from "../../config/api";

const formatImageUrl = (url) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const Gallary = () => {
  const [galleryData, setGalleryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch real gallery items from backend MongoDB API only
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const items = json.data.map((item) => ({
            id: item._id || item.id,
            title: item.title,
            description: item.description || "",
            category: item.category || "General",
            date:
              item.date ||
              (item.createdAt ? item.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]),
            image: formatImageUrl(item.photo || item.image),
          }));
          setGalleryData(items);
        } else {
          setGalleryData([]);
        }
      } catch (err) {
        console.error("Error fetching gallery items from server:", err);
        setGalleryData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const results = galleryData.filter((item) => {
      return (
        (item.title || "").toLowerCase().includes(query) ||
        (item.description || "").toLowerCase().includes(query)
      );
    });

    return [...results].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      if (sortBy === "az") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "za") {
        return (b.title || "").localeCompare(a.title || "");
      }

      return new Date(b.date) - new Date(a.date);
    });
  }, [galleryData, searchTerm, sortBy]);

  const openImage = (image) => {
    const index = filteredImages.findIndex(
      (item) => item.id === image.id
    );

    setCurrentImageIndex(index);
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const showNextImage = () => {
    if (!filteredImages.length) return;

    const nextIndex =
      (currentImageIndex + 1) % filteredImages.length;

    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const showPreviousImage = () => {
    if (!filteredImages.length) return;

    const previousIndex =
      (currentImageIndex - 1 + filteredImages.length) %
      filteredImages.length;

    setCurrentImageIndex(previousIndex);
    setSelectedImage(filteredImages[previousIndex]);
  };

  // Close popup with Escape and navigate with arrow keys.
  useEffect(() => {
    if (!selectedImage) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowRight") showNextImage();
      if (event.key === "ArrowLeft") showPreviousImage();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, currentImageIndex, filteredImages]);

  return (
    <section className="Gallary" id="gallery">
      {/* Background decoration */}
      <div
        className="Gallary-decoration Gallary-decoration--left"
        aria-hidden="true"
      />
      <div
        className="Gallary-decoration Gallary-decoration--right"
        aria-hidden="true"
      />

      <div className="Gallary-container">
        {/* Section Header */}
        <header className="Gallary-header">
          <div className="Gallary-headingIcon" aria-hidden="true">
            <Flower2 size={24} />
          </div>

          <div className="Gallary-eyebrow">
            <span className="Gallary-eyebrowLine" />
            <span>Sacred Heritage & Living Traditions</span>
            <span className="Gallary-eyebrowLine" />
          </div>

          <h1 className="Gallary-title">
            Cultural <span className="Gallary-titleHighlight">Chronicles</span>
          </h1>

          <p className="Gallary-subtitle">
            A visual ode to India's eternal craftsmanship, ancient temples,
            and vibrant celebrations of spirit.
            <br className="Gallary-desktopBreak" />
            Each image is a timeless fragment of sacred memory and artistic devotion.
          </p>
        </header>

        {/* Search & Sort Controls */}
        <div className="Gallary-toolbar">
          <div className="Gallary-toolbarControls">
            <label className="Gallary-search">
              <Search size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search traditions, temples..."
                aria-label="Search gallery images"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="Gallary-clearSearch"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </label>

            <label className="Gallary-sort">
              <ArrowDownWideNarrow size={16} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort images"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">Title A–Z</option>
                <option value="za">Title Z–A</option>
              </select>
            </label>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="Gallary-grid">
            {filteredImages.map((item, index) => (
              <button
                className="Gallary-item"
                key={item.id}
                type="button"
                onClick={() => openImage(item)}
                aria-label={`View ${item.title}`}
                style={{ "--Gallary-index": index }}
              >
                <img
                  className="Gallary-image"
                  src={item.image}
                  alt={item.title}
                  loading={index < 4 ? "eager" : "lazy"}
                />

                <div className="Gallary-imageShade" />

                <div className="Gallary-imageCaption">
                  <div className="Gallary-captionText">
                    <span className="Gallary-imageTitle">
                      {item.title}
                    </span>

                    <span className="Gallary-imageDescription">
                      {item.description}
                    </span>
                  </div>

                  <span className="Gallary-imageOpen">
                    <Maximize2 size={17} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="Gallary-empty">
            <Search size={34} />
            <h2>No artwork found</h2>
            <p>
              Try another search to discover more art and cultural treasures.
            </p>

            <button
              type="button"
              onClick={() => setSearchTerm("")}
            >
              View All Images
            </button>
          </div>
        )}

        {/* Footer decoration */}
        <div className="Gallary-footer">
          <span className="Gallary-footerOrnament">✳</span>
          <p>
            Every artwork holds a story. Every tradition leaves a legacy.
          </p>
          <span className="Gallary-footerOrnament">✳</span>
        </div>
      </div>

      {/* Full-screen popup */}
      {selectedImage && (
        <div
          className="Gallary-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          onClick={closeImage}
        >
          <button
            type="button"
            className="Gallary-lightboxClose"
            onClick={closeImage}
            aria-label="Close image preview"
          >
            <X size={25} />
          </button>

          <button
            type="button"
            className="Gallary-lightboxArrow Gallary-lightboxArrow--left"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={30} />
          </button>

          <div
            className="Gallary-lightboxContent"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="Gallary-lightboxImageArea">
              <img
                className="Gallary-lightboxImage"
                src={selectedImage.image}
                alt={selectedImage.title}
              />
            </div>

            <div className="Gallary-lightboxInfo">
              <div className="Gallary-lightboxDate">
                <CalendarDays size={15} />

                <span>
                  {new Date(
                    `${selectedImage.date}T12:00:00`
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <h2 className="Gallary-lightboxTitle">
                {selectedImage.title}
              </h2>

              <p className="Gallary-lightboxDescription">
                {selectedImage.description}
              </p>

              <span className="Gallary-lightboxCount">
                {currentImageIndex + 1} / {filteredImages.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="Gallary-lightboxArrow Gallary-lightboxArrow--right"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallary;
