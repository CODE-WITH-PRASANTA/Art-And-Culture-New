import React, { useState } from "react";
import {
  FaStar,
  FaCheckCircle,
  FaPaperPlane,
  FaShieldAlt,
  FaAward,
  FaQuoteLeft,
} from "react-icons/fa";
import { FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import { FEEDBACK_API_URL } from "../../config/api";
import "./CustomerFeedback.css";
import feedbackVisualImg from "../../assets/home2-artistic-banner-img.webp";

const ratingLabels = {
  1: "Poor Experience",
  2: "Fair Experience",
  3: "Good & Satisfied",
  4: "Very Good & Impressed",
  5: "Exceptional Masterpiece Experience!",
};

const CustomerFeedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("Beautiful Art Collection!");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedAuthor, setSubmittedAuthor] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      setError("Please write a meaningful feedback of at least 10 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(FEEDBACK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          comment: comment.trim(),
          rating: rating,
          title: title.trim() || "Beautiful Art Collection!",
        }),
      });

      const data = await res.json();

      if (res.status === 201 || data.success) {
        setSubmittedAuthor(name.trim());
        setSuccess(true);
        setName("");
        setEmail("");
        setTitle("Beautiful Art Collection!");
        setComment("");
        setRating(5);
      } else {
        setError(data.message || "Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      setError("Network error: Unable to submit feedback. Please ensure server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="CustomerFeedback" id="customer-feedback" aria-labelledby="CustomerFeedback-heading">
      <div className="CustomerFeedback-container">
        {/* Main Card with Left & Right Integration */}
        <div className="CustomerFeedback-split-card">
          
          {/* =====================================================
              LEFT SIDE: ARTISTIC BRAND SHOWCASE & TRUST PANEL
          ===================================================== */}
          <div className="CustomerFeedback-left-panel">
            <div className="CustomerFeedback-left-bg">
              <img
                src={feedbackVisualImg}
                alt="Artisan creating traditional artwork"
                className="CustomerFeedback-left-bg-img"
              />
              <div className="CustomerFeedback-left-overlay" />
            </div>

            <div className="CustomerFeedback-left-content">
              <div className="CustomerFeedback-badge">
                <span className="CustomerFeedback-badge-dot">✦</span>
                <span>CURATED PATRON REVIEWS</span>
              </div>

              <h2 className="CustomerFeedback-left-title" id="CustomerFeedback-heading">
                A Legacy of Heritage & Artistry. <span className="CustomerFeedback-title-gold">Share Your Reflections.</span>
              </h2>

              <p className="CustomerFeedback-left-desc">
                Every acquisition carries centuries of tradition. Your thoughts empower our master artisans and guide fellow art collectors worldwide.
              </p>

              <div className="CustomerFeedback-quote-card">
                <FaQuoteLeft className="CustomerFeedback-quote-icon" />
                <p className="CustomerFeedback-quote-text">
                  "Our mission is to preserve centuries of sacred artistry while delivering
                  uncompromised quality to discerning collectors worldwide."
                </p>
                <span className="CustomerFeedback-quote-author">
                  — Art & Culture Curatorial Council
                </span>
              </div>

              {/* Trust Features */}
              <div className="CustomerFeedback-trust-pills">
                <div className="CustomerFeedback-trust-pill">
                  <FaShieldAlt className="CustomerFeedback-trust-icon" />
                  <div>
                    <strong>Verified Patrons</strong>
                    <span>Authentic Collector Reviews</span>
                  </div>
                </div>

                <div className="CustomerFeedback-trust-pill">
                  <FaAward className="CustomerFeedback-trust-icon" />
                  <div>
                    <strong>Curated Heritage</strong>
                    <span>Masterpiece Craftsmanship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE: THE REVIEW & FEEDBACK FORM
          ===================================================== */}
          <div className="CustomerFeedback-right-panel">
            {success ? (
              <div className="CustomerFeedback-success-state">
                <div className="CustomerFeedback-success-icon-box">
                  <FaCheckCircle className="CustomerFeedback-success-icon" />
                </div>
                <h3 className="CustomerFeedback-success-title">
                  Thank You for Your Feedback!
                </h3>
                <p className="CustomerFeedback-success-text">
                  We sincerely appreciate you sharing your thoughts{submittedAuthor ? `, ${submittedAuthor}` : ""}. Your feedback is invaluable in supporting our master artisans and helping us preserve the finest heritage art collection.
                </p>
                <button
                  type="button"
                  className="CustomerFeedback-reset-btn"
                  onClick={() => setSuccess(false)}
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <form className="CustomerFeedback-form" onSubmit={handleSubmit} noValidate>
                <div className="CustomerFeedback-form-header">
                  <h3 className="CustomerFeedback-form-title">
                    Write Your Feedback
                  </h3>
                  <p className="CustomerFeedback-form-subtitle">
                    Please share your experience with our collection and customer care.
                  </p>
                </div>

                {error && (
                  <div className="CustomerFeedback-error-alert" role="alert">
                    <FiAlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Rating Selector */}
                <div className="CustomerFeedback-rating-group">
                  <span className="CustomerFeedback-label">
                    Your Rating <span>*</span>
                  </span>
                  <div
                    className="CustomerFeedback-stars-box"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <div className="CustomerFeedback-stars-row">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            className="CustomerFeedback-star-btn"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                          >
                            <FaStar
                              className={`CustomerFeedback-star ${
                                isFilled
                                  ? "CustomerFeedback-star--filled"
                                  : "CustomerFeedback-star--empty"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="CustomerFeedback-rating-label">
                      {ratingLabels[hoverRating || rating]}
                    </span>
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="CustomerFeedback-form-row">
                  <div className="CustomerFeedback-field">
                    <label htmlFor="feedback-author" className="CustomerFeedback-label">
                      Full Name <span>*</span>
                    </label>
                    <input
                      id="feedback-author"
                      type="text"
                      className="CustomerFeedback-input"
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError("");
                      }}
                      maxLength={70}
                      required
                    />
                  </div>

                  <div className="CustomerFeedback-field">
                    <label htmlFor="feedback-email" className="CustomerFeedback-label">
                      Email Address <span>*</span>
                    </label>
                    <input
                      id="feedback-email"
                      type="email"
                      className="CustomerFeedback-input"
                      placeholder="e.g. priya@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Headline / Title */}
                <div className="CustomerFeedback-field">
                  <label htmlFor="feedback-title" className="CustomerFeedback-label">
                    Headline / Subject
                  </label>
                  <input
                    id="feedback-title"
                    type="text"
                    className="CustomerFeedback-input"
                    placeholder="e.g. Beautiful Art Collection!, Stunning Craftsmanship"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* Review Message */}
                <div className="CustomerFeedback-field">
                  <label htmlFor="feedback-comment" className="CustomerFeedback-label">
                    Your Feedback <span>*</span>
                  </label>
                  <textarea
                    id="feedback-comment"
                    className="CustomerFeedback-textarea"
                    rows={4}
                    placeholder="Write your honest thoughts about our artwork, presentation, packaging, or auction experience..."
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (error) setError("");
                    }}
                    maxLength={600}
                    required
                  />
                  <div className="CustomerFeedback-char-counter">
                    <span>Minimum 10 characters</span>
                    <span>{comment.length}/600</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="CustomerFeedback-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <FaPaperPlane size={14} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedback;

