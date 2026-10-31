import React, { useEffect, useMemo, useState } from "react";
import {
  FiMessageSquare,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiCheck,
  FiX,
  FiEye,
  FiBookOpen,
  FiRefreshCw,
  FiCalendar,
  FiMail,
  FiUser,
  FiExternalLink,
  FiLayers,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiAlertCircle,
  FiEdit3,
} from "react-icons/fi";
import { BLOG_COMMENTS_API_URL, formatImageUrl } from "../../config/api";
import "./ReviewManagement.css";

const ReviewManagement = () => {
  const [allComments, setAllComments] = useState([]);
  const [blogsWithComments, setBlogsWithComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // View state: "all-table" (default table view) | "by-blog-table" (each blog table)
  const [viewMode, setViewMode] = useState("all-table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Draft" | "Approved" | "Rejected"
  const [expandedBlogIds, setExpandedBlogIds] = useState(new Set());

  // Modals & Action States
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Fetch all comments and grouped comments
  const fetchData = async () => {
    try {
      // 1. Fetch all flat comments
      const commentsRes = await fetch(`${BLOG_COMMENTS_API_URL}`);
      const commentsData = await commentsRes.json();

      // 2. Fetch grouped by blog
      const groupedRes = await fetch(`${BLOG_COMMENTS_API_URL}/by-blog`);
      const groupedData = await groupedRes.json();

      if (commentsData.success && Array.isArray(commentsData.data)) {
        setAllComments(commentsData.data);
      }

      if (groupedData.success && Array.isArray(groupedData.data)) {
        setBlogsWithComments(groupedData.data);
        // Expand all blogs by default in the by-blog table view
        const allIds = new Set(groupedData.data.map((b) => b._id || b.id || b.slug));
        setExpandedBlogIds(allIds);
      }
    } catch (error) {
      console.error("Error fetching reviews/comments:", error);
      showToast("Error loading comments from database");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Toggle Blog Accordion for By-Blog Table View
  const toggleBlogAccordion = (blogKey) => {
    setExpandedBlogIds((prev) => {
      const next = new Set(prev);
      if (next.has(blogKey)) {
        next.delete(blogKey);
      } else {
        next.add(blogKey);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allKeys = new Set(
      blogsWithComments.map((b) => b._id || b.id || b.slug)
    );
    setExpandedBlogIds(allKeys);
  };

  const collapseAll = () => {
    setExpandedBlogIds(new Set());
  };

  // Update Comment Status (Draft / Approved / Rejected)
  const handleUpdateStatus = async (commentId, newStatus) => {
    try {
      setActionLoadingId(commentId);
      const res = await fetch(`${BLOG_COMMENTS_API_URL}/${commentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Comment status set to "${newStatus}"`);

        // Update local flat comments state
        setAllComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, status: newStatus } : c))
        );

        // Update local grouped state
        setBlogsWithComments((prev) =>
          prev.map((b) => ({
            ...b,
            comments: (b.comments || []).map((c) =>
              c._id === commentId ? { ...c, status: newStatus } : c
            ),
          }))
        );

        if (selectedComment && selectedComment._id === commentId) {
          setSelectedComment((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        showToast(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error updating comment status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Comment
  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;
    const commentId = commentToDelete._id;

    try {
      setActionLoadingId(commentId);
      const res = await fetch(`${BLOG_COMMENTS_API_URL}/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        showToast("Comment deleted successfully");
        setCommentToDelete(null);
        if (selectedComment && selectedComment._id === commentId) {
          setSelectedComment(null);
        }

        // Remove from flat
        setAllComments((prev) => prev.filter((c) => c._id !== commentId));

        // Remove from grouped
        setBlogsWithComments((prev) =>
          prev.map((b) => ({
            ...b,
            comments: (b.comments || []).filter((c) => c._id !== commentId),
            commentsCount: Math.max(
              0,
              (b.comments || []).filter((c) => c._id !== commentId).length
            ),
          }))
        );
      } else {
        showToast(data.message || "Failed to delete comment");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error deleting comment");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Normalize status helper (treat Pending or undefined as Draft)
  const normalizeStatus = (st) => {
    if (!st || st === "Pending" || st === "Draft") return "Draft";
    return st;
  };

  // KPIs
  const stats = useMemo(() => {
    const total = allComments.length;
    const draft = allComments.filter(
      (c) => normalizeStatus(c.status) === "Draft"
    ).length;
    const approved = allComments.filter((c) => c.status === "Approved").length;
    const rejected = allComments.filter((c) => c.status === "Rejected").length;
    const blogsCount = blogsWithComments.filter(
      (b) => (b.comments || []).length > 0
    ).length;

    return { total, draft, approved, rejected, blogsCount };
  }, [allComments, blogsWithComments]);

  // Filtered comments for the Master Table View
  const filteredComments = useMemo(() => {
    return allComments.filter((c) => {
      const cStatus = normalizeStatus(c.status);

      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Draft" && cStatus === "Draft") ||
        (statusFilter === "Approved" && cStatus === "Approved") ||
        (statusFilter === "Rejected" && cStatus === "Rejected");

      if (!matchStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const author = (c.author || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      const comment = (c.comment || "").toLowerCase();
      const blogTitle = (c.blogTitle || "").toLowerCase();
      const blogSlug = (c.blogSlug || "").toLowerCase();

      return (
        author.includes(q) ||
        email.includes(q) ||
        comment.includes(q) ||
        blogTitle.includes(q) ||
        blogSlug.includes(q)
      );
    });
  }, [allComments, statusFilter, searchQuery]);

  // Filtered blogs for By-Blog Table View
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return blogsWithComments
      .map((b) => {
        const blogComments = (b.comments || []).filter((c) => {
          const cStatus = normalizeStatus(c.status);

          const matchStatus =
            statusFilter === "All" ||
            (statusFilter === "Draft" && cStatus === "Draft") ||
            (statusFilter === "Approved" && cStatus === "Approved") ||
            (statusFilter === "Rejected" && cStatus === "Rejected");

          if (!matchStatus) return false;

          if (!q) return true;
          const author = (c.author || "").toLowerCase();
          const email = (c.email || "").toLowerCase();
          const comment = (c.comment || "").toLowerCase();
          const blogTitle = (c.blogTitle || b.title || "").toLowerCase();

          return (
            author.includes(q) ||
            email.includes(q) ||
            comment.includes(q) ||
            blogTitle.includes(q)
          );
        });

        const blogTitleMatches = (b.title || "").toLowerCase().includes(q);

        return {
          ...b,
          filteredComments: blogComments,
          matchesSearch: blogTitleMatches || blogComments.length > 0,
        };
      })
      .filter((b) => {
        if (!q && statusFilter === "All") return true;
        return b.matchesSearch || b.filteredComments.length > 0;
      });
  }, [blogsWithComments, statusFilter, searchQuery]);

  return (
    <div className="ReviewMgmt-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="ReviewMgmt-toast">
          <FiCheckCircle />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="ReviewMgmt-header">
        <div>
          <span className="ReviewMgmt-subtitle">Moderation &amp; Community Feedback</span>
          <h1 className="ReviewMgmt-title">Review &amp; Blog Comment Management</h1>
          <p className="ReviewMgmt-desc">
            All user comments from blogs are submitted as <strong>Draft</strong> by default. Review, approve, or reject comments table-wise below.
          </p>
        </div>

        <div className="ReviewMgmt-header-actions">
          <button
            type="button"
            className="ReviewMgmt-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            title="Refresh database records"
          >
            <FiRefreshCw className={refreshing ? "spin-icon" : ""} />
            <span>{refreshing ? "Syncing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* KPI STAT CARDS */}
      <div className="ReviewMgmt-kpi-grid">
        <div
          className={`ReviewMgmt-kpi-card ${statusFilter === "All" ? "kpi-active" : ""}`}
          onClick={() => setStatusFilter("All")}
          style={{ cursor: "pointer" }}
        >
          <div className="ReviewMgmt-kpi-icon ReviewMgmt-kpi-icon--total">
            <FiMessageSquare />
          </div>
          <div className="ReviewMgmt-kpi-content">
            <span className="ReviewMgmt-kpi-label">Total Comments</span>
            <h3 className="ReviewMgmt-kpi-val">{stats.total}</h3>
            <span className="ReviewMgmt-kpi-hint">All submitted reflections</span>
          </div>
        </div>

        <div
          className={`ReviewMgmt-kpi-card ${statusFilter === "Draft" ? "kpi-active" : ""}`}
          onClick={() => setStatusFilter("Draft")}
          style={{ cursor: "pointer" }}
        >
          <div className="ReviewMgmt-kpi-icon ReviewMgmt-kpi-icon--draft">
            <FiClock />
          </div>
          <div className="ReviewMgmt-kpi-content">
            <span className="ReviewMgmt-kpi-label">Draft (Pending)</span>
            <h3 className="ReviewMgmt-kpi-val">{stats.draft}</h3>
            <span className="ReviewMgmt-kpi-hint">Awaiting admin approval</span>
          </div>
        </div>

        <div
          className={`ReviewMgmt-kpi-card ${statusFilter === "Approved" ? "kpi-active" : ""}`}
          onClick={() => setStatusFilter("Approved")}
          style={{ cursor: "pointer" }}
        >
          <div className="ReviewMgmt-kpi-icon ReviewMgmt-kpi-icon--approved">
            <FiCheckCircle />
          </div>
          <div className="ReviewMgmt-kpi-content">
            <span className="ReviewMgmt-kpi-label">Approved Live</span>
            <h3 className="ReviewMgmt-kpi-val">{stats.approved}</h3>
            <span className="ReviewMgmt-kpi-hint">Visible on blog page</span>
          </div>
        </div>

        <div
          className={`ReviewMgmt-kpi-card ${statusFilter === "Rejected" ? "kpi-active" : ""}`}
          onClick={() => setStatusFilter("Rejected")}
          style={{ cursor: "pointer" }}
        >
          <div className="ReviewMgmt-kpi-icon ReviewMgmt-kpi-icon--rejected">
            <FiXCircle />
          </div>
          <div className="ReviewMgmt-kpi-content">
            <span className="ReviewMgmt-kpi-label">Rejected</span>
            <h3 className="ReviewMgmt-kpi-val">{stats.rejected}</h3>
            <span className="ReviewMgmt-kpi-hint">Filtered out / spam</span>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR: STATUS TABS, VIEW MODES, SEARCH */}
      <div className="ReviewMgmt-controls">
        {/* Status Pills / Quick Filter Tabs */}
        <div className="ReviewMgmt-status-tabs">
          <button
            type="button"
            className={`ReviewMgmt-status-tab-btn ${statusFilter === "All" ? "active" : ""}`}
            onClick={() => setStatusFilter("All")}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            className={`ReviewMgmt-status-tab-btn draft ${statusFilter === "Draft" ? "active" : ""}`}
            onClick={() => setStatusFilter("Draft")}
          >
            <span className="dot-indicator dot-draft" />
            Drafts ({stats.draft})
          </button>
          <button
            type="button"
            className={`ReviewMgmt-status-tab-btn approved ${statusFilter === "Approved" ? "active" : ""}`}
            onClick={() => setStatusFilter("Approved")}
          >
            <span className="dot-indicator dot-approved" />
            Approved ({stats.approved})
          </button>
          <button
            type="button"
            className={`ReviewMgmt-status-tab-btn rejected ${statusFilter === "Rejected" ? "active" : ""}`}
            onClick={() => setStatusFilter("Rejected")}
          >
            <span className="dot-indicator dot-rejected" />
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* View Layout Toggle: Master Table vs Grouped by Blog Table */}
        <div className="ReviewMgmt-view-toggle">
          <button
            type="button"
            className={`ReviewMgmt-toggle-btn ${viewMode === "all-table" ? "active" : ""}`}
            onClick={() => setViewMode("all-table")}
            title="Single unified comments table"
          >
            <FiFileText />
            <span>Master Table ({filteredComments.length})</span>
          </button>
          <button
            type="button"
            className={`ReviewMgmt-toggle-btn ${viewMode === "by-blog-table" ? "active" : ""}`}
            onClick={() => setViewMode("by-blog-table")}
            title="Show comments table under each blog"
          >
            <FiLayers />
            <span>By Blog Tables ({filteredBlogs.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="ReviewMgmt-search-box">
          <FiSearch className="ReviewMgmt-search-icon" />
          <input
            type="text"
            placeholder="Search author, email, comment, blog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="ReviewMgmt-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: MASTER TABLE VIEW (TABLE WISE SHOW COMMENT)       */}
      {/* ======================================================== */}
      {viewMode === "all-table" && (
        <div className="ReviewMgmt-table-wrapper">
          <div className="ReviewMgmt-table-header-info">
            <div className="ReviewMgmt-table-info-left">
              <h3>All Comments ({filteredComments.length})</h3>
              <span className="ReviewMgmt-table-hint">
                Table view of all blog comments and reviews
              </span>
            </div>
            {statusFilter !== "All" && (
              <span className="ReviewMgmt-active-filter-badge">
                Filtered: {statusFilter}
                <FiX onClick={() => setStatusFilter("All")} style={{ cursor: "pointer", marginLeft: 4 }} />
              </span>
            )}
          </div>

          {loading ? (
            <div className="ReviewMgmt-loading-state">
              <FiRefreshCw className="spin-icon" />
              <span>Loading blog comments from database...</span>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="ReviewMgmt-empty-state">
              <FiMessageSquare className="ReviewMgmt-empty-icon" />
              <h3>No Comments Found</h3>
              <p>No comments match your search or filter selection.</p>
            </div>
          ) : (
            <div className="ReviewMgmt-responsive-table">
              <table className="ReviewMgmt-data-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>#</th>
                    <th style={{ minWidth: "220px" }}>Blog / Article</th>
                    <th style={{ minWidth: "180px" }}>Author &amp; Email</th>
                    <th style={{ minWidth: "320px" }}>Comment Message</th>
                    <th style={{ minWidth: "120px" }}>Date</th>
                    <th style={{ minWidth: "110px", textAlign: "center" }}>Status</th>
                    <th style={{ minWidth: "160px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComments.map((c, index) => {
                    const statusNorm = normalizeStatus(c.status);
                    const authorInitials =
                      c.avatar ||
                      (c.author
                        ? c.author
                            .trim()
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "AC");

                    const displayDate = c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : c.date || "Recent";

                    return (
                      <tr key={c._id} className={`row-status-${statusNorm.toLowerCase()}`}>
                        {/* 1. Index */}
                        <td style={{ textAlign: "center", color: "#9c8e80", fontWeight: "600" }}>
                          {index + 1}
                        </td>

                        {/* 2. Blog / Article */}
                        <td>
                          <div className="ReviewMgmt-article-cell">
                            <span className="ReviewMgmt-article-title" title={c.blogTitle}>
                              {c.blogTitle || "Blog Article"}
                            </span>
                            {c.blogSlug && (
                              <a
                                href={`http://localhost:5173/blog/${c.blogSlug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="ReviewMgmt-article-slug-link"
                                title="Open article on website"
                              >
                                <span>/{c.blogSlug}</span>
                                <FiExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* 3. Author & Email */}
                        <td>
                          <div className="ReviewMgmt-user-cell">
                            <div className="ReviewMgmt-user-avatar">{authorInitials}</div>
                            <div className="ReviewMgmt-user-meta">
                              <span className="ReviewMgmt-user-name">{c.author}</span>
                              <span className="ReviewMgmt-user-email">
                                <FiMail size={11} /> {c.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Comment Message */}
                        <td>
                          <div className="ReviewMgmt-comment-cell" title={c.comment}>
                            <p className="ReviewMgmt-comment-bubble">{c.comment}</p>
                          </div>
                        </td>

                        {/* 5. Date */}
                        <td>
                          <span className="ReviewMgmt-date-chip">
                            <FiCalendar size={12} /> {displayDate}
                          </span>
                        </td>

                        {/* 6. Status Badge */}
                        <td style={{ textAlign: "center" }}>
                          <span className={`ReviewMgmt-status-badge ${statusNorm.toLowerCase()}`}>
                            {statusNorm === "Draft" && <FiClock size={11} />}
                            {statusNorm === "Approved" && <FiCheck size={11} />}
                            {statusNorm === "Rejected" && <FiX size={11} />}
                            <span>{statusNorm}</span>
                          </span>
                        </td>

                        {/* 7. Action Buttons */}
                        <td>
                          <div className="ReviewMgmt-table-action-group">
                            {/* Approve button (if not approved) */}
                            {statusNorm !== "Approved" && (
                              <button
                                type="button"
                                className="ReviewMgmt-act-btn act-approve"
                                onClick={() => handleUpdateStatus(c._id, "Approved")}
                                disabled={actionLoadingId === c._id}
                                title="Approve comment (publish live)"
                              >
                                <FiCheck />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Draft button (if approved or rejected, put back to draft) */}
                            {statusNorm !== "Draft" && (
                              <button
                                type="button"
                                className="ReviewMgmt-act-btn act-draft"
                                onClick={() => handleUpdateStatus(c._id, "Draft")}
                                disabled={actionLoadingId === c._id}
                                title="Move back to Draft"
                              >
                                <FiClock />
                                <span>Draft</span>
                              </button>
                            )}

                            {/* Reject button (if not rejected) */}
                            {statusNorm !== "Rejected" && (
                              <button
                                type="button"
                                className="ReviewMgmt-act-btn act-reject"
                                onClick={() => handleUpdateStatus(c._id, "Rejected")}
                                disabled={actionLoadingId === c._id}
                                title="Reject comment"
                              >
                                <FiX />
                              </button>
                            )}

                            {/* View details */}
                            <button
                              type="button"
                              className="ReviewMgmt-act-btn act-view"
                              onClick={() => setSelectedComment(c)}
                              title="View full comment"
                            >
                              <FiEye />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="ReviewMgmt-act-btn act-delete"
                              onClick={() => setCommentToDelete(c)}
                              title="Delete permanently"
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
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: BY BLOG TABLE VIEW (EACH BLOG AND ITS COMMENT TABLE) */}
      {/* ======================================================== */}
      {viewMode === "by-blog-table" && (
        <div className="ReviewMgmt-by-blog-container">
          <div className="ReviewMgmt-by-blog-header-bar">
            <div>
              <h3>Each Blog and Its Comments Table</h3>
              <p>Expand any article to view its comments in a dedicated table.</p>
            </div>
            <div className="ReviewMgmt-accordion-tools">
              <button
                type="button"
                className="ReviewMgmt-tool-btn"
                onClick={expandAll}
              >
                Expand All
              </button>
              <button
                type="button"
                className="ReviewMgmt-tool-btn"
                onClick={collapseAll}
              >
                Collapse All
              </button>
            </div>
          </div>

          {loading ? (
            <div className="ReviewMgmt-loading-state">
              <FiRefreshCw className="spin-icon" />
              <span>Loading blog comments from database...</span>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="ReviewMgmt-empty-state">
              <FiMessageSquare className="ReviewMgmt-empty-icon" />
              <h3>No Blog Articles Found</h3>
              <p>No blog articles match your current search or status filter.</p>
            </div>
          ) : (
            <div className="ReviewMgmt-blogs-accordion-list">
              {filteredBlogs.map((blog) => {
                const blogKey = blog._id || blog.id || blog.slug;
                const isExpanded = expandedBlogIds.has(blogKey);
                const commentsList = blog.filteredComments || blog.comments || [];
                const blogImg = formatImageUrl(blog.mainImage);

                return (
                  <div
                    key={blogKey}
                    className={`ReviewMgmt-blog-table-card ${isExpanded ? "open" : ""}`}
                  >
                    {/* Blog Card Header */}
                    <div
                      className="ReviewMgmt-blog-card-header"
                      onClick={() => toggleBlogAccordion(blogKey)}
                    >
                      <div className="ReviewMgmt-blog-card-left">
                        {blogImg ? (
                          <img
                            src={blogImg}
                            alt={blog.title}
                            className="ReviewMgmt-blog-cover-img"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="ReviewMgmt-blog-cover-placeholder">
                            <FiBookOpen />
                          </div>
                        )}

                        <div className="ReviewMgmt-blog-card-details">
                          <div className="ReviewMgmt-blog-tags-line">
                            <span className="ReviewMgmt-cat-pill">
                              {blog.category || "Art & Culture"}
                            </span>
                            {blog.slug && (
                              <span className="ReviewMgmt-slug-pill">
                                /{blog.slug}
                              </span>
                            )}
                          </div>
                          <h2 className="ReviewMgmt-blog-heading">{blog.title}</h2>
                          <span className="ReviewMgmt-blog-byline">
                            Author: {blog.authorName || "Art & Culture Editorial"}
                          </span>
                        </div>
                      </div>

                      <div className="ReviewMgmt-blog-card-right">
                        <span className="ReviewMgmt-blog-comments-count-pill">
                          <FiMessageSquare />
                          <strong>{commentsList.length}</strong>{" "}
                          {commentsList.length === 1 ? "Comment" : "Comments"}
                        </span>

                        <a
                          href={`http://localhost:5173/blog/${blog.slug || blog._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ReviewMgmt-live-link-btn"
                          onClick={(e) => e.stopPropagation()}
                          title="View live blog"
                        >
                          <FiExternalLink />
                          <span>View Article</span>
                        </a>

                        <button
                          type="button"
                          className="ReviewMgmt-accordion-arrow"
                          aria-label="Toggle blog comments"
                        >
                          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>
                    </div>

                    {/* Blog Comments Table (Accordion Body) */}
                    {isExpanded && (
                      <div className="ReviewMgmt-blog-table-body">
                        {commentsList.length === 0 ? (
                          <div className="ReviewMgmt-no-comments-banner">
                            <FiClock size={16} />
                            <span>No comments posted for this article yet.</span>
                          </div>
                        ) : (
                          <div className="ReviewMgmt-responsive-table">
                            <table className="ReviewMgmt-data-table ReviewMgmt-inner-table">
                              <thead>
                                <tr>
                                  <th style={{ width: "45px", textAlign: "center" }}>#</th>
                                  <th style={{ minWidth: "180px" }}>Author &amp; Email</th>
                                  <th style={{ minWidth: "300px" }}>Comment Message</th>
                                  <th style={{ minWidth: "120px" }}>Submitted</th>
                                  <th style={{ minWidth: "110px", textAlign: "center" }}>Status</th>
                                  <th style={{ minWidth: "160px", textAlign: "right" }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {commentsList.map((c, idx) => {
                                  const statusNorm = normalizeStatus(c.status);
                                  const authorInitials =
                                    c.avatar ||
                                    (c.author
                                      ? c.author
                                          .trim()
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase()
                                      : "AC");

                                  const displayDate = c.createdAt
                                    ? new Date(c.createdAt).toLocaleDateString(
                                        "en-IN",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        }
                                      )
                                    : c.date || "Recent";

                                  return (
                                    <tr
                                      key={c._id}
                                      className={`row-status-${statusNorm.toLowerCase()}`}
                                    >
                                      {/* Index */}
                                      <td
                                        style={{
                                          textAlign: "center",
                                          color: "#9c8e80",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {idx + 1}
                                      </td>

                                      {/* Author & Email */}
                                      <td>
                                        <div className="ReviewMgmt-user-cell">
                                          <div className="ReviewMgmt-user-avatar">
                                            {authorInitials}
                                          </div>
                                          <div className="ReviewMgmt-user-meta">
                                            <span className="ReviewMgmt-user-name">
                                              {c.author}
                                            </span>
                                            <span className="ReviewMgmt-user-email">
                                              <FiMail size={11} /> {c.email}
                                            </span>
                                          </div>
                                        </div>
                                      </td>

                                      {/* Comment */}
                                      <td>
                                        <div
                                          className="ReviewMgmt-comment-cell"
                                          title={c.comment}
                                        >
                                          <p className="ReviewMgmt-comment-bubble">
                                            {c.comment}
                                          </p>
                                        </div>
                                      </td>

                                      {/* Date */}
                                      <td>
                                        <span className="ReviewMgmt-date-chip">
                                          <FiCalendar size={12} /> {displayDate}
                                        </span>
                                      </td>

                                      {/* Status */}
                                      <td style={{ textAlign: "center" }}>
                                        <span
                                          className={`ReviewMgmt-status-badge ${statusNorm.toLowerCase()}`}
                                        >
                                          {statusNorm === "Draft" && <FiClock size={11} />}
                                          {statusNorm === "Approved" && <FiCheck size={11} />}
                                          {statusNorm === "Rejected" && <FiX size={11} />}
                                          <span>{statusNorm}</span>
                                        </span>
                                      </td>

                                      {/* Actions */}
                                      <td>
                                        <div className="ReviewMgmt-table-action-group">
                                          {statusNorm !== "Approved" && (
                                            <button
                                              type="button"
                                              className="ReviewMgmt-act-btn act-approve"
                                              onClick={() =>
                                                handleUpdateStatus(c._id, "Approved")
                                              }
                                              disabled={actionLoadingId === c._id}
                                              title="Approve comment"
                                            >
                                              <FiCheck />
                                              <span>Approve</span>
                                            </button>
                                          )}

                                          {statusNorm !== "Draft" && (
                                            <button
                                              type="button"
                                              className="ReviewMgmt-act-btn act-draft"
                                              onClick={() =>
                                                handleUpdateStatus(c._id, "Draft")
                                              }
                                              disabled={actionLoadingId === c._id}
                                              title="Move back to Draft"
                                            >
                                              <FiClock />
                                              <span>Draft</span>
                                            </button>
                                          )}

                                          {statusNorm !== "Rejected" && (
                                            <button
                                              type="button"
                                              className="ReviewMgmt-act-btn act-reject"
                                              onClick={() =>
                                                handleUpdateStatus(c._id, "Rejected")
                                              }
                                              disabled={actionLoadingId === c._id}
                                              title="Reject comment"
                                            >
                                              <FiX />
                                            </button>
                                          )}

                                          <button
                                            type="button"
                                            className="ReviewMgmt-act-btn act-view"
                                            onClick={() => setSelectedComment(c)}
                                            title="View details"
                                          >
                                            <FiEye />
                                          </button>

                                          <button
                                            type="button"
                                            className="ReviewMgmt-act-btn act-delete"
                                            onClick={() => setCommentToDelete(c)}
                                            title="Delete permanently"
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
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VIEW COMMENT DETAILS                              */}
      {/* ======================================================== */}
      {selectedComment && (
        <div
          className="ReviewMgmt-modal-overlay"
          onClick={() => setSelectedComment(null)}
        >
          <div
            className="ReviewMgmt-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ReviewMgmt-modal-header">
              <div className="ReviewMgmt-modal-title-wrap">
                <FiMessageSquare className="ReviewMgmt-modal-header-icon" />
                <h3>Review &amp; Comment Details</h3>
              </div>
              <button
                type="button"
                className="ReviewMgmt-modal-close"
                onClick={() => setSelectedComment(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="ReviewMgmt-modal-body">
              {/* Blog Reference */}
              <div className="ReviewMgmt-detail-section">
                <label>Associated Blog Article</label>
                <div className="ReviewMgmt-detail-blog-box">
                  <h4>{selectedComment.blogTitle || "Blog Article"}</h4>
                  {selectedComment.blogSlug && (
                    <a
                      href={`http://localhost:5173/blog/${selectedComment.blogSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ReviewMgmt-detail-slug-link"
                    >
                      <span>/{selectedComment.blogSlug}</span>
                      <FiExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {/* Author & Email */}
              <div className="ReviewMgmt-detail-grid-2">
                <div className="ReviewMgmt-detail-section">
                  <label>Author</label>
                  <div className="ReviewMgmt-detail-val">
                    <FiUser size={14} />
                    <span>{selectedComment.author}</span>
                  </div>
                </div>

                <div className="ReviewMgmt-detail-section">
                  <label>Email Address</label>
                  <div className="ReviewMgmt-detail-val">
                    <FiMail size={14} />
                    <span>{selectedComment.email}</span>
                  </div>
                </div>
              </div>

              {/* Status & Date */}
              <div className="ReviewMgmt-detail-grid-2">
                <div className="ReviewMgmt-detail-section">
                  <label>Current Status</label>
                  <div>
                    <span
                      className={`ReviewMgmt-status-badge ${normalizeStatus(selectedComment.status).toLowerCase()}`}
                    >
                      {normalizeStatus(selectedComment.status)}
                    </span>
                  </div>
                </div>

                <div className="ReviewMgmt-detail-section">
                  <label>Submitted Date</label>
                  <div className="ReviewMgmt-detail-val">
                    <FiCalendar size={14} />
                    <span>
                      {selectedComment.createdAt
                        ? new Date(selectedComment.createdAt).toLocaleString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : selectedComment.date || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Comment */}
              <div className="ReviewMgmt-detail-section">
                <label>Comment Message</label>
                <div className="ReviewMgmt-detail-comment-box">
                  {selectedComment.comment}
                </div>
              </div>
            </div>

            <div className="ReviewMgmt-modal-footer">
              <div className="ReviewMgmt-modal-status-buttons">
                {normalizeStatus(selectedComment.status) !== "Approved" && (
                  <button
                    type="button"
                    className="ReviewMgmt-act-btn act-approve"
                    onClick={() =>
                      handleUpdateStatus(selectedComment._id, "Approved")
                    }
                  >
                    <FiCheck /> Approve Live
                  </button>
                )}
                {normalizeStatus(selectedComment.status) !== "Draft" && (
                  <button
                    type="button"
                    className="ReviewMgmt-act-btn act-draft"
                    onClick={() =>
                      handleUpdateStatus(selectedComment._id, "Draft")
                    }
                  >
                    <FiClock /> Set as Draft
                  </button>
                )}
                {normalizeStatus(selectedComment.status) !== "Rejected" && (
                  <button
                    type="button"
                    className="ReviewMgmt-act-btn act-reject"
                    onClick={() =>
                      handleUpdateStatus(selectedComment._id, "Rejected")
                    }
                  >
                    <FiX /> Reject
                  </button>
                )}
              </div>

              <button
                type="button"
                className="ReviewMgmt-modal-btn-close"
                onClick={() => setSelectedComment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION                               */}
      {/* ======================================================== */}
      {commentToDelete && (
        <div
          className="ReviewMgmt-modal-overlay"
          onClick={() => setCommentToDelete(null)}
        >
          <div
            className="ReviewMgmt-modal-card ReviewMgmt-modal-delete"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ReviewMgmt-delete-icon-wrap">
              <FiTrash2 />
            </div>
            <h3>Delete Comment Permanently?</h3>
            <p>
              Are you sure you want to delete this comment by{" "}
              <strong>{commentToDelete.author}</strong>? This action will remove the
              review from MongoDB and update the blog&apos;s comment count.
            </p>

            <div className="ReviewMgmt-delete-preview">
              &quot;{commentToDelete.comment}&quot;
            </div>

            <div className="ReviewMgmt-delete-actions">
              <button
                type="button"
                className="ReviewMgmt-btn-cancel"
                onClick={() => setCommentToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ReviewMgmt-btn-danger"
                onClick={handleDeleteConfirm}
                disabled={actionLoadingId === commentToDelete._id}
              >
                {actionLoadingId === commentToDelete._id
                  ? "Deleting..."
                  : "Yes, Delete Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
