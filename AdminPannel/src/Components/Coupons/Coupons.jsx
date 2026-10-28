import React, { useEffect, useMemo, useState } from "react";
import {
  FiTag,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPlus,
  FiSearch,
  FiCalendar,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";

import "./Coupons.css";

import { COUPONS_API_URL as API_URL } from "../../config/api";

/* ========================================
   AUTO-GENERATE COUPON CODE
======================================== */

const generateCouponCode = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let randomCode = "";

  for (let i = 0; i < 6; i++) {
    randomCode += characters[
      Math.floor(Math.random() * characters.length)
    ];
  }

  return `ART-${randomCode}`;
};

/* ========================================
   EMPTY FORM
======================================== */

const emptyForm = {
  code: "",
  type: "Percentage (%)",
  value: "",
  start: new Date().toISOString().slice(0, 10),
  end: "",
  minimum: "",
  limit: "",
  description: "",
};

/* ========================================
   DATE FORMAT
======================================== */

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ========================================
   CURRENCY FORMAT
======================================== */

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

/* ========================================
   COUPON STATUS
======================================== */

const getStatus = (coupon) => {
  const today = new Date().toISOString().slice(0, 10);

  if (coupon.disabled) return "Disabled";

  if (coupon.end && coupon.end < today) return "Expired";

  if (coupon.start && coupon.start > today) return "Scheduled";

  if (
    Number(coupon.limit) > 0 &&
    Number(coupon.used) >= Number(coupon.limit)
  ) {
    return "Usage Limit Reached";
  }

  return "Active";
};

