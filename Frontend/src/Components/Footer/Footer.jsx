import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaArrowUp,
  FaArrowUpRightFromSquare,
  FaRegEnvelope,
  FaXTwitter,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa6";

import "./Footer.css";
import logo from "../../assets/Art_and_Culture_logo-removebg-preview.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const menuLinks = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/about-us" },
    { title: "Shop", path: "/shop" },
    { title: "Training & Course", path: "/training-and-course" },
    { title: "FAQ", path: "/faq" },
    { title: "Contact", path: "/contact" },
  ];

  const resourceLinks = [
    { title: "Blog", path: "/blog" },
    { title: "About Us", path: "/about-us" },
    { title: "How to Buy", path: "/how-to-buy" },
    { title: "How to Sell", path: "/how-to-sell" },
    { title: "FAQs", path: "/faq" },
  ];

  const socialLinks = [
    {
      title: "LinkedIn",
      path: "https://www.linkedin.com/",
      icon: <FaLinkedinIn />,
    },
    {
      title: "Facebook",
      path: "https://www.facebook.com/",
      icon: <FaFacebookF />,
    },
    {
      title: "Twitter / X",
      path: "https://x.com/",
      icon: <FaXTwitter />,
    },
    {
      title: "Instagram",
      path: "https://www.instagram.com/",
      icon: <FaInstagram />,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="Footer">
      <div className="Footer-container">
        {/* Main Footer Content */}
        <div className="Footer-main">
          {/* Brand Section */}
          <div className="Footer-brand">
            <Link to="/" className="Footer-logo" aria-label="Home">
              <img src={logo} alt="Artmart" />
            </Link>

            <p className="Footer-description">
              Discover a world of creativity through original artworks,
              inspiring artists, and carefully curated collections. Explore
              unique pieces and bring the beauty of art into your everyday life.
            </p>

            <div className="Footer-socials">
              {socialLinks.map((social) => (
                <a
                  key={social.title}
                  href={social.path}
                  className="Footer-social-link"
                  aria-label={social.title}
                  title={social.title}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="Footer-social-icon">{social.icon}</span>
                  <span className="Footer-social-title">
                    {social.title}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Menu Links */}
          <div className="Footer-column Footer-menu-column">
            <h3 className="Footer-heading">Menu</h3>

            <ul className="Footer-links">
              {menuLinks.map((link) => (
                <li key={link.title}>
                  <Link to={link.path} className="Footer-link">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Links */}
          <div className="Footer-column Footer-resources-column">
            <h3 className="Footer-heading">Resources</h3>

            <ul className="Footer-links">
              {resourceLinks.map((link) => (
                <li key={link.title}>
                  <Link to={link.path} className="Footer-link">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter and Payment */}
          <div className="Footer-newsletter">
            <h3 className="Footer-newsletter-heading">
              For Exclusive Art Updates
              <br />
              Join Our Newsletter!
            </h3>

            <Link to="/contact" className="Footer-newsletter-link">
              <span>Stay connected with us</span>
              <FaArrowUpRightFromSquare />
            </Link>

            <div className="Footer-payment">
              <h4 className="Footer-payment-heading">
                Secured Payment Gateways
              </h4>

              <div
                className="Footer-payment-logos"
                aria-label="Accepted payment networks"
              >
                <FaCcVisa className="Footer-payment-icon Footer-payment-visa" />
                <FaCcMastercard className="Footer-payment-icon Footer-payment-mastercard" />
                <FaCcAmex className="Footer-payment-icon Footer-payment-amex" />
                <FaCcDiscover className="Footer-payment-icon Footer-payment-discover" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="Footer-bottom">
          <p className="Footer-copyright">
            © {currentYear} <strong>Artmart</strong>
            <span className="Footer-copyright-divider">|</span>
            <span>
              Developed by{" "}
              <a
                href="https://prwebstock.com/"
                target="_blank"
                rel="noreferrer"
                className="Footer-developer"
              >
                PR WEBSTOCK
              </a>
            </span>
          </p>

          <div className="Footer-legal-links">
            <Link to="/support" className="Footer-legal-link">
              Support Center
            </Link>
            <Link to="/terms-and-conditions" className="Footer-legal-link">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="Footer-legal-link">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        type="button"
        className="Footer-back-to-top"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;