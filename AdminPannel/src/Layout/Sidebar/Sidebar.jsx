
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiFeather,
  FiLayers,
  FiUsers,
  FiClipboard,
  FiX,
  FiArrowUpRight,
  FiMessageSquare,
  FiBookOpen,
  FiHeart,
} from "react-icons/fi";

import "./Sidebar.css";

const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: FiGrid,
    description: "Your creative overview",
  },
  {
    text: "Shop",
    path: "/shop",
    icon: FiShoppingBag,
    description: "Artisan products",
  },
  {
    text: "Crafts",
    path: "/crafts",
    icon: FiFeather,
    description: "Traditional crafts",
  },
  {
    text: "Categories",
    path: "/categories",
    icon: FiLayers,
    description: "Explore collections",
  },
  {
    text: "Cold Lead",
    path: "/cold-lead",
    icon: FiUsers,
    description: "Potential customers",
  },
  {
    text: "Enquiry",
    path: "/enquiries",
    icon: FiClipboard,
    description: "Customer enquiries",
  },
  {
    text: "Testimonial",
    path: "/testimonial",
    icon: FiMessageSquare,
    description: "Customer experiences",
  },
];

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onClose,
}) => {
  const handleNavClick = () => {
    if (isMobileOpen && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`rp-sidebar ${
        isCollapsed ? "rp-sidebar--collapsed" : ""
      } ${isMobileOpen ? "rp-sidebar--mobile-open" : ""}`}
      aria-label="Art and culture navigation"
    >
      {/* Brand */}
      <div className="rp-brand">
        <div className="rp-brand__logo">
          <FiFeather size={26} strokeWidth={1.6} />
          <span className="rp-brand__sparkle">✦</span>
        </div>

        {(!isCollapsed || isMobileOpen) && (
          <div className="rp-brand__content">
            <h2>Art & Culture</h2>
            <span className="rp-brand__subtitle">
              HERITAGE • CRAFT • ART
            </span>
          </div>
        )}

        {isMobileOpen && (
          <button
            className="rp-close"
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FiX size={21} />
          </button>
        )}
      </div>

      {/* Culture identity card — no images */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="rp-business-card">
          <div className="rp-business-card__image">
            <FiBookOpen size={23} strokeWidth={1.5} />
          </div>

          <div className="rp-business-card__text">
            <span className="rp-eyebrow">OUR HERITAGE</span>
            <h3>Living Traditions</h3>
            <p>Celebrating India's creative roots.</p>
          </div>

          <span className="rp-business-card__status" />
        </div>
      )}

      {/* Navigation section */}
      <div className="rp-section-heading">
        {(!isCollapsed || isMobileOpen) && (
          <>
            <span>COLLECTIONS & MANAGEMENT</span>
            <span className="rp-section-line" />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="rp-nav">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.text}
              to={item.path}
              onClick={handleNavClick}
              title={
                isCollapsed && !isMobileOpen
                  ? item.text
                  : undefined
              }
              className={({ isActive }) =>
                `rp-nav__link ${
                  isActive ? "rp-nav__link--active" : ""
                }`
              }
            >
              <span className="rp-nav__icon">
                <Icon size={20} strokeWidth={1.8} />
              </span>

              {(!isCollapsed || isMobileOpen) && (
                <>
                  <span className="rp-nav__details">
                    <span className="rp-nav__title">
                      {item.text}
                    </span>
                    <span className="rp-nav__description">
                      {item.description}
                    </span>
                  </span>

                  <span className="rp-nav__arrow">
                    {index === 0 ? (
                      <FiArrowUpRight size={16} />
                    ) : (
                      <span className="rp-nav__dot" />
                    )}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Heritage note — text and icon only */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="rp-inspiration">
          <div className="rp-inspiration__pattern" />

          <div className="rp-inspiration__icon">
            <FiHeart size={20} />
          </div>

          <div className="rp-inspiration__content">
            <span className="rp-inspiration__label">
              ROOTED IN TRADITION
            </span>
            <h3>Art That Lives On.</h3>
            <p>Every craft carries a story.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      {(!isCollapsed || isMobileOpen) && (
        <div className="rp-footer">
          <span className="rp-footer__symbol">✦</span>
          <span>Preserving culture, inspiring tomorrow</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
