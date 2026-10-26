import React, { useState } from "react";
import "./TermAndConditionMain.css";

const TermAndConditionMain = () => {
  const [activeSection, setActiveSection] = useState(0);

  const terms = [
    {
      title: "Acceptance of Terms",
      icon: "users",
      description:
        "By accessing and using the Art & Culture website, you agree to be bound by these Terms and Conditions, along with our Privacy Policy. If you do not agree with any part of these terms, please do not use our website.",
      details: [
        "You must read and understand these terms before using our services.",
        "By creating an account or making a purchase, you acknowledge that you accept these conditions.",
        "We may update these terms when necessary to reflect changes to our services or policies.",
      ],
    },
    {
      title: "Use of Our Website",
      icon: "cart",
      description:
        "You agree to use this website only for lawful purposes. You shall not misuse, disrupt, or attempt to gain unauthorized access to our website, products, or services.",
      details: [
        "You must provide accurate information when using our website.",
        "You may not interfere with the website's security or functionality.",
        "Any unlawful or fraudulent use of the platform is prohibited.",
      ],
    },
    {
      title: "Products and Orders",
      icon: "bag",
      description:
        "All artworks, handicrafts, and cultural products listed on our website are subject to availability. We reserve the right to modify product details, prices, or availability at any time.",
      details: [
        "Product images are provided to represent the actual items as accurately as possible.",
        "Handcrafted products may have slight variations in color, texture, and finish.",
        "Orders are subject to availability and confirmation.",
      ],
    },
    {
      title: "Payments",
      icon: "card",
      description:
        "We accept various secure payment methods. All payments must be made in full before the order is processed. We are not responsible for payment issues caused by third-party providers.",
      details: [
        "All applicable prices and charges will be displayed during checkout.",
        "You must ensure that your payment information is accurate.",
        "Order processing may be delayed if payment confirmation is pending.",
      ],
    },
    {
      title: "Shipping and Delivery",
      icon: "truck",
      description:
        "We aim to deliver your orders on time. However, delivery timelines may vary based on your location, product availability, and external factors. We are not liable for delays beyond our control.",
      details: [
        "Delivery estimates may vary depending on your location.",
        "Please provide a complete and accurate shipping address.",
        "Contact our support team if your order is delayed or arrives damaged.",
      ],
    },
    {
      title: "Returns and Refunds",
      icon: "return",
      description:
        "If you are not satisfied with your purchase, you may be eligible for a return or refund as per our Return Policy. Certain items, such as customized or handmade products, may have special return conditions.",
      details: [
        "Return requests must comply with our applicable return policy.",
        "Items may need to be returned in their original condition.",
        "Approved refunds will be processed according to the applicable payment provider's timelines.",
      ],
    },
    {
      title: "Intellectual Property",
      icon: "shield",
      description:
        "All content on this website, including images, text, logos, and designs, is the property of Art & Culture or its respective owners and is protected by applicable intellectual property laws.",
      details: [
        "You may not reproduce or distribute website content without permission.",
        "Product artwork remains subject to the rights of its respective creator or owner.",
        "Unauthorized commercial use of our branding or content is prohibited.",
      ],
    },
    {
      title: "Changes to Terms",
      icon: "document",
      description:
        "We reserve the right to update or modify these Terms and Conditions at any time. Changes will be posted on this page with the updated date. Your continued use of the website constitutes acceptance of the revised terms.",
      details: [
        "Updated terms will be published on this page.",
        "Please review this page periodically for changes.",
        "If you disagree with revised terms, you should discontinue using the affected services.",
      ],
    },
  ];

  const toggleSection = (index) => {
    setActiveSection((current) => (current === index ? -1 : index));
  };

  const renderIcon = (icon) => {
    const commonProps = {
      className: "TermAndConditionMain__iconSvg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.7,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    };

    switch (icon) {
      case "users":
        return (
          <svg {...commonProps}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );

      case "cart":
        return (
          <svg {...commonProps}>
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        );

      case "bag":
        return (
          <svg {...commonProps}>
            <rect x="4" y="7" width="16" height="14" rx="2" />
            <path d="M8 7V5a4 4 0 0 1 8 0v2" />
          </svg>
        );

      case "card":
        return (
          <svg {...commonProps}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 10h20" />
            <path d="M6 15h4" />
          </svg>
        );

      case "truck":
        return (
          <svg {...commonProps}>
            <path d="M10 17h4V5H2v12h3" />
            <path d="M14 9h5l3 4v4h-3" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="16.5" cy="17.5" r="2.5" />
          </svg>
        );

      case "return":
        return (
          <svg {...commonProps}>
            <path d="M3 11a9 9 0 0 1 15.36-6.36L21 7" />
            <path d="M21 2v5h-5" />
            <path d="M21 13a9 9 0 0 1-15.36 6.36L3 17" />
            <path d="M3 22v-5h5" />
          </svg>
        );

      case "shield":
        return (
          <svg {...commonProps}>
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        );

      case "document":
        return (
          <svg {...commonProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
            <path d="M8 9h2" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <main className="TermAndConditionMain">
      {/* Decorative side artwork wrapped to clip overflow safely */}
      <div className="TermAndConditionMain__decorationWrapper" aria-hidden="true">
        <div className="TermAndConditionMain__decoration TermAndConditionMain__decoration--left" />
        <div className="TermAndConditionMain__decoration TermAndConditionMain__decoration--right" />
      </div>

      <div className="TermAndConditionMain__container">
        {/* Header */}
        <header className="TermAndConditionMain__header">
          <div className="TermAndConditionMain__headerIcon">
            {renderIcon("document")}
          </div>

          <div className="TermAndConditionMain__heading">
            <h1 className="TermAndConditionMain__title">Terms and Conditions</h1>
            <p className="TermAndConditionMain__subtitle">
              Please read these terms and conditions carefully before using our website.
            </p>
          </div>

          <div className="TermAndConditionMain__updated">
            <span className="TermAndConditionMain__updatedLabel">Last Updated: </span>
            <time dateTime="2026-10-26">26 October 2026</time>
            <div className="TermAndConditionMain__ornament">
              <span />
              <span className="TermAndConditionMain__ornamentDiamond">✥</span>
              <span />
            </div>
          </div>
        </header>

        {/* Terms accordion */}
        <section
          className="TermAndConditionMain__list"
          aria-label="Terms and conditions sections"
        >
          {terms.map((term, index) => {
            const isOpen = activeSection === index;
            const panelId = `TermAndConditionMain-panel-${index}`;
            const buttonId = `TermAndConditionMain-button-${index}`;

            return (
              <article
                key={term.title}
                className={`TermAndConditionMain__item ${
                  isOpen ? "TermAndConditionMain__item--active" : ""
                }`}
                style={{ "--item-index": index }}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="TermAndConditionMain__trigger"
                  onClick={() => toggleSection(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="TermAndConditionMain__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="TermAndConditionMain__itemIcon">
                    {renderIcon(term.icon)}
                  </span>

                  <span className="TermAndConditionMain__text">
                    <span className="TermAndConditionMain__itemTitle">
                      {term.title}
                    </span>
                    <span className="TermAndConditionMain__description">
                      {term.description}
                    </span>
                  </span>

                  <span
                    className={`TermAndConditionMain__chevron ${
                      isOpen ? "TermAndConditionMain__chevron--open" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </button>

                <div
                  id={panelId}
                  className={`TermAndConditionMain__panel ${
                    isOpen ? "TermAndConditionMain__panel--open" : ""
                  }`}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? "" : undefined}
                >
                  <div className="TermAndConditionMain__panelInner">
                    <p className="TermAndConditionMain__detailIntro">
                      Please keep the following points in mind:
                    </p>

                    <ul className="TermAndConditionMain__details">
                      {term.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="TermAndConditionMain__detail">
                          <span className="TermAndConditionMain__detailBullet">✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Footer note */}
        <div className="TermAndConditionMain__footerNote">
          <span className="TermAndConditionMain__footerNoteIcon">i</span>
          <p>
            By continuing to use Art & Culture, you acknowledge that you have read and
            understood these Terms and Conditions.
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermAndConditionMain;