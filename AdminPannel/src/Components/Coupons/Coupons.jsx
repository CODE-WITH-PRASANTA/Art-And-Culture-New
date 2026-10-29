
import React, { useMemo, useState } from "react";
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
} from "react-icons/fi";

import "./Coupons.css";

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
   INITIAL COUPONS
======================================== */

const initialCoupons = [
  {
    id: 1,
    code: "ART-WELCOME20",
    type: "Percentage (%)",
    value: 20,
    start: "2026-10-01",
    end: "2026-12-31",
    minimum: 500,
    limit: 100,
    used: 42,
    description: "Welcome discount for new customers",
    disabled: false,
  },
  {
    id: 2,
    code: "ART-FESTIVE15",
    type: "Percentage (%)",
    value: 15,
    start: "2026-10-01",
    end: "2026-11-30",
    minimum: 1000,
    limit: 150,
    used: 78,
    description: "Festive season special offer",
    disabled: false,
  },
  {
    id: 3,
    code: "ART-FLAT200",
    type: "Fixed Amount (₹)",
    value: 200,
    start: "2026-09-01",
    end: "2026-10-15",
    minimum: 1500,
    limit: 80,
    used: 31,
    description: "Flat discount on eligible purchases",
    disabled: false,
  },
  {
    id: 4,
    code: "ART-NEWUSER",
    type: "Percentage (%)",
    value: 10,
    start: "2026-11-01",
    end: "2026-12-31",
    minimum: 300,
    limit: 200,
    used: 0,
    description: "Discount for new users",
    disabled: false,
  },
];

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
  const [coupons, setCoupons] = useState(initialCoupons);

  const [form, setForm] = useState(() => ({
    ...emptyForm,
    code: generateCouponCode(),
  }));

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showForm, setShowForm] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

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
      const matchesSearch =
        coupon.code.toLowerCase().includes(search.toLowerCase()) ||
        coupon.description.toLowerCase().includes(search.toLowerCase());

      const status = getStatus(coupon);

      const matchesStatus =
        filterStatus === "All" || status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, filterStatus]);

  /* ========================================
     RESET FORM
  ======================================== */

  const resetForm = () => {
    setForm({
      ...emptyForm,
      code: generateCouponCode(),
    });

    setEditingId(null);
  };

  /* ========================================
     OPEN CREATE FORM
  ======================================== */

  const handleCreate = () => {
    resetForm();
    setShowForm(true);

    setTimeout(() => {
      document
        .querySelector(".Coupons-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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
     CREATE / UPDATE COUPON
  ======================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    const code = form.code.trim().toUpperCase();

    if (!code) {
      alert("Coupon code could not be generated. Please try again.");
      return;
    }

    const duplicate = coupons.some(
      (coupon) =>
        coupon.code.toUpperCase() === code &&
        coupon.id !== editingId
    );

    if (duplicate) {
      alert("This coupon code already exists. Generate a new code.");
      return;
    }

    if (!form.value || Number(form.value) <= 0) {
      alert("Please enter a valid discount value.");
      return;
    }

    if (form.end && form.start && form.end < form.start) {
      alert("End date must be after the start date.");
      return;
    }

    const couponData = {
      ...form,
      code,
      value: Number(form.value),
      minimum: Number(form.minimum) || 0,
      limit: Number(form.limit) || 0,
      used: editingId
        ? coupons.find((coupon) => coupon.id === editingId)?.used || 0
        : 0,
      disabled: editingId
        ? coupons.find((coupon) => coupon.id === editingId)?.disabled || false
        : false,
    };

    if (editingId) {
      setCoupons((previous) =>
        previous.map((coupon) =>
          coupon.id === editingId
            ? { ...coupon, ...couponData }
            : coupon
        )
      );

      alert("Coupon updated successfully!");
    } else {
      setCoupons((previous) => [
        {
          id: Date.now(),
          ...couponData,
        },
        ...previous,
      ]);

      alert("Coupon created successfully!");
    }

    resetForm();
  };

  /* ========================================
     EDIT COUPON
  ======================================== */

  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      start: coupon.start,
      end: coupon.end,
      minimum: coupon.minimum,
      limit: coupon.limit,
      description: coupon.description,
    });

    setEditingId(coupon.id);
    setShowForm(true);

    setTimeout(() => {
      document
        .querySelector(".Coupons-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  /* ========================================
     DELETE COUPON
  ======================================== */

  const handleDelete = (id) => {
    setCoupons((previous) =>
      previous.filter((coupon) => coupon.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }

    setDeleteId(null);
  };

  /* ========================================
     TOGGLE COUPON STATUS
  ======================================== */

  const toggleCoupon = (id) => {
    setCoupons((previous) =>
      previous.map((coupon) =>
        coupon.id === id
          ? { ...coupon, disabled: !coupon.disabled }
          : coupon
      )
    );
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

  /* ========================================
     RENDER
  ======================================== */

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
              Create, manage and track your promotional coupons.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="Coupons-primary-button"
          onClick={handleCreate}
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

      {/* MAIN CONTENT */}

      <div className="Coupons-content">
        {/* COUPON FORM */}

        {showForm && (
          <section className="Coupons-form-section">
            <div className="Coupons-section-header">
              <div>
                <h2>
                  {editingId ? "Edit Coupon" : "Create New Coupon"}
                </h2>

                <p>
                  {editingId
                    ? "Update the coupon details below."
                    : "Set up a promotional offer for your customers."}
                </p>
              </div>

              <button
                type="button"
                className="Coupons-close-button"
                aria-label="Close coupon form"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <FiX />
              </button>
            </div>

            <form className="Coupons-form" onSubmit={handleSubmit}>
              {/* AUTO-GENERATED CODE */}

              <div className="Coupons-field">
                <label htmlFor="Coupons-code">
                  Auto-Generated Coupon Code
                </label>

                <input
                  id="Coupons-code"
                  name="code"
                  value={form.code}
                  readOnly
                  required
                  aria-label="Automatically generated coupon code"
                />

                <small className="Coupons-code-hint">
                  Your unique coupon code is generated automatically.
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
                    <option value="Percentage (%)">Percentage (%)</option>
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
                <label htmlFor="Coupons-description">Description</label>

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

              {/* ACTION BUTTONS */}

              <div className="Coupons-form-actions">
                <button
                  type="button"
                  className="Coupons-secondary-button"
                  onClick={resetForm}
                >
                  <FiX />
                  Reset
                </button>

                <button
                  type="submit"
                  className="Coupons-primary-button"
                >
                  <FiCheck />
                  {editingId ? "Update Coupon" : "Save Coupon"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* COUPON TABLE */}

        <section className="Coupons-table-section">
          <div className="Coupons-section-header Coupons-table-header">
            <div>
              <h2>All Coupons</h2>
              <p>Manage your existing promotional offers.</p>
            </div>

            {!showForm && (
              <button
                type="button"
                className="Coupons-primary-button"
                onClick={handleCreate}
              >
                <FiPlus />
                Add Coupon
              </button>
            )}
          </div>

          {/* SEARCH AND FILTER */}

          <div className="Coupons-toolbar">
            <div className="Coupons-search">
              <FiSearch />

              <input
                type="text"
                placeholder="Search coupon code..."
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
                {filteredCoupons.length > 0 ? (
                  filteredCoupons.map((coupon) => {
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
                      <tr key={coupon.id}>
                        <td>
                          <div className="Coupons-code-cell">
                            <strong>{coupon.code}</strong>

                            <span>{coupon.description}</span>
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
                              <strong>{coupon.used}</strong>
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
                              onClick={() => toggleCoupon(coupon.id)}
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
                              onClick={() => setDeleteId(coupon.id)}
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
                        <h3>No coupons found</h3>
                        <p>
                          Try changing your search or create a new coupon.
                        </p>

                        <button
                          type="button"
                          className="Coupons-primary-button"
                          onClick={handleCreate}
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
              <strong>{coupons.length}</strong> coupons
            </p>
          </div>
        </section>
      </div>

      {/* DELETE CONFIRMATION */}

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

            <h3 id="Coupons-delete-title">Delete Coupon?</h3>

            <p>
              Are you sure you want to delete this coupon? This action cannot
              be undone.
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
