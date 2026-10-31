import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiUsers,
  FiAlertTriangle,
  FiX,
  FiStar,
} from "react-icons/fi";
import { TRAINING_COURSES_API_URL, formatImageUrl } from "../../config/api";
import "./TrainingCourseManagement.css";

const TrainingCourseManagement = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    online: 0,
    offline: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(TRAINING_COURSES_API_URL);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setCourses(data.data);
        if (data.stats) {
          setStats(data.stats);
        } else {
          setStats({
            total: data.data.length,
            active: data.data.filter((c) => c.status === "Active").length,
            online: data.data.filter((c) => c.mode === "Online").length,
            offline: data.data.filter((c) => c.mode === "Offline").length,
          });
        }
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      showToast("Unable to load courses from database");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  // Toggle status
  const handleToggleStatus = async (course) => {
    const nextStatus = course.status === "Active" ? "Draft" : "Active";
    try {
      setActionLoadingId(course._id);
      const res = await fetch(`${TRAINING_COURSES_API_URL}/${course._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Course marked as ${nextStatus}`);
        setCourses((prev) =>
          prev.map((c) => (c._id === course._id ? { ...c, status: nextStatus } : c))
        );
        fetchCourses();
      } else {
        showToast(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Network error updating status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Course
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setActionLoadingId(courseToDelete._id);
      const res = await fetch(`${TRAINING_COURSES_API_URL}/${courseToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Training course deleted successfully");
        setCourses((prev) => prev.filter((c) => c._id !== courseToDelete._id));
        setCourseToDelete(null);
        fetchCourses();
      } else {
        showToast(data.message || "Failed to delete course");
      }
    } catch (err) {
      console.error("Delete course error:", err);
      showToast("Network error deleting course");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (statusFilter === "Active" && c.status !== "Active") return false;
      if (statusFilter === "Draft" && c.status !== "Draft") return false;
      if (statusFilter === "Online" && c.mode !== "Online") return false;
      if (statusFilter === "Offline" && c.mode !== "Offline") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (c.title || "").toLowerCase().includes(q);
        const locMatch = (c.location || "").toLowerCase().includes(q);
        const catMatch = (c.category || "").toLowerCase().includes(q);
        const instMatch = (c.instructor || "").toLowerCase().includes(q);
        return titleMatch || locMatch || catMatch || instMatch;
      }

      return true;
    });
  }, [courses, statusFilter, searchQuery]);

  return (
    <div className="course-manage-page">
      {toastMessage && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#0f172a", color: "#fff", padding: "14px 22px", borderRadius: "10px", zIndex: 9999 }}>
          <FiCheckCircle style={{ marginRight: "8px" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="course-manage-header">
        <div>
          <h1>
            <FiBookOpen /> Training & Course Management
          </h1>
          <p>
            Manage art classes, pottery workshops, training schedules, and pricing displayed on the public website.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
          >
            <FiRefreshCw className={refreshing ? "spinning" : ""} />
            <span>Refresh</span>
          </button>

          <Link to="/training-course/posting" className="btn-add-course">
            <FiPlus />
            <span>Post New Course</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="course-stats-grid">
        <div className="course-stat-card">
          <div className="course-stat-icon total">
            <FiBookOpen />
          </div>
          <div className="course-stat-info">
            <h3>{stats.total || courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="course-stat-icon active">
            <FiCheckCircle />
          </div>
          <div className="course-stat-info">
            <h3>{stats.active}</h3>
            <p>Active (Live)</p>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="course-stat-icon online">
            <FiGlobe />
          </div>
          <div className="course-stat-info">
            <h3>{stats.online}</h3>
            <p>Online Classes</p>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="course-stat-icon offline">
            <FiMapPin />
          </div>
          <div className="course-stat-info">
            <h3>{stats.offline}</h3>
            <p>Studio / In-person</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="course-table-card">
        {/* Toolbar */}
        <div className="course-toolbar">
          <div className="course-tabs">
            {["All", "Active", "Draft", "Online", "Offline"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`course-tab ${statusFilter === tab ? "active" : ""}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="course-search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by course title, city, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "50px", textAlign: "center", color: "#64748b" }}>
              <FiRefreshCw className="spinning" size={28} />
              <p style={{ marginTop: "12px" }}>Loading courses from database...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div style={{ padding: "50px", textAlign: "center", color: "#64748b" }}>
              <FiBookOpen size={36} color="#cbd5e1" />
              <h4 style={{ margin: "10px 0 4px", color: "#1e293b" }}>No training courses found</h4>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                Click "Post New Course" above to create your first workshop.
              </p>
            </div>
          ) : (
            <table className="course-table">
              <thead>
                <tr>
                  <th>Course / Workshop</th>
                  <th>Mode & Location</th>
                  <th>Category & Level</th>
                  <th>Duration</th>
                  <th>Fee Structure</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((item) => {
                  const discountPercent =
                    item.courseFee && item.discountFee && item.courseFee > item.discountFee
                      ? Math.round(((item.courseFee - item.discountFee) / item.courseFee) * 100)
                      : 0;

                  return (
                    <tr key={item._id}>
                      {/* Title & Thumb */}
                      <td>
                        <div className="course-title-cell">
                          <img
                            src={formatImageUrl(item.image) || "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&q=80"}
                            alt={item.title}
                            className="course-thumb"
                          />
                          <div className="course-title-info">
                            <strong>{item.title}</strong>
                            <span>{item.instructor || "Master Artisan"}</span>
                            {item.featured && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", color: "#d97706", fontSize: "0.74rem", fontWeight: 700, marginLeft: "6px" }}>
                                <FiStar fill="#d97706" size={10} /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Mode & Location */}
                      <td>
                        <span className={`badge-mode ${item.mode.toLowerCase()}`}>
                          {item.mode}
                        </span>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "4px" }}>
                          {item.location}
                        </div>
                      </td>

                      {/* Category & Level */}
                      <td>
                        <strong style={{ color: "#334155" }}>{item.category}</strong>
                        <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{item.level}</div>
                      </td>

                      {/* Duration */}
                      <td>
                        <span style={{ color: "#475569", fontWeight: 500 }}>
                          {item.duration || "4 Weeks"}
                        </span>
                      </td>

                      {/* Fee */}
                      <td>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>
                          ₹{Number(item.discountFee || item.courseFee || 0).toLocaleString("en-IN")}
                        </div>
                        {discountPercent > 0 && (
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            <span style={{ textDecoration: "line-through" }}>
                              ₹{Number(item.courseFee).toLocaleString("en-IN")}
                            </span>
                            <span style={{ color: "#dc2626", fontWeight: 700, marginLeft: "4px" }}>
                              {discountPercent}% OFF
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <button
                          type="button"
                          className={`badge-status ${item.status.toLowerCase()}`}
                          style={{ border: "none", cursor: "pointer" }}
                          onClick={() => handleToggleStatus(item)}
                          disabled={actionLoadingId === item._id}
                          title="Click to toggle status"
                        >
                          {item.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="course-actions">
                          <button
                            type="button"
                            className="action-btn"
                            title="View Course Details"
                            onClick={() => setSelectedCourse(item)}
                          >
                            <FiEye />
                          </button>

                          <button
                            type="button"
                            className="action-btn edit"
                            title="Edit Course"
                            onClick={() => navigate(`/training-course/posting?edit=${item._id}`)}
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            className="action-btn delete"
                            title="Delete Course"
                            onClick={() => setCourseToDelete(item)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Modal */}
      {selectedCourse && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
          onClick={() => setSelectedCourse(null)}
        >
          <div
            style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "560px", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative", height: "200px" }}>
              <img
                src={formatImageUrl(selectedCourse.image)}
                alt={selectedCourse.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <FiX />
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <span className={`badge-mode ${selectedCourse.mode.toLowerCase()}`}>{selectedCourse.mode}</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a" }}>
                  ₹{Number(selectedCourse.discountFee || selectedCourse.courseFee).toLocaleString("en-IN")}
                </span>
              </div>

              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>
                {selectedCourse.title}
              </h2>

              <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "18px" }}>
                {selectedCourse.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "14px", background: "#f8fafc", borderRadius: "8px", fontSize: "0.85rem", color: "#334155" }}>
                <div><strong>Location:</strong> {selectedCourse.location}</div>
                <div><strong>Duration:</strong> {selectedCourse.duration || "4 Weeks"}</div>
                <div><strong>Category:</strong> {selectedCourse.category}</div>
                <div><strong>Skill Level:</strong> {selectedCourse.level}</div>
                <div><strong>Instructor:</strong> {selectedCourse.instructor}</div>
                <div><strong>Batch Size:</strong> {selectedCourse.batchSize}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => navigate(`/training-course/posting?edit=${selectedCourse._id}`)}
                  style={{ padding: "9px 18px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontWeight: 600 }}
                >
                  Edit Course
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  style={{ padding: "9px 18px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "7px", cursor: "pointer", fontWeight: 600 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {courseToDelete && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
          onClick={() => setCourseToDelete(null)}
        >
          <div style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "440px", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 10px", color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiAlertTriangle /> Confirm Deletion
            </h3>
            <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 20px" }}>
              Are you sure you want to permanently delete <strong>{courseToDelete.title}</strong>? This action will remove it from the website immediately.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                style={{ padding: "9px 18px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCourse}
                disabled={actionLoadingId === courseToDelete._id}
                style={{ padding: "9px 18px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
              >
                {actionLoadingId === courseToDelete._id ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingCourseManagement;

