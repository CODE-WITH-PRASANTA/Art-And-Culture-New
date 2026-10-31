import React, { useState, useEffect, useMemo } from "react";
import {
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiSearch,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiRefreshCw,
  FiStar,
  FiUser,
  FiMail,
  FiCalendar,
  FiAlertTriangle,
} from "react-icons/fi";
import { FEEDBACK_API_URL } from "../../config/api";
import "./Feedback.css";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Modals
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(FEEDBACK_API_URL);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setFeedbacks(data.data);
        if (data.stats) {
          setStats(data.stats);
        } else {
          // Fallback stats computation
          setStats({
            total: data.data.length,
            draft: data.data.filter((f) => f.status === "Draft").length,
            approved: data.data.filter((f) => f.status === "Approved").length,
            rejected: data.data.filter((f) => f.status === "Rejected").length,
          });
        }
      } else {
        setFeedbacks([]);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      showToast("Unable to load feedbacks from database");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  // Change Status Handler
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoadingId(id);
      const res = await fetch(`${FEEDBACK_API_URL}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Feedback marked as ${newStatus} successfully`);
        // Update local state
        setFeedbacks((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
        // Refresh counts
        fetchFeedbacks();
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        showToast(data.message || "Failed to update feedback status");
      }
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Network error updating status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Feedback Handler
  const handleDeleteFeedback = async () => {
    if (!itemToDelete) return;

    try {
      setActionLoadingId(itemToDelete._id);
      const res = await fetch(`${FEEDBACK_API_URL}/${itemToDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Feedback deleted successfully");
        setFeedbacks((prev) => prev.filter((item) => item._id !== itemToDelete._id));
        fetchFeedbacks();
        setItemToDelete(null);
        if (selectedFeedback && selectedFeedback._id === itemToDelete._id) {
          setSelectedFeedback(null);
        }
      } else {
        showToast(data.message || "Failed to delete feedback");
      }
    } catch (err) {
      console.error("Delete feedback error:", err);
      showToast("Network error deleting feedback");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      // 1. Status Filter
      if (statusFilter !== "All" && item.status !== statusFilter) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const nameMatch = (item.name || "").toLowerCase().includes(query);
        const emailMatch = (item.email || "").toLowerCase().includes(query);
        const commentMatch = (item.comment || "").toLowerCase().includes(query);
        const titleMatch = (item.title || "").toLowerCase().includes(query);
        return nameMatch || emailMatch || commentMatch || titleMatch;
      }

      return true;
    });
  }, [feedbacks, statusFilter, searchQuery]);

  // Average rating calculation
  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return "5.0";
    const sum = feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    return (sum / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  return (
    <div className="feedback-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="feedback-toast">
          <FiCheckCircle />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="feedback-header">
        <div className="feedback-header-left">
          <h1>
            <FiMessageSquare /> Feedback Management
          </h1>
          <p>
            Curate customer reviews submitted for the "Beautiful Art Collection". Approved feedback displays on the public website.
          </p>
        </div>

        <div className="feedback-header-actions">
          <button
            type="button"
            className="feedback-btn-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh list"
          >
            <FiRefreshCw className={refreshing ? "spinning" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="feedback-stats-grid">
        <div className="feedback-stat-card">
          <div className="feedback-stat-icon total">
            <FiMessageSquare />
          </div>
          <div className="feedback-stat-info">
            <h3>{stats.total || feedbacks.length}</h3>
            <p>Total Feedbacks</p>
          </div>
        </div>

        <div className="feedback-stat-card">
          <div className="feedback-stat-icon draft">
            <FiClock />
          </div>
          <div className="feedback-stat-info">
            <h3>{stats.draft}</h3>
            <p>Pending / Draft</p>
          </div>
        </div>

        <div className="feedback-stat-card">
          <div className="feedback-stat-icon approved">
            <FiCheckCircle />
          </div>
          <div className="feedback-stat-info">
            <h3>{stats.approved}</h3>
            <p>Approved (Published)</p>
          </div>
        </div>

        <div className="feedback-stat-card">
          <div className="feedback-stat-icon rejected">
            <FiXCircle />
          </div>
          <div className="feedback-stat-info">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>

        <div className="feedback-stat-card">
          <div className="feedback-stat-icon rating">
            <FiStar />
          </div>
          <div className="feedback-stat-info">
            <h3>{averageRating} ★</h3>
            <p>Average Patron Rating</p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="feedback-main-card">
        {/* Toolbar: Filters and Search */}
        <div className="feedback-toolbar">
          <div className="feedback-tabs">
            <button
              type="button"
              className={`feedback-tab ${statusFilter === "All" ? "active" : ""}`}
              onClick={() => setStatusFilter("All")}
            >
              All
              <span className="feedback-tab-count">{feedbacks.length}</span>
            </button>

            <button
              type="button"
              className={`feedback-tab draft-tab ${statusFilter === "Draft" ? "active" : ""}`}
              onClick={() => setStatusFilter("Draft")}
            >
              Drafts
              <span className="feedback-tab-count">{stats.draft}</span>
            </button>

            <button
              type="button"
              className={`feedback-tab approved-tab ${statusFilter === "Approved" ? "active" : ""}`}
              onClick={() => setStatusFilter("Approved")}
            >
              Approved
              <span className="feedback-tab-count">{stats.approved}</span>
            </button>

            <button
              type="button"
              className={`feedback-tab rejected-tab ${statusFilter === "Rejected" ? "active" : ""}`}
              onClick={() => setStatusFilter("Rejected")}
            >
              Rejected
              <span className="feedback-tab-count">{stats.rejected}</span>
            </button>
          </div>

          <div className="feedback-search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by patron name, email or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="feedback-table-wrapper">
          {loading ? (
            <div className="feedback-empty">
              <FiRefreshCw className="feedback-empty-icon spinning" />
              <h4>Loading feedbacks...</h4>
              <p>Connecting to database, please wait</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="feedback-empty">
              <FiMessageSquare className="feedback-empty-icon" />
              <h4>No feedbacks found</h4>
              <p>
                {searchQuery || statusFilter !== "All"
                  ? "Try resetting filters or search terms."
                  : "New customer reviews submitted on the homepage will appear here as Drafts."}
              </p>
            </div>
          ) : (
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Collection</th>
                  <th>Rating</th>
                  <th>Feedback Comment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((item) => {
                  const initials = (item.name || "Patron")
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n) => n[0].toUpperCase())
                    .join("");

                  return (
                    <tr key={item._id}>
                      {/* Customer Info */}
                      <td>
                        <div className="feedback-author-cell">
                          <div className="feedback-avatar">
                            {item.avatar ? (
                              <img
                                src={item.avatar}
                                alt={item.name}
                                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                              />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="feedback-author-details">
                            <span className="feedback-author-name">{item.name}</span>
                            <span className="feedback-author-email">{item.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td style={{ fontWeight: 500, color: "#334155" }}>
                        {item.title || "Beautiful Art Collection!"}
                      </td>

                      {/* Rating */}
                      <td>
                        <div className="feedback-stars-row">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <FiStar key={i} fill="#eab308" color="#eab308" />
                          ))}
                          <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "4px" }}>
                            ({item.rating || 5})
                          </span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td>
                        <div className="feedback-comment-cell">
                          <p className="feedback-comment-text" title={item.comment}>
                            "{item.comment}"
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ fontSize: "0.84rem", color: "#64748b", whiteSpace: "nowrap" }}>
                        {item.date || (item.createdAt ? item.createdAt.slice(0, 10) : "Today")}
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`feedback-status-badge ${item.status.toLowerCase()}`}>
                          <span className="feedback-status-dot" />
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="feedback-actions" style={{ justifyContent: "flex-end" }}>
                          {/* View details */}
                          <button
                            type="button"
                            className="fb-action-btn view"
                            title="View Feedback Details"
                            onClick={() => setSelectedFeedback(item)}
                          >
                            <FiEye />
                          </button>

                          {/* Approve (if not already approved) */}
                          {item.status !== "Approved" && (
                            <button
                              type="button"
                              className="fb-action-btn approve"
                              title="Approve & Publish to Homepage"
                              disabled={actionLoadingId === item._id}
                              onClick={() => handleUpdateStatus(item._id, "Approved")}
                            >
                              <FiCheck />
                            </button>
                          )}

                          {/* Reject (if not already rejected) */}
                          {item.status !== "Rejected" && (
                            <button
                              type="button"
                              className="fb-action-btn reject"
                              title="Reject Feedback"
                              disabled={actionLoadingId === item._id}
                              onClick={() => handleUpdateStatus(item._id, "Rejected")}
                            >
                              <FiX />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            className="fb-action-btn delete"
                            title="Delete Feedback"
                            disabled={actionLoadingId === item._id}
                            onClick={() => setItemToDelete(item)}
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

      {/* ========================================================
          MODAL: VIEW FULL FEEDBACK DETAILS
      ======================================================== */}
      {selectedFeedback && (
        <div className="feedback-modal-backdrop" onClick={() => setSelectedFeedback(null)}>
          <div className="feedback-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <h3>Customer Feedback Details</h3>
              <button
                type="button"
                className="feedback-modal-close"
                onClick={() => setSelectedFeedback(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="feedback-modal-body">
              <div className="feedback-detail-row">
                <div className="feedback-detail-label">Customer Name & Contact</div>
                <div className="feedback-detail-value" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div className="feedback-avatar">
                    {(selectedFeedback.name || "AC").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <strong>{selectedFeedback.name}</strong>
                    <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      {selectedFeedback.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="feedback-detail-row">
                <div className="feedback-detail-label">Collection / Heading</div>
                <div className="feedback-detail-value">
                  {selectedFeedback.title || "Beautiful Art Collection!"}
                </div>
              </div>

              <div className="feedback-detail-row">
                <div className="feedback-detail-label">Patron Rating</div>
                <div className="feedback-detail-value">
                  <div className="feedback-stars-row">
                    {Array.from({ length: selectedFeedback.rating || 5 }).map((_, i) => (
                      <FiStar key={i} fill="#eab308" color="#eab308" size={18} />
                    ))}
                    <span style={{ marginLeft: "8px", fontWeight: 600 }}>
                      {selectedFeedback.rating || 5} out of 5 Stars
                    </span>
                  </div>
                </div>
              </div>

              <div className="feedback-detail-row">
                <div className="feedback-detail-label">Feedback Comment</div>
                <div
                  className="feedback-detail-value"
                  style={{
                    background: "#f8fafc",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontStyle: "italic",
                  }}
                >
                  "{selectedFeedback.comment}"
                </div>
              </div>

              <div className="feedback-detail-row" style={{ display: "flex", gap: "24px" }}>
                <div>
                  <div className="feedback-detail-label">Date Submitted</div>
                  <div className="feedback-detail-value">
                    {selectedFeedback.date || (selectedFeedback.createdAt ? selectedFeedback.createdAt.slice(0, 10) : "N/A")}
                  </div>
                </div>
                <div>
                  <div className="feedback-detail-label">Current Status</div>
                  <div className="feedback-detail-value">
                    <span className={`feedback-status-badge ${selectedFeedback.status.toLowerCase()}`}>
                      <span className="feedback-status-dot" />
                      {selectedFeedback.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="feedback-modal-footer">
              {selectedFeedback.status !== "Approved" && (
                <button
                  type="button"
                  className="fb-btn-approve-primary"
                  onClick={() => handleUpdateStatus(selectedFeedback._id, "Approved")}
                >
                  <FiCheck style={{ marginRight: "6px" }} /> Approve & Publish
                </button>
              )}

              {selectedFeedback.status !== "Rejected" && (
                <button
                  type="button"
                  className="fb-btn-secondary"
                  onClick={() => handleUpdateStatus(selectedFeedback._id, "Rejected")}
                >
                  <FiX style={{ marginRight: "6px" }} /> Reject
                </button>
              )}

              <button
                type="button"
                className="fb-btn-secondary"
                onClick={() => setSelectedFeedback(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: DELETE CONFIRMATION
      ======================================================== */}
      {itemToDelete && (
        <div className="feedback-modal-backdrop" onClick={() => setItemToDelete(null)}>
          <div className="feedback-modal-box" style={{ maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dc2626" }}>
                <FiAlertTriangle /> Confirm Deletion
              </h3>
              <button
                type="button"
                className="feedback-modal-close"
                onClick={() => setItemToDelete(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="feedback-modal-body">
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#334155", lineHeight: 1.5 }}>
                Are you sure you want to permanently delete feedback from <strong>{itemToDelete.name}</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="feedback-modal-footer">
              <button
                type="button"
                className="fb-btn-secondary"
                onClick={() => setItemToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="fb-btn-danger"
                onClick={handleDeleteFeedback}
                disabled={actionLoadingId === itemToDelete._id}
              >
                {actionLoadingId === itemToDelete._id ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;

