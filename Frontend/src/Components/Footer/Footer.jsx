import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaArrowRight,
  FaRegEnvelope,
  FaCircleCheck,
  FaCircleExclamation,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa6";

import "./Footer.css";
import logo from "../../assets/Art_and_Culture_logo-removebg-preview.png";

/* Change the brand name here and it updates the logo text and copyright */
const BRAND_NAME = "Art & Culture";
const BRAND_TAGLINE = "Discover Art. Celebrate Culture.";

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

const paymentIcons = [
  { name: "Visa", icon: <FaCcVisa />, className: "Footer-payment-visa" },
  {
    name: "Mastercard",
    icon: <FaCcMastercard />,
    className: "Footer-payment-mastercard",
  },
  {
    name: "American Express",
    icon: <FaCcAmex />,
    className: "Footer-payment-amex",
  },
  {
    name: "Discover",
    icon: <FaCcDiscover />,
    className: "Footer-payment-discover",
  },
];

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  /* Soft reveal animation when the footer scrolls into view */
  useEffect(() => {
    const node = footerRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setStatus({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      /* Replace this wait with your real newsletter API call, e.g.
         await fetch("/api/newsletter", { method: "POST", ... }) */
      await new Promise((resolve) => setTimeout(resolve, 900));

      setStatus({
        type: "success",
        text: "Thank you for subscribing. Watch your inbox for art updates.",
      });
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const reveal = (delay) => ({ "--delay": `${delay}ms` });

  return (
    <footer
      ref={footerRef}
      className={`Footer ${visible ? "Footer--visible" : ""}`}
    >
      <div className="Footer-container">
        {/* ================= Main Footer Content ================= */}
        <div className="Footer-main">
          {/* ---------- Brand ---------- */}
          <div className="Footer-brand Footer-reveal" style={reveal(0)}>
            <Link
              to="/"
              className="Footer-logo"
              aria-label={`${BRAND_NAME} home`}
            >
              <span className="Footer-logo-badge">
                <span
                  className="Footer-logo-mark"
                  style={{ "--footer-logo": `url(${logo})` }}
                >
                  <img src={logo} alt={`${BRAND_NAME} logo`} />
                </span>
              </span>

              <span className="Footer-logo-text">
                <strong>{BRAND_NAME}</strong>
                <small>{BRAND_TAGLINE}</small>
              </span>
            </Link>

            <p className="Footer-description">
              Discover a world of creativity through original artworks,
              inspiring artists, and carefully curated collections. Explore
              unique pieces and bring the beauty of art into your everyday
              life.
            </p>

            <div className="Footer-follow">
              <span className="Footer-follow-label">Follow Us</span>

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
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- Menu ---------- */}
          <div
            className="Footer-column Footer-menu-column Footer-reveal"
            style={reveal(120)}
          >
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

          {/* ---------- Resources ---------- */}
          <div
            className="Footer-column Footer-resources-column Footer-reveal"
            style={reveal(220)}
          >
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

          {/* ---------- Newsletter + Payment ---------- */}
          <div className="Footer-newsletter Footer-reveal" style={reveal(320)}>
            <span className="Footer-eyebrow">Newsletter</span>

            <h3 className="Footer-newsletter-heading">
              For Exclusive Art Updates
              <br />
              Join Our <span>Newsletter!</span>
            </h3>

            <form
              className="Footer-form"
              onSubmit={handleSubscribe}
              noValidate
            >
              <label htmlFor="Footer-newsletter-email" className="Footer-sr">
                Email address
              </label>

              <div className="Footer-form-field">
                <FaRegEnvelope className="Footer-form-icon" />

                <input
                  id="Footer-newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus({ type: "", text: "" });
                  }}
                  autoComplete="email"
                  disabled={loading}
                />

                <button
                  type="submit"
                  className="Footer-form-button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="Footer-spinner" aria-label="Sending" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <FaArrowRight />
                    </>
                  )}
                </button>
              </div>

              {status.text && (
                <p
                  className={`Footer-form-message ${status.type}`}
                  role="status"
                >
                  {status.type === "success" ? (
                    <FaCircleCheck />
                  ) : (
                    <FaCircleExclamation />
                  )}
                  <span>{status.text}</span>
                </p>
              )}
            </form>

            <div className="Footer-payment">
              <h4 className="Footer-payment-heading">
                Secured Payment Gateways
              </h4>

              <div
                className="Footer-payment-logos"
                aria-label="Accepted payment networks"
              >
                {paymentIcons.map((payment) => (
                  <span
                    key={payment.name}
                    className={`Footer-payment-tile ${payment.className}`}
                    title={payment.name}
                  >
                    {payment.icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= Bottom Footer ================= */}
        <div className="Footer-bottom Footer-reveal" style={reveal(420)}>
          <p className="Footer-copyright">
            <span>
              © {currentYear} <strong>{BRAND_NAME}</strong>
            </span>
            <span className="Footer-copyright-divider" aria-hidden="true">
              |
            </span>
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

          <nav className="Footer-legal-links" aria-label="Legal">
            <Link to="/support" className="Footer-legal-link">
              Support Center
            </Link>
            <Link to="/terms-and-conditions" className="Footer-legal-link">
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy-policy" className="Footer-legal-link">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;