/* ========================================
   MAIN COMPONENT
======================================== */

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(() => ({
    ...emptyForm,
    code: generateCouponCode(),
  }));

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteId, setDeleteId] = useState(null);

  /* ========================================
     FETCH COUPONS FROM DATABASE
  ======================================== */

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCoupons(data.data);
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.error("Failed to load coupons from backend:", err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isModalOpen) handleCloseModal();
        if (deleteId !== null) setDeleteId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, deleteId]);

  /* ========================================
     SUMMARY COUNTS
  ======================================== */

  const summary = useMemo(() => {
    return {
      total: coupons.length,
      active: coupons.filter(
        (coupon) => getStatus(coupon) === "Active"
      ).length,
      scheduled: coupons.filter(
        (coupon) => getStatus(coupon) === "Scheduled"
      ).length,
      expired: coupons.filter(
        (coupon) => getStatus(coupon) === "Expired"
      ).length,
    };
  }, [coupons]);

  /* ========================================
     FILTER COUPONS
  ======================================== */

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const codeMatch = (coupon.code || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const descMatch = (coupon.description || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      const status = getStatus(coupon);

      const matchesStatus =
        filterStatus === "All" || status === filterStatus;

      return (codeMatch || descMatch) && matchesStatus;
    });
  }, [coupons, search, filterStatus]);

  /* ========================================
     MODAL CONTROLS & FORM RESET
  ======================================== */

  const resetForm = () => {
    setForm({
      ...emptyForm,
      code: generateCouponCode(),
    });
    setEditingId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleRegenerateCode = () => {
    if (!editingId) {
      setForm((prev) => ({
        ...prev,
        code: generateCouponCode(),
      }));
    }
  };

  /* ========================================
     INPUT CHANGE
  ======================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ========================================
     CREATE / UPDATE COUPON (SAVED TO DATABASE)
  ======================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const code = (form.code || "").trim().toUpperCase();

    if (!code) {
      alert("Coupon code could not be generated. Please try again.");
      return;
    }

    if (!form.value || Number(form.value) <= 0) {
      alert("Please enter a valid discount value.");
      return;
    }

    if (form.end && form.start && form.end < form.start) {
      alert("Expiry date must be after the start date.");
      return;
    }

    const couponPayload = {
      code,
      type: form.type,
      value: Number(form.value),
      start: form.start || new Date().toISOString().slice(0, 10),
      end: form.end || "",
      minimum: Number(form.minimum) || 0,
      limit: Number(form.limit) || 0,
      description: (form.description || "").trim(),
    };

    try {
      setSubmitting(true);

      if (editingId) {
        // UPDATE COUPON IN DATABASE
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(couponPayload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data.message || "Failed to update coupon in database.");
          return;
        }

        setCoupons((previous) =>
          previous.map((c) =>
            (c._id === editingId || c.id === editingId) ? data.data : c
          )
        );

        alert("Coupon updated successfully in database!");
      } else {
        // SAVE NEW COUPON TO DATABASE
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(couponPayload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          alert(data.message || "Failed to save coupon into database.");
          return;
        }

        setCoupons((previous) => [data.data, ...previous]);
        alert("Coupon successfully saved into database!");
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving coupon into database:", err);
      alert("Server connection error. Please make sure backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ========================================
     EDIT COUPON (OPENS MODAL)
  ======================================== */

  const handleEdit = (coupon) => {
    const couponId = coupon._id || coupon.id;

    setForm({
      code: coupon.code || "",
      type: coupon.type || "Percentage (%)",
      value: coupon.value || "",
      start: coupon.start || "",
      end: coupon.end || "",
      minimum: coupon.minimum ?? "",
      limit: coupon.limit ?? "",
      description: coupon.description || "",
    });

    setEditingId(couponId);
    setIsModalOpen(true);
  };

  /* ========================================
     DELETE COUPON (FROM DATABASE)
  ======================================== */

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete coupon from database.");
        return;
      }

      setCoupons((previous) =>
        previous.filter((coupon) => (coupon._id !== id && coupon.id !== id))
      );

      if (editingId === id) {
        handleCloseModal();
      }

      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting coupon from database:", err);
      alert("Could not delete coupon. Make sure backend is running.");
    }
  };

  /* ========================================
     TOGGLE COUPON STATUS (SAVED TO DATABASE)
  ======================================== */

  const toggleCoupon = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to toggle coupon status.");
        return;
      }

      setCoupons((previous) =>
        previous.map((coupon) =>
          (coupon._id === id || coupon.id === id) ? data.data : coupon
        )
      );
    } catch (err) {
      console.error("Error toggling coupon status:", err);
      alert("Could not update coupon status on server.");
    }
  };

  /* ========================================
     STATUS BADGE
  ======================================== */

  const renderStatus = (status) => {
    const statusClass = status
      .toLowerCase()
      .replace(/\s+/g, "-");

    return (
      <span className={`Coupons-status Coupons-status-${statusClass}`}>
        <span className="Coupons-status-dot" />
        {status}
      </span>
    );
  };

  return (
    <div className="Coupons">
      {/* HEADER */}

      <div className="Coupons-header">
        <div className="Coupons-header-content">
          <div className="Coupons-header-icon">
            <FiTag />
          </div>

          <div>
            <h1 className="Coupons-title">Coupon Management</h1>
            <p className="Coupons-subtitle">
              Create, manage, and track promotional coupons stored in the database.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="Coupons-primary-button"
          onClick={handleOpenCreateModal}
        >
          <FiPlus />
          Create Coupon
        </button>
      </div>

      {/* SUMMARY CARDS */}

      <div className="Coupons-summary">
        <div className="Coupons-summary-card">
          <div className="Coupons-summary-icon Coupons-summary-icon-total">
            <FiTag />
          </div>

          <div>
            <p>Total Coupons</p>
            <h2>{summary.total}</h2>
          </div>
        </div>

        <div className="Coupons-summary-card">
          <div className="Coupons-summary-icon Coupons-summary-icon-active">
            <FiCheckCircle />
          </div>

          <div>
            <p>Active Coupons</p>
            <h2>{summary.active}</h2>
          </div>
        </div>

        <div className="Coupons-summary-card">
          <div className="Coupons-summary-icon Coupons-summary-icon-scheduled">
            <FiClock />
          </div>

          <div>
            <p>Scheduled</p>
            <h2>{summary.scheduled}</h2>
          </div>
        </div>

        <div className="Coupons-summary-card">
          <div className="Coupons-summary-icon Coupons-summary-icon-expired">
            <FiXCircle />
          </div>

          <div>
            <p>Expired Coupons</p>
            <h2>{summary.expired}</h2>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH TABLE CONTENT */}

      <div className="Coupons-content">
        <section className="Coupons-table-section">
          <div className="Coupons-section-header Coupons-table-header">
            <div>
              <h2>All Coupons</h2>
              <p>Promotional offers stored securely in your MongoDB database.</p>
            </div>
          </div>

          {/* SEARCH AND FILTER */}

          <div className="Coupons-toolbar">
            <div className="Coupons-search">
              <FiSearch />

              <input
                type="text"
                placeholder="Search coupon code or description..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search coupons"
              />
            </div>

            <div className="Coupons-filter">
              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                aria-label="Filter coupons by status"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Expired">Expired</option>
                <option value="Disabled">Disabled</option>
                <option value="Usage Limit Reached">
                  Usage Limit Reached
                </option>
              </select>

              <FiChevronDown />
            </div>
          </div>

          {/* TABLE */}

          <div className="Coupons-table-wrapper">
            <table className="Coupons-table">
              <thead>
                <tr>
                  <th>Coupon</th>
                  <th>Discount</th>
                  <th>Validity</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6">
                      <div className="Coupons-empty-state">
                        <FiLoader className="Coupons-spinning" />
                        <h3>Loading coupons from database...</h3>
                      </div>
                    </td>
                  </tr>
                ) : filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => {
                    const couponId = coupon._id || coupon.id;
                    const status = getStatus(coupon);

                    const usagePercentage =
                      Number(coupon.limit) > 0
                        ? Math.min(
                            (Number(coupon.used) /
                              Number(coupon.limit)) *
                              100,
                            100
                          )
                        : 0;

                    return (
                      <tr key={couponId}>
                        <td>
                          <div className="Coupons-code-cell">
                            <strong>{coupon.code}</strong>

                            <span>{coupon.description || "—"}</span>
                          </div>
                        </td>

                        <td>
                          <div className="Coupons-discount-cell">
                            <strong>
                              {coupon.type === "Percentage (%)"
                                ? `${coupon.value}%`
                                : formatCurrency(coupon.value)}
                            </strong>

                            <span>
                              Min. {formatCurrency(coupon.minimum)}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="Coupons-validity-cell">
                            <span>{formatDate(coupon.start)}</span>
                            <span className="Coupons-validity-separator">
                              to
                            </span>
                            <span>{formatDate(coupon.end)}</span>
                          </div>
                        </td>

                        <td>
                          <div className="Coupons-usage-cell">
                            <div className="Coupons-usage-text">
                              <strong>{coupon.used || 0}</strong>
                              <span>
                                / {coupon.limit || "Unlimited"}
                              </span>
                            </div>

                            <div className="Coupons-usage-track">
                              <div
                                className="Coupons-usage-progress"
                                style={{
                                  width: `${usagePercentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td>{renderStatus(status)}</td>

                        <td>
                          <div className="Coupons-actions">
                            <button
                              type="button"
                              className="Coupons-action-button Coupons-edit-button"
                              title="Edit coupon"
                              aria-label={`Edit ${coupon.code}`}
                              onClick={() => handleEdit(coupon)}
                            >
                              <FiEdit2 />
                            </button>

                            <button
                              type="button"
                              className="Coupons-action-button Coupons-toggle-button"
                              title={
                                coupon.disabled
                                  ? "Enable coupon"
                                  : "Disable coupon"
                              }
                              aria-label={
                                coupon.disabled
                                  ? `Enable ${coupon.code}`
                                  : `Disable ${coupon.code}`
                              }
                              onClick={() => toggleCoupon(couponId)}
                            >
                              {coupon.disabled ? (
                                <FiCheckCircle />
                              ) : (
                                <FiXCircle />
                              )}
                            </button>

                            <button
                              type="button"
                              className="Coupons-action-button Coupons-delete-button"
                              title="Delete coupon"
                              aria-label={`Delete ${coupon.code}`}
                              onClick={() => setDeleteId(couponId)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="Coupons-empty-state">
                        <FiTag />
                        <h3>No coupons found in database</h3>
                        <p>
                          Create your first promotional coupon to get started.
                        </p>

                        <button
                          type="button"
                          className="Coupons-primary-button"
                          onClick={handleOpenCreateModal}
                        >
                          <FiPlus />
                          Create Coupon
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}

          <div className="Coupons-table-footer">
            <p>
              Showing <strong>{filteredCoupons.length}</strong> of{" "}
              <strong>{coupons.length}</strong> coupons in database
            </p>
          </div>
        </section>
      </div>

      {/* ========================================
         CREATE / EDIT COUPON MODAL
      ======================================== */}

      {isModalOpen && (
        <div
          className="Coupons-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="Coupons-form-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Coupons-form-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="Coupons-form-modal-header">
              <div className="Coupons-modal-header-info">
                <div className="Coupons-modal-icon-badge">
                  <FiTag />
                </div>
                <div>
                  <h2 id="Coupons-form-modal-title">
                    {editingId ? "Edit Coupon" : "Create New Coupon"}
                  </h2>
                  <p>
                    {editingId
                      ? "Update coupon parameters and apply updates to database."
                      : "Configure rules, discount rates, and validity for your promotion."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="Coupons-close-button"
                aria-label="Close coupon modal"
                onClick={handleCloseModal}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="Coupons-form-modal-body">
                <div className="Coupons-form-grid">
                  {/* AUTO-GENERATED CODE */}

                  <div className="Coupons-field Coupons-field-full">
                    <label htmlFor="Coupons-code">
                      Coupon Code
                    </label>

                    <div className="Coupons-code-input-group">
                      <input
                        id="Coupons-code"
                        name="code"
                        value={form.code}
                        readOnly
                        required
                        aria-label="Coupon code"
                      />

                      {!editingId && (
                        <button
                          type="button"
                          className="Coupons-regenerate-btn"
                          title="Generate new random code"
                          onClick={handleRegenerateCode}
                        >
                          <FiRefreshCw />
                          Regenerate
                        </button>
                      )}
                    </div>

                    <small className="Coupons-code-hint">
                      {editingId
                        ? "Unique coupon code for this promotion."
                        : "Unique coupon code generated automatically. Click Regenerate if needed."}
                    </small>
                  </div>

                  {/* DISCOUNT TYPE */}

                  <div className="Coupons-field">
                    <label htmlFor="Coupons-type">Discount Type</label>

                    <div className="Coupons-select-wrapper">
                      <select
                        id="Coupons-type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="Percentage (%)">
                          Percentage (%)
                        </option>
                        <option value="Fixed Amount (₹)">
                          Fixed Amount (₹)
                        </option>
                      </select>

                      <FiChevronDown />
                    </div>
                  </div>

                  {/* DISCOUNT VALUE */}

                  <div className="Coupons-field">
                    <label htmlFor="Coupons-value">Discount Value</label>

                    <input
                      id="Coupons-value"
                      type="number"
                      name="value"
                      value={form.value}
                      onChange={handleChange}
                      min="1"
                      step="any"
                      placeholder={
                        form.type === "Percentage (%)"
                          ? "Enter percentage"
                          : "Enter amount in ₹"
                      }
                      required
                    />

                    {form.type === "Percentage (%)" && (
                      <small>Enter a percentage from 1 to 100.</small>
                    )}
                  </div>

                  {/* START DATE */}

                  <div className="Coupons-field">
                    <label htmlFor="Coupons-start">Start Date</label>

                    <div className="Coupons-date-wrapper">
                      <input
                        id="Coupons-start"
                        type="date"
                        name="start"
                        value={form.start}
                        onChange={handleChange}
                        required
                      />

                      <FiCalendar />
                    </div>
                  </div>

                  {/* END DATE */}

                  <div className="Coupons-field">
                    <label htmlFor="Coupons-end">Expiry Date</label>

                    <div className="Coupons-date-wrapper">
                      <input
                        id="Coupons-end"
                        type="date"
                        name="end"
                        value={form.end}
                        onChange={handleChange}
                        min={form.start || undefined}
                        required
                      />

                      <FiCalendar />
                    </div>
                  </div>

                  {/* MINIMUM PURCHASE */}

                  <div className="Coupons-field">
                    <label htmlFor="Coupons-minimum">
                      Minimum Purchase (₹)
                    </label>

                    <input
                      id="Coupons-minimum"
                      type="number"
                      name="minimum"
                      value={form.minimum}
                      onChange={handleChange}
                      min="0"
                      placeholder="e.g. 500"
                    />
                  </div>

                  {/* USAGE LIMIT */}

                  <div className="Coupons-field">
                    <label htmlFor="Coupons-limit">Usage Limit</label>

                    <input
                      id="Coupons-limit"
                      type="number"
                      name="limit"
                      value={form.limit}
                      onChange={handleChange}
                      min="1"
                      placeholder="e.g. 100"
                      required
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div className="Coupons-field Coupons-field-full">
                    <label htmlFor="Coupons-description">
                      Description
                    </label>

                    <textarea
                      id="Coupons-description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the coupon offer..."
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="Coupons-form-modal-footer">
                <button
                  type="button"
                  className="Coupons-secondary-button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  <FiX />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="Coupons-primary-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="Coupons-spinning" />
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <FiCheck />
                      {editingId ? "Update Coupon" : "Save Coupon"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
         DELETE CONFIRMATION MODAL
      ======================================== */}

      {deleteId !== null && (
        <div
          className="Coupons-modal-overlay"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="Coupons-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Coupons-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="Coupons-delete-modal-icon">
              <FiTrash2 />
            </div>

            <button
              type="button"
              className="Coupons-modal-close"
              aria-label="Close delete dialog"
              onClick={() => setDeleteId(null)}
            >
              <FiX />
            </button>

            <h3 id="Coupons-delete-title">Delete Coupon from Database?</h3>

            <p>
              Are you sure you want to delete this coupon? It will be permanently removed from the database.
            </p>

            <div className="Coupons-modal-actions">
              <button
                type="button"
                className="Coupons-secondary-button"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="Coupons-delete-confirm-button"
                onClick={() => handleDelete(deleteId)}
              >
                <FiTrash2 />
                Delete Coupon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
