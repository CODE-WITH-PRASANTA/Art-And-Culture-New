
import React, { useMemo, useState, useEffect } from "react";
import {
  ArrowDownWideNarrow,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Image as ImageIcon,
  Maximize2,
  Search,
  X,
} from "lucide-react";

import "./Gallary.css";

const galleryImages = [
  {
    id: 1,
    title: "The Living Canvas",
    description: "Traditional Indian painting and artistic expression",
    date: "2026-10-20",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 2,
    title: "The Art of Stillness",
    description: "Sculptures inspired by timeless traditions",
    date: "2026-10-18",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 3,
    title: "Temples of Eternity",
    description: "Ancient architecture and sacred monuments",
    date: "2026-10-15",
    image:
      "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 4,
    title: "Colors of Tradition",
    description: "The beauty of traditional Indian craftsmanship",
    date: "2026-10-12",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 5,
    title: "Celebration of Culture",
    description: "Festivals, dance and the spirit of community",
    date: "2026-10-10",
    image:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 6,
    title: "Treasures of the Artisan",
    description: "Handcrafted objects shaped by skilled hands",
    date: "2026-10-08",
    image:
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 7,
    title: "A Legacy in Stone",
    description: "Architectural wonders and historic landmarks",
    date: "2026-10-05",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 8,
    title: "Crafted with Love",
    description: "Traditional decorative art and intricate details",
    date: "2026-10-02",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 9,
    title: "Rhythm of the Soul",
    description: "The grace and expression of performing arts",
    date: "2026-09-28",
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 10,
    title: "Stories Carved in Stone",
    description: "Intricate carvings and cultural heritage",
    date: "2026-09-24",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 11,
    title: "Threads of Heritage",
    description: "Traditional textiles and the art of weaving",
    date: "2026-09-20",
    image:
      "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 12,
    title: "Expressions in Bronze",
    description: "Sculptural forms inspired by ancient artistry",
    date: "2026-09-15",
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=90",
  },
];

const Gallary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredImages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const results = galleryImages.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });

    return [...results].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "za") {
        return b.title.localeCompare(a.title);
      }

      return new Date(b.date) - new Date(a.date);
    });
  }, [searchTerm, sortBy]);

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
        {/* Header */}
        <header className="Gallary-header">
          <div className="Gallary-headingIcon">
            <Flower2 size={35} strokeWidth={1.25} />
          </div>

          <div className="Gallary-eyebrow">
            <span className="Gallary-eyebrowLine" />
            <span>Explore Our Collection</span>
            <span className="Gallary-eyebrowLine" />
          </div>

          <h1 className="Gallary-title">
            <span>Art &amp; Culture</span> Gallery
          </h1>

          <p className="Gallary-subtitle">
            A visual journey through timeless art, rich traditions and
            cultural heritage.
            <br className="Gallary-desktopBreak" />
            Discover the stories behind every masterpiece.
          </p>

          <div className="Gallary-headingOrnament">
            <span />
            <i />
            <span />
          </div>
        </header>

        {/* Search and sorting toolbar — no categories */}
        <div className="Gallary-toolbar">
          <div className="Gallary-resultCount" aria-live="polite">
            <ImageIcon size={17} />
            <span>
              Showing {filteredImages.length} of {galleryImages.length} images
            </span>
          </div>

          <div className="Gallary-toolbarControls">
            <label className="Gallary-search">
              <Search size={19} />

              <input
                type="search"
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search gallery images"
              />

              {searchTerm && (
                <button
                  type="button"
                  className="Gallary-clearSearch"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className="Gallary-sort">
              <ArrowDownWideNarrow size={17} />

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort gallery images"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="az">Name: A–Z</option>
                <option value="za">Name: Z–A</option>
              </select>
            </label>
          </div>
        </div>

        {/* Gallery grid */}
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
