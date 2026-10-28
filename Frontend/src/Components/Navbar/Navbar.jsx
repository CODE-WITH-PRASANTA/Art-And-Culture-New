import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaRegUser,
  FaRegHeart,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import "./Navbar.css";
import logo from "../../assets/Art and Culture logo.webp";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { wishlistCount, clearWishlist } = useWishlist();
  const { cartCount, clearCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const navLinks = [
    { title: "Home", path: "/", dropdown: false },
    { title: "About Us", path: "/about-us", dropdown: false },
    { title: "Shop", path: "/shop", dropdown: false },
    { title: "Blog", path: "/blog", dropdown: false },
    { title: "Gallary", path: "/gallary", dropdown: false },
    {
      title: "Training & Course",
      path: "/training-and-course",
      dropdown: false,
    },
    { title: "FAQ", path: "/faq", dropdown: false },
    { title: "Contact", path: "/contact", dropdown: false },
  ];

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/my-account", { replace: true, state: null });
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "AC";

  return (
    <header className="Navbar">
      <div className="Navbar-container">
        {/* Logo */}
        <Link
          to="/"
          className="Navbar-logo"
          onClick={closeMenu}
          aria-label="Artmart Home"
        >
          <img src={logo} alt="Artmart" />
        </Link>

        {/* Navigation */}
        <nav
          className={`Navbar-navigation ${
            menuOpen ? "Navbar-navigation--open" : ""
          }`}
          aria-label="Main navigation"
        >
          <ul className="Navbar-links">
            {navLinks.map((link) => (
              <li className="Navbar-item" key={link.title}>
                <NavLink
                  to={link.path}
                  end={link.path === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `Navbar-link ${
                      isActive ? "Navbar-link--active" : ""
                    }`
                  }
                >
                  <span>{link.title}</span>

                  {link.dropdown && (
                    <FaChevronDown className="Navbar-dropdown-icon" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Wishlist, Cart and Account Profile */}
        <div className="Navbar-actions">
          {/* 1. Wishlist */}
          <Link
            to="/wishlist"
            className={`Navbar-action ${wishlistCount > 0 ? "Navbar-action--has-items" : ""}`}
            aria-label="Wishlist"
            title={wishlistCount > 0 ? `Wishlist (${wishlistCount})` : "Wishlist"}
          >
            {wishlistCount > 0 ? (
              <FaHeart style={{ color: "#e52b45" }} />
            ) : (
              <FaRegHeart />
            )}
            {wishlistCount > 0 && (
              <span className="Navbar-badge" key={wishlistCount}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 2. Cart */}
          <Link
            to="/cart"
            className={`Navbar-action ${cartCount > 0 ? "Navbar-action--has-items" : ""}`}
            aria-label="Shopping Cart"
            title={cartCount > 0 ? `Shopping Cart (${cartCount})` : "Shopping Cart"}
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="Navbar-badge" key={cartCount}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* 3. User Account / Profile Dropdown */}
          {isAuthenticated && user && (user._id || user.id) && user.email ? (
            <div className="Navbar-user-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`Navbar-user-btn ${dropdownOpen ? "Navbar-user-btn--active" : ""}`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                title={`${user.firstName} ${user.lastName}`}
              >
                <div className="Navbar-user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.firstName} />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>
                <span className="Navbar-user-name">{user.firstName}</span>
                <FaChevronDown
                  className={`Navbar-user-chevron ${
                    dropdownOpen ? "Navbar-user-chevron--open" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="Navbar-user-dropdown" role="menu">
                  {/* User Profile Header */}
                  <div className="Navbar-dropdown-header">
                    <div className="Navbar-dropdown-avatar">{userInitials}</div>
                    <div className="Navbar-dropdown-meta">
                      <span className="Navbar-dropdown-name">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="Navbar-dropdown-email">{user.email}</span>
                      <span className="Navbar-dropdown-role">
                        {user.role === "admin" ? "Administrator" : "Art Collector"}
                      </span>
                    </div>
                  </div>

                  <div className="Navbar-dropdown-divider" />

                  {/* Menu navigation options */}
                  <div className="Navbar-dropdown-items">
                    <Link
                      to="/my-account?tab=profile"
                      className="Navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="Navbar-dropdown-item-icon">
                        <FaUser />
                      </span>
                      <span className="Navbar-dropdown-item-text">My Profile</span>
                    </Link>

                    <Link
                      to="/my-account?tab=orders"
                      className="Navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="Navbar-dropdown-item-icon">
                        <FaBoxOpen />
                      </span>
                      <span className="Navbar-dropdown-item-text">My Orders</span>
                    </Link>

                    <Link
                      to="/my-account?tab=addresses"
                      className="Navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="Navbar-dropdown-item-icon">
                        <FaMapMarkerAlt />
                      </span>
                      <span className="Navbar-dropdown-item-text">Saved Addresses</span>
                    </Link>

                    <Link
                      to="/my-account?tab=wishlist"
                      className="Navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="Navbar-dropdown-item-icon">
                        <FaHeart style={{ color: "#e52b45" }} />
                      </span>
                      <span className="Navbar-dropdown-item-text">My Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="Navbar-dropdown-pill">{wishlistCount}</span>
                      )}
                    </Link>

                    <Link
                      to="/my-account?tab=cart"
                      className="Navbar-dropdown-item"
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="Navbar-dropdown-item-icon">
                        <FaShoppingCart style={{ color: "#d08a24" }} />
                      </span>
                      <span className="Navbar-dropdown-item-text">Shopping Cart</span>
                      {cartCount > 0 && (
                        <span className="Navbar-dropdown-pill">{cartCount}</span>
                      )}
                    </Link>
                  </div>

                  <div className="Navbar-dropdown-divider" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    className="Navbar-dropdown-item Navbar-dropdown-item--logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <span className="Navbar-dropdown-item-icon">
                      <FaSignOutAlt />
                    </span>
                    <span className="Navbar-dropdown-item-text">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/my-account"
              className="Navbar-action"
              aria-label="Sign In / My Account"
              title="Sign In / My Account"
            >
              <FaRegUser />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="Navbar-menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
