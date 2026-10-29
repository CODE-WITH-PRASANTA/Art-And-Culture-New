
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  Bell,
  Mail,
  Search,
  UserRound,
  LogOut,
  ShieldCheck,
  Maximize,
  Minimize,
  X,
  Palette,
  ShoppingBag,
  BookOpen,
  Layers,
  Sparkles,
  Feather,
  Settings,
  Check,
} from "lucide-react";

import "./Topbar.css";

const pageDetails = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your cultural overview",
    icon: Palette,
  },
  "/shop": {
    title: "Artisan Shop",
    subtitle: "Discover traditional creations",
    icon: ShoppingBag,
  },
  "/crafts": {
    title: "Traditional Crafts",
    subtitle: "Celebrate handmade artistry",
    icon: Feather,
  },
  "/categories": {
    title: "Art Categories",
    subtitle: "Explore cultural collections",
    icon: Layers,
  },
  "/cold-lead": {
    title: "Potential Customers",
    subtitle: "Manage customer relationships",
    icon: UserRound,
  },
  "/enquiries": {
    title: "Enquiries",
    subtitle: "Customer questions and requests",
    icon: Mail,
  },
  "/testimonial": {
    title: "Testimonials",
    subtitle: "Customer experiences",
    icon: BookOpen,
  },
  "/profile": {
    title: "My Profile",
    subtitle: "Your account information",
    icon: UserRound,
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage your preferences",
    icon: Settings,
  },
};

const initialNotifications = [
  {
    id: 1,
    title: "Welcome to Art & Culture",
    message: "Your cultural marketplace workspace is ready.",
    time: "Workspace update",
    icon: Palette,
    unread: true,
  },
  {
    id: 2,
    title: "Explore artisan creations",
    message: "Discover handmade crafts and traditional collections.",
    time: "Shop reminder",
    icon: ShoppingBag,
    unread: true,
  },
  {
    id: 3,
    title: "Preserve the tradition",
    message: "Every handmade creation carries a unique story.",
    time: "Culture update",
    icon: Sparkles,
    unread: true,
  },
];

const initialMessages = [
  {
    id: 1,
    title: "Customer enquiries",
    message: "Review your latest customer questions and requests.",
    time: "Enquiry inbox",
    icon: Mail,
    unread: true,
  },
  {
    id: 2,
    title: "Customer feedback",
    message: "Check customer feedback and testimonials.",
    time: "Feedback",
    icon: UserRound,
    unread: true,
  },
];

