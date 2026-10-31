import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSave,
  FiMapPin,
  FiDollarSign,
  FiLayers,
  FiClock,
  FiUser,
  FiStar,
  FiEye,
} from "react-icons/fi";
import { TRAINING_COURSES_API_URL, formatImageUrl } from "../../config/api";
import "./TrainingCoursePosting.css";

const defaultImage =
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85";

const TrainingCoursePosting = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("edit");

  const initialFormState = {
    title: "",
    description: "",
    category: "Painting",
    mode: "Offline",
    location: "",
    courseFee: "",
    discountFee: "",
    duration: "",
    level: "All Levels",
    instructor: "",
    batchSize: "",
    featured: false,
    status: "Active",
    image: "",
    highlights: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // If edit mode, load existing course data
  useEffect(() => {
    if (!editId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${TRAINING_COURSES_API_URL}/${editId}`);
        const data = await res.json();

        if (data.success && data.data) {
          const c = data.data;
          setFormData({
            title: c.title || "",
            description: c.description || "",
            category: c.category || "Painting",
            mode: c.mode || "Offline",
            location: c.location || "",
            courseFee: c.courseFee || "",
            discountFee: c.discountFee || "",
            duration: c.duration || "",
            level: c.level || "All Levels",
            instructor: c.instructor || "",
            batchSize: c.batchSize || "",
            featured: c.featured !== undefined ? c.featured : false,
            status: c.status || "Active",
            image: c.image || "",
            highlights: Array.isArray(c.highlights)
              ? c.highlights.join(", ")
              : c.highlights || "",
          });
          setImagePreview(formatImageUrl(c.image) || defaultImage);
        } else {
          setError("Failed to load course details for editing.");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Network error loading course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [editId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should not exceed 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Course title is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Course description is required.");
      return;
    }

    if (!formData.courseFee || isNaN(Number(formData.courseFee)) || Number(formData.courseFee) < 0) {
      setError("Please provide a valid original course fee.");
      return;
    }

    try {
      setSubmitting(true);
      const parsedHighlights = formData.highlights
        ? formData.highlights
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean)
        : [];

      const payload = {
        ...formData,
        courseFee: Number(formData.courseFee),
        discountFee:
          formData.discountFee !== "" && !isNaN(Number(formData.discountFee))
            ? Number(formData.discountFee)
            : Number(formData.courseFee),
        highlights: parsedHighlights,
      };

      const url = editId
        ? `${TRAINING_COURSES_API_URL}/${editId}`
        : TRAINING_COURSES_API_URL;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast(editId ? "Course updated successfully!" : "Training course published successfully!");
        setTimeout(() => {
          navigate("/training-course/management");
        }, 1200);
      } else {
        setError(data.message || "Failed to save training course.");
      }
    } catch (err) {
      console.error("Course submit error:", err);
      setError("Network error: Unable to save course. Ensure server is active.");
    } finally {
      setSubmitting(false);
    }
  };

  const discountPercentage =
    formData.courseFee && formData.discountFee && Number(formData.courseFee) > Number(formData.discountFee)
      ? Math.round(
          ((Number(formData.courseFee) - Number(formData.discountFee)) /
            Number(formData.courseFee)) *
            100
        )
      : 0;

  return (
    <div className="course-posting-page">
      {toastMessage && (
        <div className="course-toast">
          <FiCheckCircle style={{ marginRight: "8px" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="course-posting-header">
        <div>
          <h1>
            <FiBookOpen /> {editId ? "Edit Training & Course" : "Post New Training & Course"}
          </h1>
          <p>
            {editId
              ? "Update course curriculum, fee structure, learning mode, and schedule details."
              : "Create and publish a new art workshop, pottery class, or training course for prospective students."}
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 18px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            color: "#b91c1c",
            marginBottom: "20px",
          }}
        >
          <FiAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="course-posting-grid">
        {/* Left Form */}
        <div className="course-form-card">
          <form onSubmit={handleSubmit} autoComplete="off">
            <h3 className="form-section-title">
              <FiLayers /> 1. Course Overview & Category
            </h3>

            <div className="form-group">
              <label>
                Course Title <span>*</span>
              </label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Madhubani Painting Masterclass"
                value={formData.title}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>
                  Category <span>*</span>
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Painting">Painting</option>
                  <option value="Drawing & Sketching">Drawing & Sketching</option>
                  <option value="Pottery & Clay">Pottery & Clay</option>
                  <option value="Traditional Folk Art">Traditional Folk Art</option>
                  <option value="Watercolor">Watercolor</option>
                  <option value="Sculpture & Craft">Sculpture & Craft</option>
                  <option value="Calligraphy">Calligraphy</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Skill Level <span>*</span>
                </label>
                <select
                  name="level"
                  className="form-select"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="All Levels">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced Masterclass">Advanced Masterclass</option>
                  <option value="Kids & Teens">Kids & Teens</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>
                Course Description <span>*</span>
              </label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Detail what students will learn, materials, techniques, and studio practices..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <h3 className="form-section-title" style={{ marginTop: "24px" }}>
              <FiMapPin /> 2. Schedule, Mode & Location
            </h3>

            <div className="form-group-row">
              <div className="form-group">
                <label>
                  Learning Mode <span>*</span>
                </label>
                <select
                  name="mode"
                  className="form-select"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  <option value="Offline">Offline (Studio / In-person)</option>
                  <option value="Online">Online (Live Interactive)</option>
                  <option value="Hybrid">Hybrid (Studio + Online)</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Location / Studio Address <span>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  placeholder={formData.mode === "Online" ? "Online / Zoom" : "e.g. Madhapur, Hyderabad"}
                  value={formData.location}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Course Duration</label>
                <input
                  type="text"
                  name="duration"
                  className="form-input"
                  placeholder="e.g. 4 Weeks, 8 Sessions"
                  value={formData.duration}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Instructor / Artisan Name</label>
                <input
                  type="text"
                  name="instructor"
                  className="form-input"
                  placeholder="e.g. Master Artisan Rajeshwar Rao"
                  value={formData.instructor}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </div>

            <h3 className="form-section-title" style={{ marginTop: "24px" }}>
              <FiDollarSign /> 3. Fee Structure & Banner Image
            </h3>

            <div className="form-group-row">
              <div className="form-group">
                <label>
                  Original Fee (₹) <span>*</span>
                </label>
                <input
                  type="number"
                  name="courseFee"
                  className="form-input"
                  placeholder="e.g. 2500"
                  value={formData.courseFee}
                  onChange={handleChange}
                  min="0"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="form-group">
                <label>Discounted Fee (₹)</label>
                <input
                  type="number"
                  name="discountFee"
                  className="form-input"
                  placeholder="e.g. 1900"
                  value={formData.discountFee}
                  onChange={handleChange}
                  min="0"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label>Course Poster / Banner Image</label>
              <label className="course-image-uploader">
                <FiUploadCloud className="uploader-icon" />
                <div className="uploader-text">
                  <strong>Click or Drag an image here to upload</strong>
                  <span>Supports JPG, PNG, WEBP (Max 5MB)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageFile}
                />
              </label>

              {imagePreview && (
                <div className="course-image-preview-box">
                  <img src={imagePreview} alt="Course Preview" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => {
                      setImagePreview(defaultImage);
                      setFormData((prev) => ({ ...prev, image: defaultImage }));
                    }}
                    title="Reset to default image"
                  >
                    <FiX />
                  </button>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="form-group">
              <label>Course Highlights (comma separated)</label>
              <input
                type="text"
                name="highlights"
                className="form-input"
                placeholder="e.g. All skill levels, Certificate included, Materials provided"
                value={formData.highlights}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            {/* Featured & Status */}
            <div className="form-group-row">
              <div className="form-checkbox-row">
                <input
                  type="checkbox"
                  id="featured-check"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured-check">
                  Featured on Homepage & Art Classes Page
                </label>
              </div>

              <div className="form-group">
                <label>Publication Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active (Publicly Visible)</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/training-course/management")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-submit-course"
                disabled={submitting}
              >
                <FiSave />
                <span>{submitting ? "Saving Course..." : editId ? "Update Course" : "Publish Course"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Column */}
        <div className="course-preview-column">
          <div className="preview-card-wrapper">
            <h4>
              <FiEye style={{ marginRight: "6px" }} /> Live Card Preview (Frontend)
            </h4>

            <div className="mock-course-card">
              <div className="mock-card-image">
                <img
                  src={imagePreview || defaultImage}
                  alt={formData.title || "Course Preview"}
                />

                {formData.featured && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: "#f59e0b",
                      color: "#ffffff",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FiStar size={11} fill="currentColor" /> Featured
                  </span>
                )}

                <span className="mock-badge-mode">{formData.mode}</span>

                {discountPercentage > 0 && (
                  <span className="mock-badge-discount">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              <div className="mock-card-body">
                <h3 className="mock-card-title">
                  {formData.title || "Your Course Title Will Appear Here"}
                </h3>

                <p className="mock-card-desc">
                  {formData.description ||
                    "Enter course description to see how it renders on the card..."}
                </p>

                <div className="mock-card-location">
                  <FiMapPin size={13} style={{ marginRight: "5px" }} />
                  <strong>{formData.location || "Location"}</strong>
                </div>

                <div className="mock-price-row">
                  <span className="mock-discount-fee">
                    ₹{Number(formData.discountFee || formData.courseFee || 0).toLocaleString("en-IN")}
                  </span>
                  {formData.discountFee &&
                    Number(formData.discountFee) < Number(formData.courseFee) && (
                      <span className="mock-orig-fee">
                        ₹{Number(formData.courseFee).toLocaleString("en-IN")}
                      </span>
                    )}
                </div>

                <div
                  style={{
                    marginTop: "14px",
                    padding: "9px 12px",
                    background: "#0f172a",
                    color: "#ffffff",
                    textAlign: "center",
                    borderRadius: "6px",
                    fontSize: "0.84rem",
                    fontWeight: 600,
                  }}
                >
                  Enquiry Now &rarr;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCoursePosting;

