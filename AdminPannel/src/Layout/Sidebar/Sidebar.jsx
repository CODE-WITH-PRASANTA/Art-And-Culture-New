import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiImage,
  FiBookOpen,
  FiShoppingBag,
  FiTag,
  FiUsers,
  FiClipboard,
  FiMessageSquare,
  FiChevronDown,
  FiFeather,
  FiPlusSquare,
  FiList,
  FiFileText,
  FiX,
} from "react-icons/fi";

import "./Sidebar.css";

const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: FiGrid,
  },
  {
    text: "Art Management",
    icon: FiFeather,
    children: [
      {
        text: "Art Posting",
        path: "/art-management/art-posting",
        icon: FiPlusSquare,
      },
      {
        text: "Manage Art",
        path: "/art-management/manage-art",
        icon: FiImage,
      },
      {
        text: "Category Manage",
        path: "/art-management/category-manage",
        icon: FiList,
      },
    ],
  },
  {
    text: "Blog",
    icon: FiBookOpen,
    children: [
      {
        text: "Blog Posting",
        path: "/blog/blog-posting",
        icon: FiFileText,
      },
      {
        text: "Blog Management",
        path: "/blog/blog-management",
        icon: FiList,
      },
    ],
  },
  {
    text: "Gallery",
    path: "/gallery",
    icon: FiImage,
  },
  {
    text: "Order",
    path: "/orders",
    icon: FiShoppingBag,
  },
  {
    text: "Coupon",
    path: "/coupons",
    icon: FiTag,
  },
  {
    text: "User",
    path: "/users",
    icon: FiUsers,
  },
  {
    text: "Enquiry Management",
    path: "/enquiry-management",
    icon: FiClipboard,
  },
  {
    text: "Review Management",
    path: "/review-management",
    icon: FiMessageSquare,
  },
];

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onClose,
}) => {
  const location = useLocation();

  const [openDropdowns, setOpenDropdowns] = useState({
    "Art Management": true,
    Blog: true,
  });

  const handleNavClick = () => {
    if (isMobileOpen && onClose) {
      onClose();
    }
  };

  const toggleDropdown = (title) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isChildActive = (children) =>
    children?.some((child) => location.pathname === child.path);

  return (
    <aside
      className={`rp-sidebar ${
        isCollapsed ? "rp-sidebar--collapsed" : ""
      } ${isMobileOpen ? "rp-sidebar--mobile-open" : ""}`}
      aria-label="Admin sidebar navigation"
    >
      {/* Brand */}
      <div className="rp-brand">
        <div className="rp-brand__logo">
          <FiFeather size={26} strokeWidth={1.6} />
        </div>

        {(!isCollapsed || isMobileOpen) && (
          <div className="rp-brand__content">
            <h2>Art Admin</h2>
            <span className="rp-brand__subtitle">
              MANAGEMENT PANEL
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

      {/* Navigation */}
      <nav className="rp-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);
          const expanded = Boolean(openDropdowns[item.text]);
          const childActive = isChildActive(item.children);

          if (hasChildren) {
            return (
              <div
                className={`rp-nav__group ${
                  childActive ? "rp-nav__group--active" : ""
                }`}
                key={item.text}
              >
                <button
                  type="button"
                  className={`rp-nav__link rp-nav__dropdown ${
                    childActive ? "rp-nav__link--active" : ""
                  }`}
                  onClick={() => {
                    if (isCollapsed && !isMobileOpen) {
                      toggleDropdown(item.text);
                    } else {
                      toggleDropdown(item.text);
                    }
                  }}
                  title={
                    isCollapsed && !isMobileOpen
                      ? item.text
                      : undefined
                  }
                  aria-expanded={expanded}
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
                      </span>

                      <FiChevronDown
                        className={`rp-nav__chevron ${
                          expanded ? "rp-nav__chevron--open" : ""
                        }`}
                        size={17}
                      />
                    </>
                  )}
                </button>

                {expanded && (!isCollapsed || isMobileOpen) && (
                  <div className="rp-subnav">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={handleNavClick}
                          className={({ isActive }) =>
                            `rp-subnav__link ${
                              isActive
                                ? "rp-subnav__link--active"
                                : ""
                            }`
                          }
                        >
                          <span className="rp-subnav__icon">
                            <ChildIcon
                              size={16}
                              strokeWidth={1.8}
                            />
                          </span>

                          <span className="rp-subnav__title">
                            {child.text}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
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
                <span className="rp-nav__details">
                  <span className="rp-nav__title">
                    {item.text}
                  </span>
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;