import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaChevronDown,
  FaRegUser,
  FaRegHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "./Navbar.css";
import logo from "../../assets/Art and Culture logo.webp";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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

  const closeMenu = () => setMenuOpen(false);

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

        {/* Account, Wishlist and Cart */}
        <div className="Navbar-actions">
          <Link
            to="/my-account"
            className="Navbar-action"
            aria-label="My Account"
            title="My Account"
          >
            <FaRegUser />
          </Link>

          <Link
            to="/wishlist"
            className="Navbar-action"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <FaRegHeart />
          </Link>

          <Link
            to="/cart"
            className="Navbar-action"
            aria-label="Shopping Cart"
            title="Shopping Cart"
          >
            <FaShoppingCart />
          </Link>
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