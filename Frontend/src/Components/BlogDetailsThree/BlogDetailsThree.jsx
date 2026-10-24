
import React, { useState } from "react";
import "./BlogDetailsThree.css";

const BlogDetailsThree = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    saveDetails: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Save the details only when the user selects the checkbox.
    if (formData.saveDetails) {
      try {
        localStorage.setItem(
          "BlogDetailsThree-commenter",
          JSON.stringify({
            name: formData.name,
            email: formData.email,
          })
        );
      } catch {
        // Continue even if browser storage is unavailable.
      }
    }

    // Connect your comment API here to publish comments.
    setSubmitted(true);
  };

  return (
    <section className="BlogDetailsThree">
      <div className="BlogDetailsThree-container">
        <form
          className="BlogDetailsThree-form"
          onSubmit={handleSubmit}
        >
          <h2 className="BlogDetailsThree-title">
            Leave Your Comment:
          </h2>

          <p className="BlogDetailsThree-description">
            Your email address will not be published. Required fields
            are marked <span>*</span>
          </p>

          {/* Name and Email */}
          <div className="BlogDetailsThree-fields">
            <div className="BlogDetailsThree-field">
              <label
                className="BlogDetailsThree-label"
                htmlFor="BlogDetailsThree-name"
              >
                Your Name <span>*</span>
              </label>

              <input
                id="BlogDetailsThree-name"
                className="BlogDetailsThree-input"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="BlogDetailsThree-field">
              <label
                className="BlogDetailsThree-label"
                htmlFor="BlogDetailsThree-email"
              >
                Your Email <span>*</span>
              </label>

              <input
                id="BlogDetailsThree-email"
                className="BlogDetailsThree-input"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Save Details Checkbox */}
          <label className="BlogDetailsThree-save-label">
            <input
              className="BlogDetailsThree-checkbox"
              type="checkbox"
              name="saveDetails"
              checked={formData.saveDetails}
              onChange={handleChange}
            />

            <span className="BlogDetailsThree-save-text">
              Save my name, email in this browser for the next time I comment.
            </span>
          </label>

          {/* Comment Message */}
          <div className="BlogDetailsThree-message-field">
            <label
              className="BlogDetailsThree-label"
              htmlFor="BlogDetailsThree-message"
            >
              Your Message <span>*</span>
            </label>

            <textarea
              id="BlogDetailsThree-message"
              className="BlogDetailsThree-textarea"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows={8}
              required
            />
          </div>

          {/* Submit */}
          <div className="BlogDetailsThree-submit-wrapper">
            <button
              className="BlogDetailsThree-submit-button"
              type="submit"
            >
              Post Comment
            </button>
          </div>

          {submitted && (
            <p
              className="BlogDetailsThree-success-message"
              role="status"
            >
              Your comment is ready to submit. Connect your comment API
              to publish it.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default BlogDetailsThree;