const Topbar = ({ toggleSidebar }) => {
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [notifications, setNotifications] = useState(
    initialNotifications
  );
  const [messages, setMessages] = useState(initialMessages);

  const [currentProfile, setCurrentProfile] = useState({
    name: "Admin User",
    email: "admin@artandculture.com",
    role: "Culture Administrator",
    avatar: "",
  });

  const dropdownRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const currentPage =
    pageDetails[location.pathname] || {
      title: "",
      subtitle: "",
      icon: Palette,
    };

  const PageIcon = currentPage.icon;

  const unreadNotifications = notifications.filter(
    (item) => item.unread
  ).length;

  const unreadMessages = messages.filter(
    (item) => item.unread
  ).length;

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setCurrentProfile((previous) => ({
          ...previous,
          ...event.detail,
        }));
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
        setMobileSearchOpen(false);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "/"
      ) {
        event.preventDefault();
        setMobileSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const closeAllMenus = () => {
    setDropdownOpen(false);
    setNotificationsOpen(false);
    setMailOpen(false);
  };

  const openMenu = (menu) => {
    closeAllMenus();

    if (menu === "profile") setDropdownOpen(true);
    if (menu === "notifications") setNotificationsOpen(true);
    if (menu === "messages") setMailOpen(true);
  };

  const toggleMenu = (menu, isOpen) => {
    if (isOpen) {
      closeAllMenus();
    } else {
      openMenu(menu);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
    }
  };

  const markNotificationsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, unread: false }))
    );
  };

  const markMessagesRead = () => {
    setMessages((previous) =>
      previous.map((item) => ({ ...item, unread: false }))
    );
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (query) {
      window.dispatchEvent(
        new CustomEvent("artCultureSearch", {
          detail: { query },
        })
      );
    }
  };

  const profileInitial = (
    currentProfile.name || "A"
  ).trim().charAt(0).toUpperCase();

  return (
    <>
      <header className="Topbar">
        <div
          className={`Topbar-inner ${
            mobileSearchOpen ? "is-hidden" : ""
          }`}
        >
          {/* LEFT SECTION */}
          <div className="Topbar-left">
            <button
              type="button"
              className="Topbar-toggle-btn"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="Topbar-page-label">

              <div className="Topbar-page-heading">
                <span className="Topbar-page-title">
                  {currentPage.title}
                </span>

                <span className="Topbar-page-subtitle">
                  {currentPage.subtitle}
                </span>
              </div>
            </div>

            {/* DESKTOP SEARCH */}
            <form
              className="Topbar-search-box"
              onSubmit={handleSearchSubmit}
            >
              <Search
                size={17}
                className="Topbar-search-icon"
              />

              <input
                type="search"
                placeholder="Search art, crafts, collections..."
                className="Topbar-search-input"
                aria-label="Search art and culture workspace"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
              />

              <kbd className="Topbar-search-shortcut">Ctrl /</kbd>
            </form>
          </div>

          {/* RIGHT SECTION */}
          <div className="Topbar-right" ref={dropdownRef}>
            {/* MOBILE SEARCH */}
            <button
              type="button"
              className="Topbar-action-btn Topbar-mobile-search-btn"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={18} />
            </button>

            {/* NOTIFICATIONS */}
            <div className="Topbar-action-wrapper">
              <button
                type="button"
                className={`Topbar-action-btn ${
                  notificationsOpen ? "active" : ""
                }`}
                onClick={() =>
                  toggleMenu("notifications", notificationsOpen)
                }
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} />

                {unreadNotifications > 0 && (
                  <span className="Topbar-badge">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="Topbar-dropdown Topbar-notifications-dropdown">
                  <div className="Topbar-dropdown-header">
                    <div>
                      <span className="Topbar-dropdown-title">
                        Notifications
                      </span>
                      <span className="Topbar-dropdown-subtitle">
                        Updates from your workspace
                      </span>
                    </div>

                    <button
                      type="button"
                      className="Topbar-mark-read"
                      onClick={markNotificationsRead}
                    >
                      <Check size={13} />
                      Read all
                    </button>
                  </div>

                  <div className="Topbar-notification-list">
                    {notifications.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <div
                          className={`Topbar-notification-item ${
                            item.unread ? "is-unread" : ""
                          }`}
                          key={item.id}
                        >
                          <span className="Topbar-notification-symbol">
                            <ItemIcon size={17} />
                          </span>

                          <div className="Topbar-notification-content">
                            <p className="Topbar-notification-heading">
                              {item.title}
                            </p>

                            <p className="Topbar-notification-text">
                              {item.message}
                            </p>

                            <span className="Topbar-notification-time">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* MESSAGES */}
            <div className="Topbar-action-wrapper">
              <button
                type="button"
                className={`Topbar-action-btn ${
                  mailOpen ? "active" : ""
                }`}
                onClick={() => toggleMenu("messages", mailOpen)}
                aria-label="Messages"
                aria-expanded={mailOpen}
              >
                <Mail size={18} />

                {unreadMessages > 0 && (
                  <span className="Topbar-badge">
                    {unreadMessages}
                  </span>
                )}
              </button>

              {mailOpen && (
                <div className="Topbar-dropdown Topbar-notifications-dropdown">
                  <div className="Topbar-dropdown-header">
                    <div>
                      <span className="Topbar-dropdown-title">
                        Messages
                      </span>
                      <span className="Topbar-dropdown-subtitle">
                        Customer communication
                      </span>
                    </div>

                    <button
                      type="button"
                      className="Topbar-mark-read"
                      onClick={markMessagesRead}
                    >
                      <Check size={13} />
                      Read all
                    </button>
                  </div>

                  <div className="Topbar-notification-list">
                    {messages.map((item) => {
                      const ItemIcon = item.icon;

                      return (
                        <div
                          className={`Topbar-notification-item ${
                            item.unread ? "is-unread" : ""
                          }`}
                          key={item.id}
                        >
                          <span className="Topbar-notification-symbol">
                            <ItemIcon size={17} />
                          </span>

                          <div className="Topbar-notification-content">
                            <p className="Topbar-notification-heading">
                              {item.title}
                            </p>

                            <p className="Topbar-notification-text">
                              {item.message}
                            </p>

                            <span className="Topbar-notification-time">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    to="/enquiries"
                    className="Topbar-dropdown-footer-link"
                    onClick={closeAllMenus}
                  >
                    View enquiries
                  </Link>
                </div>
              )}
            </div>

            {/* FULLSCREEN */}
            <button
              type="button"
              className="Topbar-action-btn Topbar-fullscreen-btn"
              onClick={toggleFullscreen}
              aria-label={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
              title={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
            >
              {isFullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </button>

            {/* PROFILE */}
            <div
              className={`Topbar-user ${
                dropdownOpen ? "active" : ""
              }`}
            >
              <button
                type="button"
                className="Topbar-user-trigger"
                onClick={() => toggleMenu("profile", dropdownOpen)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                aria-label="Open profile menu"
              >
                <span className="Topbar-avatar-wrapper">
                  {currentProfile.avatar ? (
                    <img
                      src={currentProfile.avatar}
                      alt=""
                      className="Topbar-avatar"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="Topbar-avatar Topbar-avatar-fallback">
                      {profileInitial}
                    </span>
                  )}

                  <span className="Topbar-status-indicator" />
                </span>

                <span className="Topbar-user-info">
                  <span className="Topbar-username">
                    {currentProfile.name || "Admin User"}
                  </span>

                  <span className="Topbar-role">
                    {currentProfile.role ||
                      "Culture Administrator"}
                  </span>
                </span>

                <ChevronDown
                  size={15}
                  className={`Topbar-chevron ${
                    dropdownOpen ? "open" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="Topbar-dropdown Topbar-user-dropdown">
                  <div className="Topbar-user-card">
                    <span className="Topbar-profile-label">
                      SIGNED IN AS
                    </span>

                    <p className="Topbar-card-name">
                      {currentProfile.name || "Admin User"}
                    </p>

                    <p className="Topbar-card-email">
                      {currentProfile.email ||
                        "admin@artandculture.com"}
                    </p>
                  </div>

                  <div className="Topbar-dropdown-divider" />

                  <Link
                    to="/profile"
                    className="Topbar-dropdown-item"
                    onClick={closeAllMenus}
                  >
                    <UserRound size={16} />
                    My Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="Topbar-dropdown-item"
                    onClick={closeAllMenus}
                  >
                    <ShieldCheck size={16} />
                    Settings & Security
                  </Link>

                  <div className="Topbar-dropdown-divider" />

                  <Link
                    to="/logout"
                    className="Topbar-dropdown-item logout"
                    onClick={closeAllMenus}
                  >
                    <LogOut size={16} />
                    Log Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH OVERLAY */}
        {mobileSearchOpen && (
          <form
            className="Topbar-mobile-search-overlay"
            onSubmit={(event) => {
              handleSearchSubmit(event);
              setMobileSearchOpen(false);
            }}
          >
            <Search
              size={18}
              className="Topbar-mobile-search-icon"
            />

            <input
              ref={mobileSearchInputRef}
              type="search"
              placeholder="Search art, crafts, collections..."
              className="Topbar-mobile-search-input"
              aria-label="Search workspace"
              value={searchValue}
              onChange={(event) =>
                setSearchValue(event.target.value)
              }
            />

            <button
              type="button"
              className="Topbar-mobile-search-close"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </form>
        )}
      </header>

      <div className="Topbar-spacer" aria-hidden="true" />
    </>
  );
};

export default Topbar;
