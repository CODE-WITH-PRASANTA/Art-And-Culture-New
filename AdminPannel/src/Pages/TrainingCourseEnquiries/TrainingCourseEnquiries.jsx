import React, { useState, useEffect, useMemo } from "react";
import {
  FiClipboard,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUser,
  FiRefreshCw,
  FiTrash2,
  FiEye,
  FiX,
  FiAlertTriangle,
  FiSend,
  FiBookOpen,
  FiCalendar,
  FiMessageSquare,
  FiExternalLink,
} from "react-icons/fi";
import { COURSE_ENQUIRIES_API_URL } from "../../config/api";
import "./TrainingCourseEnquiries.css";

const TrainingCourseEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    enrolled: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchEnquiries = async () => {
    try {
      const res = await fetch(COURSE_ENQUIRIES_API_URL);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setEnquiries(data.data);
        if (data.stats) {
          setStats(data.stats);
        } else {
          setStats({
            total: data.data.length,
            new: data.data.filter((e) => e.status === "New").length,
            contacted: data.data.filter((e) => e.status === "Contacted").length,
            enrolled: data.data.filter((e) => e.status === "Enrolled").length,
            closed: data.data.filter((e) => e.status === "Closed").length,
          });
        }
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      showToast("Unable to load course enquiries");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEnquiries();
  };

  // Change status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      const res = await fetch(`${COURSE_ENQUIRIES_API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Enquiry marked as ${newStatus}`);
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry._id === id) {
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        }
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

  // Delete enquiry
  const handleDeleteEnquiry = async () => {
    if (!enquiryToDelete) return;

    try {
      setActionLoadingId(enquiryToDelete._id);
      const res = await fetch(`${COURSE_ENQUIRIES_API_URL}/${enquiryToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Enquiry deleted successfully");
        setEnquiries((prev) => prev.filter((e) => e._id !== enquiryToDelete._id));
        setEnquiryToDelete(null);
        fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry._id === enquiryToDelete._id) {
          setSelectedEnquiry(null);
        }
      } else {
        showToast(data.message || "Failed to delete enquiry");
      }
    } catch (err) {
      console.error("Delete enquiry error:", err);
      showToast("Network error deleting enquiry");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== "All" && e.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (e.name || "").toLowerCase().includes(q);
        const emailMatch = (e.email || "").toLowerCase().includes(q);
        const phoneMatch = (e.phone || "").toLowerCase().includes(q);
        const courseMatch = (e.courseName || "").toLowerCase().includes(q);
        const locMatch = (e.location || "").toLowerCase().includes(q);
        return nameMatch || emailMatch || phoneMatch || courseMatch || locMatch;
      }

      return true;
    });
  }, [enquiries, statusFilter, searchQuery]);

  return (
    <div className="enquiry-page">
      {toastMessage && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#0f172a", color: "#fff", padding: "14px 22px", borderRadius: "10px", zIndex: 9999 }}>
          <FiCheckCircle style={{ marginRight: "8px" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="enquiry-header">
        <div>
          <h1>
            <FiClipboard /> Training & Course Enquiries
          </h1>
          <p>
            Track and manage prospective student enquiries submitted directly from the Art Classes & Training portal.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
          >
            <FiRefreshCw className={refreshing ? "spinning" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards: All 5 in One Row */}
      <div className="enquiry-stats-grid">
        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon total">
            <FiClipboard />
          </div>
          <div className="enquiry-stat-info">
            <h3>{stats.total || enquiries.length}</h3>
            <p>Total Enquiries</p>
          </div>
        </div>

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon new">
            <FiClock />
          </div>
          <div className="enquiry-stat-info">
            <h3>{stats.new}</h3>
            <p>New Enquiries</p>
          </div>
        </div>

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon contacted">
            <FiPhone />
          </div>
          <div className="enquiry-stat-info">
            <h3>{stats.contacted}</h3>
            <p>Contacted</p>
          </div>
        </div>

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon enrolled">
            <FiCheckCircle />
          </div>
          <div className="enquiry-stat-info">
            <h3>{stats.enrolled}</h3>
            <p>Enrolled Students</p>
          </div>
        </div>

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon closed">
            <FiX />
          </div>
          <div className="enquiry-stat-info">
            <h3>{stats.closed}</h3>
            <p>Closed</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="enquiry-table-card">
        {/* Toolbar */}
        <div className="enquiry-toolbar">
          <div className="enquiry-tabs">
            {["All", "New", "Contacted", "Enrolled", "Closed"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`enquiry-tab ${statusFilter === tab ? "active" : ""}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="enquiry-search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by student name, phone, course..."
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
              <p style={{ marginTop: "12px" }}>Loading course enquiries...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div style={{ padding: "50px", textAlign: "center", color: "#64748b" }}>
              <FiClipboard size={36} color="#cbd5e1" />
              <h4 style={{ margin: "10px 0 4px", color: "#1e293b" }}>No enquiries found</h4>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                Enquiries submitted via the Art Classes page modal will appear here in real time.
              </p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Student</th>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Course Enquired</th>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Contact Details</th>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Location</th>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Experience</th>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase" }}>Status</th>
                  <th style={{ padding: "14px 18px", fontSize: "0.78rem", color: "#475569", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Student */}
                    <td style={{ padding: "16px 18px" }}>
                      <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.name}</div>
                      <div style={{ color: "#64748b", fontSize: "0.8rem" }}>Age: {item.age} years</div>
                    </td>

                    {/* Course */}
                    <td style={{ padding: "16px 18px" }}>
                      <div style={{ fontWeight: 600, color: "#334155" }}>{item.courseName}</div>
                      {item.courseFee > 0 && (
                        <div style={{ color: "#059669", fontSize: "0.8rem", fontWeight: 700 }}>
                          ₹{Number(item.courseFee).toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0f172a", fontSize: "0.85rem" }}>
                        <FiPhone size={13} color="#2563eb" /> {item.phone}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "0.8rem", marginTop: "2px" }}>
                        <FiMail size={13} /> {item.email}
                      </div>
                    </td>

                    {/* Location */}
                    <td style={{ padding: "16px 18px", color: "#475569", fontSize: "0.88rem" }}>
                      <FiMapPin size={13} style={{ marginRight: "4px" }} />
                      {item.location}
                    </td>

                    {/* Experience */}
                    <td style={{ padding: "16px 18px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, background: item.experience === "Yes" ? "#eff6ff" : "#f1f5f9", color: item.experience === "Yes" ? "#2563eb" : "#64748b" }}>
                        {item.experience === "Yes" ? "Has Experience" : "Beginner"}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: "16px 18px", fontSize: "0.84rem", color: "#64748b", whiteSpace: "nowrap" }}>
                      {item.date || (item.createdAt ? item.createdAt.slice(0, 10) : "Today")}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 18px" }}>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          border: "1px solid #cbd5e1",
                          background: item.status === "New" ? "#fef3c7" : item.status === "Enrolled" ? "#ecfdf5" : item.status === "Contacted" ? "#fdf4ff" : "#f1f5f9",
                          color: item.status === "New" ? "#b45309" : item.status === "Enrolled" ? "#047857" : item.status === "Contacted" ? "#9333ea" : "#475569",
                          cursor: "pointer",
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedEnquiry(item)}
                          style={{ width: "32px", height: "32px", border: "1px solid #e2e8f0", background: "#fff", borderRadius: "6px", cursor: "pointer", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}
                          title="View Details"
                        >
                          <FiEye />
                        </button>

                        <button
                          type="button"
                          onClick={() => setEnquiryToDelete(item)}
                          style={{ width: "32px", height: "32px", border: "1px solid #fecaca", background: "#fef2f2", borderRadius: "6px", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}
                          title="Delete Enquiry"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* View Detail Modal */}
      {selectedEnquiry && (
        <div
          className="enq-modal-overlay"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="enq-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="enq-modal-header">
              <div className="enq-modal-title-group">
                <div className="enq-modal-icon-badge">
                  <FiClipboard />
                </div>
                <div>
                  <div className="enq-modal-heading-row">
                    <h3>Course Enquiry Details</h3>
                    <span className={`badge-enq ${selectedEnquiry.status ? selectedEnquiry.status.toLowerCase() : "new"}`}>
                      {selectedEnquiry.status || "New"}
                    </span>
                  </div>
                  <p className="enq-modal-subtitle">
                    ID: #{selectedEnquiry._id ? selectedEnquiry._id.slice(-6).toUpperCase() : "ENQ"} • Submitted on {selectedEnquiry.date || (selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Recent")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="enq-modal-close"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            <div className="enq-modal-body">
              {/* Student Profile Banner */}
              <div className="enq-student-banner">
                <div className="enq-student-avatar">
                  {(selectedEnquiry.name || "S").slice(0, 2).toUpperCase()}
                </div>
                <div className="enq-student-primary">
                  <h4>{selectedEnquiry.name || "Student Name"}</h4>
                  <div className="enq-chips-row">
                    <span className="enq-chip">
                      <FiUser size={12} /> {selectedEnquiry.age ? `${selectedEnquiry.age} yrs old` : "Age not specified"}
                    </span>
                    <span className="enq-chip">
                      <strong>Experience:</strong> {selectedEnquiry.experience || "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Highlight Box */}
              <div className="enq-course-box">
                <div className="enq-course-box-left">
                  <div className="enq-course-icon">
                    <FiBookOpen />
                  </div>
                  <div>
                    <span className="enq-meta-label">ENQUIRED COURSE</span>
                    <h5>{selectedEnquiry.courseName || "Art & Culture Training Course"}</h5>
                  </div>
                </div>
                {selectedEnquiry.courseFee > 0 && (
                  <div className="enq-course-fee">
                    <span className="enq-meta-label">COURSE FEE</span>
                    <strong>₹{Number(selectedEnquiry.courseFee).toLocaleString("en-IN")}</strong>
                  </div>
                )}
              </div>

              {/* Contact & Location Grid */}
              <div className="enq-details-grid">
                <div className="enq-detail-card">
                  <div className="enq-detail-icon phone">
                    <FiPhone />
                  </div>
                  <div className="enq-detail-info">
                    <span className="enq-meta-label">PHONE NUMBER</span>
                    <a href={`tel:${selectedEnquiry.phone}`} className="enq-link phone">
                      {selectedEnquiry.phone || "Not provided"}
                    </a>
                  </div>
                </div>

                <div className="enq-detail-card">
                  <div className="enq-detail-icon mail">
                    <FiMail />
                  </div>
                  <div className="enq-detail-info">
                    <span className="enq-meta-label">EMAIL ADDRESS</span>
                    <a href={`mailto:${selectedEnquiry.email}`} className="enq-link email">
                      {selectedEnquiry.email || "Not provided"}
                    </a>
                  </div>
                </div>

                <div className="enq-detail-card">
                  <div className="enq-detail-icon pin">
                    <FiMapPin />
                  </div>
                  <div className="enq-detail-info">
                    <span className="enq-meta-label">CURRENT LOCATION</span>
                    <strong className="enq-text-value">
                      {selectedEnquiry.location || "Not specified"}
                    </strong>
                  </div>
                </div>

                <div className="enq-detail-card">
                  <div className="enq-detail-icon calendar">
                    <FiCalendar />
                  </div>
                  <div className="enq-detail-info">
                    <span className="enq-meta-label">SUBMISSION DATE</span>
                    <strong className="enq-text-value">
                      {selectedEnquiry.date || (selectedEnquiry.createdAt ? new Date(selectedEnquiry.createdAt).toLocaleDateString() : "Recent")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Message / Notes */}
              <div className="enq-message-box">
                <div className="enq-message-header">
                  <FiMessageSquare />
                  <span>Student Message / Questions</span>
                </div>
                <div className="enq-message-content">
                  {selectedEnquiry.message && selectedEnquiry.message.trim() ? (
                    <p>"{selectedEnquiry.message}"</p>
                  ) : (
                    <p className="empty-message">No specific notes provided with this enquiry.</p>
                  )}
                </div>
              </div>

              {/* Quick Status Bar inside Modal */}
              <div className="enq-status-bar">
                <div className="enq-status-label">
                  <FiClock size={14} />
                  <span>Update Status:</span>
                </div>
                <div className="enq-status-actions">
                  {["New", "Contacted", "Enrolled", "Closed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`enq-status-pill ${selectedEnquiry.status === st ? "active " + st.toLowerCase() : ""}`}
                      onClick={() => handleStatusChange(selectedEnquiry._id, st)}
                      disabled={actionLoadingId === selectedEnquiry._id}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="enq-modal-footer">
              <div className="enq-footer-contacts">
                {selectedEnquiry.phone && (
                  <a href={`tel:${selectedEnquiry.phone}`} className="btn-enq-action call">
                    <FiPhone /> Call Student
                  </a>
                )}
                {selectedEnquiry.email && (
                  <a href={`mailto:${selectedEnquiry.email}`} className="btn-enq-action email">
                    <FiMail /> Send Email
                  </a>
                )}
              </div>

              <button
                type="button"
                className="btn-enq-close"
                onClick={() => setSelectedEnquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}
          onClick={() => setEnquiryToDelete(null)}
        >
          <div style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "420px", padding: "24px" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 10px", color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
              <FiAlertTriangle /> Delete Enquiry
            </h3>
            <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 20px" }}>
              Are you sure you want to delete enquiry from <strong>{enquiryToDelete.name}</strong> for <strong>{enquiryToDelete.courseName}</strong>?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setEnquiryToDelete(null)}
                style={{ padding: "9px 18px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEnquiry}
                disabled={actionLoadingId === enquiryToDelete._id}
                style={{ padding: "9px 18px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
              >
                {actionLoadingId === enquiryToDelete._id ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingCourseEnquiries;

