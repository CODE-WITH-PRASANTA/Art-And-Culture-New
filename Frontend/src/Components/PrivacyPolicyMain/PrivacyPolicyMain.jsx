import React, { useState } from "react";
import "./PrivacyPolicyMain.css";

const PrivacyPolicyMain = () => {
  const [activeSection, setActiveSection] = useState(0);

  const policies = [
    {
      title: "Information We Collect",
      icon: "userCheck",
      description:
        "We collect personal information necessary to deliver our cultural products, process orders, and provide an enriching browsing experience on our platform.",
      details: [
        "Personal details such as your name, billing address, shipping address, and phone number.",
        "Account login credentials and order history for artwork and handicraft purchases.",
        "Device diagnostics, IP addresses, and cookie data to improve website security and usability.",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: "fileText",
      description:
        "Your data enables us to process transactions smoothly, coordinate hand-crafted deliveries, and keep you updated on order milestones and cultural exhibitions.",
      details: [
        "Fulfilling and dispatching your orders through verified logistical partners.",
        "Sending crucial order notifications, tracking numbers, and customer service responses.",
        "Enhancing catalog curation and personalizing recommendations based on artistic tastes.",
      ],
    },
    {
      title: "Payment Security",
      icon: "shieldLock",
      description:
        "All transactions are encrypted using enterprise-grade protocols. We never store complete credit/debit card numbers or sensitive banking PINs on our servers.",
      details: [
        "Secure payments processed through certified, PCI-DSS-compliant gateways.",
        "End-to-end encryption for tokenized payment workflows and net banking authentication.",
        "Immediate fraud detection mechanisms to protect against unauthorized account use.",
      ],
    },
    {
      title: "Cookies and Analytics",
      icon: "database",
      description:
        "We use essential and analytics cookies to preserve your cart session, optimize site loading speeds, and understand how patrons navigate our collections.",
      details: [
        "Session cookies that preserve your cart and account preferences while you explore.",
        "Anonymous traffic insights to improve page speeds and user interface responsiveness.",
        "Browser settings allow you to disable non-essential cookies at any time.",
      ],
    },
    {
      title: "Third-Party Sharing",
      icon: "share2",
      description:
        "We do not sell, rent, or trade your personal data. We only share details with trusted logistics, courier, and technical vendors essential to order fulfillment.",
      details: [
        "Logistics and postal partners receive only the address and contact details needed for delivery.",
        "Cloud hosting and database infrastructure adhering to strict data safety standards.",
        "Disclosure only when strictly mandated by applicable judicial laws or government orders.",
      ],
    },
    {
      title: "Data Retention & Storage",
      icon: "server",
      description:
        "We retain personal data only as long as required to fulfill commercial obligations, preserve statutory tax records, and resolve potential disputes.",
      details: [
        "Order and invoice history retained in compliance with local commercial regulations.",
        "Periodic archiving and removal of inactive guest browsing tokens.",
        "Encrypted backup vaults guarding against unforeseen system outages.",
      ],
    },
    {
      title: "Your Rights & Choices",
      icon: "sliders",
      description:
        "You retain complete sovereignty over your information. You can request access, corrections, or complete account deletion whenever you wish.",
      details: [
        "Request an export of the personal records associated with your profile.",
        "Request prompt updates or corrections to outdated postal or contact records.",
        "Opt out of promotional newsletters or request account deletion via customer support.",
      ],
    },
    {
      title: "Policy Updates",
      icon: "bell",
      description:
        "We may occasionally refine this Privacy Policy to reflect evolving privacy regulations or new service features. The updated timestamp will always appear at the top.",
      details: [
        "Revised policies take effect immediately upon publication on this page.",
        "Noteworthy changes may be communicated through banner notices or email dispatches.",
        "Continued use of our services following revisions indicates acceptance of the terms.",
      ],
    },
  ];

  const toggleSection = (index) => {
    setActiveSection((current) => (current === index ? -1 : index));
  };

  const renderIcon = (icon) => {
    const commonProps = {
      className: "PrivacyPolicyMain__iconSvg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.7,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    };

    switch (icon) {
      case "userCheck":
        return (
          <svg {...commonProps}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
        );

      case "fileText":
        return (
          <svg {...commonProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        );

      case "shieldLock":
        return (
          <svg {...commonProps}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <rect x="9" y="11" width="6" height="4" rx="1" />
            <path d="M10 11V9a2 2 0 0 1 4 0v2" />
          </svg>
        );

      case "database":
        return (
          <svg {...commonProps}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );

      case "share2":
        return (
          <svg {...commonProps}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        );

      case "server":
        return (
          <svg {...commonProps}>
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
        );

      case "sliders":
        return (
          <svg {...commonProps}>
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        );

      case "bell":
        return (
          <svg {...commonProps}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <main className="PrivacyPolicyMain">
      {/* Decorative background vectors clipped safely to prevent scrollbars */}
      <div className="PrivacyPolicyMain__decorationWrapper" aria-hidden="true">
        <div className="PrivacyPolicyMain__decoration PrivacyPolicyMain__decoration--left" />
        <div className="PrivacyPolicyMain__decoration PrivacyPolicyMain__decoration--right" />
      </div>

      <div className="PrivacyPolicyMain__container">
        {/* Header section */}
        <header className="PrivacyPolicyMain__header">
          <div className="PrivacyPolicyMain__headerIcon">
            {renderIcon("shieldLock")}
          </div>

          <div className="PrivacyPolicyMain__heading">
            <h1 className="PrivacyPolicyMain__title">Privacy Policy</h1>
            <p className="PrivacyPolicyMain__subtitle">
              Learn how Art &amp; Culture collects, safeguards, and handles your personal information.
            </p>
          </div>

          <div className="PrivacyPolicyMain__updated">
            <span className="PrivacyPolicyMain__updatedLabel">Last Updated: </span>
            <time dateTime="2026-10-26">26 October 2026</time>
            <div className="PrivacyPolicyMain__ornament">
              <span />
              <span className="PrivacyPolicyMain__ornamentDiamond">✥</span>
              <span />
            </div>
          </div>
        </header>

        {/* Policy list accordion */}
        <section
          className="PrivacyPolicyMain__list"
          aria-label="Privacy policy sections"
        >
          {policies.map((policy, index) => {
            const isOpen = activeSection === index;
            const panelId = `PrivacyPolicyMain-panel-${index}`;
            const buttonId = `PrivacyPolicyMain-button-${index}`;

            return (
              <article
                key={policy.title}
                className={`PrivacyPolicyMain__item ${
                  isOpen ? "PrivacyPolicyMain__item--active" : ""
                }`}
                style={{ "--item-index": index }}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="PrivacyPolicyMain__trigger"
                  onClick={() => toggleSection(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="PrivacyPolicyMain__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="PrivacyPolicyMain__itemIcon">
                    {renderIcon(policy.icon)}
                  </span>

                  <span className="PrivacyPolicyMain__text">
                    <span className="PrivacyPolicyMain__itemTitle">
                      {policy.title}
                    </span>
                    <span className="PrivacyPolicyMain__description">
                      {policy.description}
                    </span>
                  </span>

                  <span
                    className={`PrivacyPolicyMain__chevron ${
                      isOpen ? "PrivacyPolicyMain__chevron--open" : ""
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
                  className={`PrivacyPolicyMain__panel ${
                    isOpen ? "PrivacyPolicyMain__panel--open" : ""
                  }`}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? "" : undefined}
                >
                  <div className="PrivacyPolicyMain__panelInner">
                    <p className="PrivacyPolicyMain__detailIntro">
                      Key commitments and guidelines:
                    </p>

                    <ul className="PrivacyPolicyMain__details">
                      {policy.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="PrivacyPolicyMain__detail">
                          <span className="PrivacyPolicyMain__detailBullet">✓</span>
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
        <div className="PrivacyPolicyMain__footerNote">
          <span className="PrivacyPolicyMain__footerNoteIcon">i</span>
          <p>
            Your trust is our priority. For any privacy queries or data deletion requests, contact our privacy desk at support@artandculture.com.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyMain;