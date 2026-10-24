
import React from "react";
import "./CollectionDetailsTwo.css";

const CollectionDetailsTwo = () => {
  const artistDetails = [
    {
      label: "Date of Birth and death",
      description: (
        <>
          Born on July 6, 1907, and
          <br className="CollectionDetailsTwo-desktop-break" /> passed away on July 13, 1954
        </>
      ),
    },
    {
      label: "Nationality",
      description: "Mexican",
    },
    {
      label: "Style",
      description:
        "She is known for her surrealist and symbolic style.",
    },
    {
      label: "Notable work",
      description:
        "“The Two Fridas” (1939), “Self-Portrait with Thorn Necklace and Hummingbird” (1940), and “The Broken Column” (1944).",
    },
  ];

  const artworkDetails = [
    {
      label: "Category",
      description: "Contemporary Art",
    },
    {
      label: "Size",
      description: "60 × 90 cm (Height × Width as displayed)",
    },
    {
      label: "Framing",
      description: "Not framed",
    },
  ];

  const artworkSpecifications = [
    {
      label: "Theme",
      description: "Nature, flowers and expressive art",
    },
    {
      label: "Medium",
      description: "Premium canvas print",
    },
    {
      label: "Authenticity",
      description:
        "Artwork details and authenticity documentation depend on the selected item.",
    },
  ];

  const guidelines = [
    "Frame the artwork appropriately to complement your interior.",
    "Keep the painting away from direct sunlight.",
    "Dust the surface gently with a soft, dry brush or cloth.",
  ];

  return (
    <section className="CollectionDetailsTwo">
      <div className="CollectionDetailsTwo-container">
        {/* ================= ARTIST OVERVIEW ================= */}
        <article className="CollectionDetailsTwo-card CollectionDetailsTwo-artist">
          <h2 className="CollectionDetailsTwo-heading">
            Artist Overview
          </h2>

          <div className="CollectionDetailsTwo-artist-content">
            {artistDetails.map((item) => (
              <div
                className="CollectionDetailsTwo-detail"
                key={item.label}
              >
                <h3 className="CollectionDetailsTwo-label">
                  {item.label}
                </h3>

                <p className="CollectionDetailsTwo-description">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* ================= ARTWORK INFORMATION ================= */}
        <article className="CollectionDetailsTwo-card CollectionDetailsTwo-artwork">
          <h2 className="CollectionDetailsTwo-heading">
            Exploring the Artwork
          </h2>

          <div className="CollectionDetailsTwo-artwork-primary">
            {artworkDetails.map((item) => (
              <div
                className="CollectionDetailsTwo-detail"
                key={item.label}
              >
                <h3 className="CollectionDetailsTwo-label">
                  {item.label} :
                </h3>

                <p className="CollectionDetailsTwo-description">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="CollectionDetailsTwo-divider" />

          <div className="CollectionDetailsTwo-artwork-secondary">
            {artworkSpecifications.map((item) => (
              <div
                className="CollectionDetailsTwo-detail"
                key={item.label}
              >
                <h3 className="CollectionDetailsTwo-label">
                  {item.label} :
                </h3>

                <p className="CollectionDetailsTwo-description">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* ================= NARRATIVE AND GUIDELINES ================= */}
        <article className="CollectionDetailsTwo-card CollectionDetailsTwo-guidelines">
          <h2 className="CollectionDetailsTwo-heading">
            Art Inner narrative &amp; guidelines
          </h2>

          <div className="CollectionDetailsTwo-narrative">
            <h3 className="CollectionDetailsTwo-label">
              Inner Narrative Of This Artwork
            </h3>

            <p className="CollectionDetailsTwo-description">
              This artwork explores personal expression, emotion,
              and the relationship between nature and creativity.
              Its colors, forms, and artistic details bring depth
              and character to the space while inviting viewers
              to discover their own interpretation.
            </p>
          </div>

          <div className="CollectionDetailsTwo-divider" />

          <div className="CollectionDetailsTwo-care">
            <h3 className="CollectionDetailsTwo-label">
              Guidelines for The Artwork :
            </h3>

            <ul className="CollectionDetailsTwo-list">
              {guidelines.map((guideline, index) => (
                <li
                  className="CollectionDetailsTwo-list-item"
                  key={index}
                >
                  {guideline}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CollectionDetailsTwo;
