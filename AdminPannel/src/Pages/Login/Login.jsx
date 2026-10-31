import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Award,
  Layers,
  Sparkle,
} from "lucide-react";
import { ADMIN_AUTH_API_URL } from "../../config/api";
import { setAdminSession, isAdminAuthenticated } from "../../utils/adminAuth";
import logoImg from "../../assets/logo.png";
import artBannerImg from "../../assets/login-art-banner.webp";
import artCardImg from "../../assets/login-art-card.webp";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setError("Please enter your admin email or username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${ADMIN_AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: cleanId,
          password: cleanPass,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(data.message || "Authentication successful! Redirecting to dashboard...");
        setAdminSession(data.token, data.admin);

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 400);
      } else {
        setError(data.message || "Invalid credentials. Please verify your details.");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Unable to connect to the backend server. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="AdminSplitLogin">
      {/* ======================================================== */}
      {/* LEFT SIDE: LUXURY HERITAGE ART SHOWCASE                  */}
      {/* ======================================================== */}
      <div className="AdminSplitLogin-left">
        <div
          className="AdminSplitLogin-left-bg"
          style={{ backgroundImage: `url(${artBannerImg})` }}
        />
        <div className="AdminSplitLogin-left-overlay" />
        <div className="AdminSplitLogin-left-glow" />

        <div className="AdminSplitLogin-left-content">
          {/* Top Brand Pill */}
          <div className="AdminSplitLogin-brand-tag">
            <span className="AdminSplitLogin-brand-dot" />
            <span>Preserving Heritage · Inspiring Creativity</span>
          </div>

          {/* Center Showcase */}
          <div className="AdminSplitLogin-hero-text">
            <h2 className="AdminSplitLogin-hero-title">
              Handcrafted Treasures of India
            </h2>
            <p className="AdminSplitLogin-hero-subtitle">
              Where tradition meets masterpiece. Curating authentic artifacts, bespoke crafts, and cultural legacy for discerning collectors.
            </p>

            <div className="AdminSplitLogin-features-grid">
              <div className="AdminSplitLogin-feature-pill">
                <Award size={15} style={{ color: "#f1c97a" }} />
                <span>Certified Indian Masterpieces</span>
              </div>
              <div className="AdminSplitLogin-feature-pill">
                <Layers size={15} style={{ color: "#f1c97a" }} />
                <span>Real-Time Orders &amp; Logistics Hub</span>
              </div>
            </div>
          </div>

          {/* Bottom Floating Artwork Snippet Card */}
          <div className="AdminSplitLogin-floating-card">
            <img
              src={artCardImg}
              alt="Art Feature"
              className="AdminSplitLogin-floating-thumb"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="AdminSplitLogin-floating-meta">
              <span className="AdminSplitLogin-floating-badge">Admin Suite v2.0</span>
              <h4 className="AdminSplitLogin-floating-title">Art &amp; Culture Hub</h4>
              <p className="AdminSplitLogin-floating-desc">
                High-security administrative gateway for collection and order management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT SIDE: PREMIUM WHITE THEME LOGIN FORM (NO SCROLL)   */}
      {/* ======================================================== */}
      <div className="AdminSplitLogin-right">
        <div className="AdminSplitLogin-form-container">
          {/* Header */}
          <div className="AdminSplitLogin-form-header">
            <div className="AdminSplitLogin-logo-row">
              <div className="AdminSplitLogin-logo-box">
                <img
                  src={logoImg}
                  alt="Art & Culture Logo"
                  className="AdminSplitLogin-logo-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div>
                <h3 className="AdminSplitLogin-portal-title">Art &amp; Culture</h3>
                <span className="AdminSplitLogin-portal-subtitle">ADMINISTRATION PORTAL</span>
              </div>
            </div>

            <h1 className="AdminSplitLogin-title">Sign In to Dashboard</h1>
            <p className="AdminSplitLogin-desc">
              Please enter your authorized credentials to access the art and order management console.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="AdminSplitLogin-alert AdminSplitLogin-alert--error" role="alert">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="AdminSplitLogin-alert AdminSplitLogin-alert--success" role="alert">
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="AdminSplitLogin-form" noValidate>
            <div className="AdminSplitLogin-field">
              <label htmlFor="admin-id" className="AdminSplitLogin-label">
                Admin Email or Username
              </label>
              <div className="AdminSplitLogin-input-box">
                <Mail size={16} className="AdminSplitLogin-field-icon" />
                <input
                  id="admin-id"
                  type="text"
                  className="AdminSplitLogin-input"
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="AdminSplitLogin-field">
              <label htmlFor="admin-pass" className="AdminSplitLogin-label">
                Password
              </label>
              <div className="AdminSplitLogin-input-box">
                <Lock size={16} className="AdminSplitLogin-field-icon" />
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  className="AdminSplitLogin-input AdminSplitLogin-input--pass"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="AdminSplitLogin-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="AdminSplitLogin-row">
              <label className="AdminSplitLogin-checkbox-wrap">
                <input
                  type="checkbox"
                  className="AdminSplitLogin-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="AdminSplitLogin-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="AdminSplitLogin-loader" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="AdminSplitLogin-footer-note">
            <span>© 2026 Art &amp; Culture · Handcrafted Treasures of India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
