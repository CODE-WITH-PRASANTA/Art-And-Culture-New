
import React, { useMemo, useState } from "react";
import {
  FiMessageSquare,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiPhone,
  FiMail,
  FiCalendar,
  FiChevronDown,
  FiRefreshCw,
  FiArrowUpRight,
} from "react-icons/fi";

import "./EnquiryManagement.css";

/* ========================================
   SAMPLE ENQUIRY DATA
======================================== */

const initialEnquiries = [
  {
    id: 1001,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    subject: "Custom Artwork Inquiry",
    category: "Artwork",
    message:
      "I am interested in commissioning a custom painting for my living room. Please share the available options and pricing.",
    status: "New",
    priority: "High",
    source: "Website",
    date: "2026-10-25",
    followUpDate: "2026-10-27",
    assignedTo: "Admin",
    notes: "",
  },
  {
    id: 1002,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 98765 12345",
    subject: "Order Delivery Details",
    category: "Order Support",
    message:
      "I would like to know the estimated delivery date for my recent artwork order.",
    status: "In Progress",
    priority: "Medium",
    source: "Website",
    date: "2026-10-24",
    followUpDate: "2026-10-28",
    assignedTo: "Support Team",
    notes: "Check the order status before responding.",
  },
  {
    id: 1003,
    name: "Rahul Das",
    email: "rahul.das@example.com",
    phone: "+91 91234 56789",
    subject: "Bulk Art Purchase",
    category: "Bulk Order",
    message:
      "Our office is planning to purchase several artworks. Please contact us with bulk pricing details.",
    status: "Follow Up",
    priority: "High",
    source: "Email",
    date: "2026-10-22",
    followUpDate: "2026-10-27",
    assignedTo: "Admin",
    notes: "Interested in purchasing 10 or more pieces.",
  },
  {
    id: 1004,
    name: "Ananya Mishra",
    email: "ananya.mishra@example.com",
    phone: "+91 99887 66554",
    subject: "Artist Collaboration",
    category: "Collaboration",
    message:
      "I am an independent artist and would love to discuss a possible collaboration.",
    status: "Resolved",
    priority: "Low",
    source: "Social Media",
    date: "2026-10-20",
    followUpDate: "",
    assignedTo: "Manager",
    notes: "Initial discussion completed.",
  },
  {
    id: 1005,
    name: "Rohan Kumar",
    email: "rohan.kumar@example.com",
    phone: "+91 90909 80808",
    subject: "Refund Request",
    category: "Order Support",
    message:
      "I received a damaged frame and would like assistance with a replacement or refund.",
    status: "New",
    priority: "High",
    source: "Website",
    date: "2026-10-26",
    followUpDate: "2026-10-26",
    assignedTo: "Support Team",
    notes: "",
  },
  {
    id: 1006,
    name: "Sneha Mohanty",
    email: "sneha.mohanty@example.com",
    phone: "+91 93333 44444",
    subject: "Art Workshop Registration",
    category: "Workshop",
    message:
      "Please share the upcoming workshop dates, registration process and fees.",
    status: "In Progress",
    priority: "Medium",
    source: "Phone",
    date: "2026-10-18",
    followUpDate: "2026-10-29",
    assignedTo: "Manager",
    notes: "Send the upcoming workshop schedule.",
  },
  {
    id: 1007,
    name: "Aditya Singh",
    email: "aditya.singh@example.com",
    phone: "+91 97777 11111",
    subject: "Product Availability",
    category: "Product Inquiry",
    message:
      "Is the traditional artwork collection available for delivery outside Odisha?",
    status: "Follow Up",
    priority: "Medium",
    source: "Website",
    date: "2026-10-17",
    followUpDate: "2026-10-30",
    assignedTo: "Admin",
    notes: "Confirm shipping availability.",
  },
  {
    id: 1008,
    name: "Ishita Roy",
    email: "ishita.roy@example.com",
    phone: "+91 96666 22222",
    subject: "Partnership Opportunity",
    category: "Collaboration",
    message:
      "We would like to discuss a partnership for showcasing local artists.",
    status: "Resolved",
    priority: "Low",
    source: "Email",
    date: "2026-10-15",
    followUpDate: "",
    assignedTo: "Manager",
    notes: "Partnership proposal received.",
  },
];

const emptyEnquiry = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  category: "General Inquiry",
  message: "",
  status: "New",
  priority: "Medium",
  source: "Website",
  date: new Date().toISOString().slice(0, 10),
  followUpDate: "",
  assignedTo: "Admin",
  notes: "",
};

/* ========================================
   HELPERS
======================================== */

const formatDate = (date) => {
  if (!date) return "Not scheduled";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

const statusClass = (status) =>
  status.toLowerCase().replace(/\s+/g, "-");

/* ========================================
   ENQUIRY MANAGEMENT
======================================== */

const EnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState(initialEnquiries);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyEnquiry);
  const [formError, setFormError] = useState("");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  /* ========================================
     STATISTICS
  ======================================== */

  const stats = useMemo(
    () => ({
      total: enquiries.length,
      new: enquiries.filter((item) => item.status === "New").length,
      progress: enquiries.filter(
        (item) => item.status === "In Progress"
      ).length,
      followUp: enquiries.filter(
        (item) => item.status === "Follow Up"
      ).length,
      resolved: enquiries.filter(
        (item) => item.status === "Resolved"
      ).length,
    }),
    [enquiries]
  );

  /* ========================================
     SEARCH, FILTER AND SORT
  ======================================== */

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = enquiries.filter((item) => {
      const matchesSearch = [
        item.name,
        item.email,
        item.phone,
        item.subject,
        String(item.id),
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "All" || item.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority
      );
    });

    return result.sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      }

      return new Date(b.date) - new Date(a.date);
    });
  }, [
    enquiries,
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    sortOrder,
  ]);

  /* ========================================
     FORM ACTIONS
  ======================================== */

  const resetForm = () => {
    setForm({ ...emptyEnquiry });
    setEditingId(null);
    setFormError("");
    setShowForm(false);
  };

  const openCreateForm = () => {
    setForm({
      ...emptyEnquiry,
      date: new Date().toISOString().slice(0, 10),
    });

    setEditingId(null);
    setFormError("");
    setSelectedEnquiry(null);
    setShowForm(true);
    setActiveMenu(null);
  };

  const openEditForm = (item) => {
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      category: item.category,
      message: item.message,
      status: item.status,
      priority: item.priority,
      source: item.source,
      date: item.date,
      followUpDate: item.followUpDate || "",
      assignedTo: item.assignedTo || "Admin",
      notes: item.notes || "",
    });

    setEditingId(item.id);
    setFormError("");
    setSelectedEnquiry(null);
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    const normalizedEmail = form.email.trim().toLowerCase();

    if (
      form.followUpDate &&
      form.date &&
      form.followUpDate < form.date
    ) {
      setFormError(
        "The follow-up date cannot be earlier than the enquiry date."
      );
      return;
    }

    const enquiryData = {
      ...form,
      name: form.name.trim(),
      email: normalizedEmail,
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      notes: form.notes.trim(),
    };

    if (editingId !== null) {
      setEnquiries((previous) =>
        previous.map((item) =>
          item.id === editingId ? { ...item, ...enquiryData } : item
        )
      );
    } else {
      setEnquiries((previous) => [
        {
          id: Date.now(),
          ...enquiryData,
        },
        ...previous,
      ]);
    }

    resetForm();
  };

  /* ========================================
     FOLLOW-UP ACTIONS
  ======================================== */

  const updateEnquiryStatus = (id, status) => {
    setEnquiries((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              followUpDate:
                status === "Resolved" ? "" : item.followUpDate,
            }
          : item
      )
    );

    setSelectedEnquiry((previous) =>
      previous?.id === id
        ? {
            ...previous,
            status,
            followUpDate:
              status === "Resolved" ? "" : previous.followUpDate,
          }
        : previous
    );

    setActiveMenu(null);
  };

  const scheduleFollowUp = (item) => {
    const suggestedDate = new Date();
    suggestedDate.setDate(suggestedDate.getDate() + 2);

    const dateValue = suggestedDate.toISOString().slice(0, 10);

    setEnquiries((previous) =>
      previous.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: "Follow Up",
              followUpDate: dateValue,
            }
          : entry
      )
    );

    setSelectedEnquiry((previous) =>
      previous?.id === item.id
        ? {
            ...previous,
            status: "Follow Up",
            followUpDate: dateValue,
          }
        : previous
    );

    setActiveMenu(null);
  };

  /* ========================================
     DELETE ACTION
  ======================================== */

  const confirmDelete = () => {
    setEnquiries((previous) =>
      previous.filter((item) => item.id !== deleteId)
    );

    if (selectedEnquiry?.id === deleteId) {
      setSelectedEnquiry(null);
    }

    if (editingId === deleteId) {
      resetForm();
    }

    setDeleteId(null);
    setActiveMenu(null);
  };

  /* ========================================
     RESET FILTERS
  ======================================== */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setSortOrder("newest");
  };

  /* ========================================
     STATUS BADGE
  ======================================== */

  const renderStatus = (status) => (
    <span
      className={`EnquiryManagement-status EnquiryManagement-status-${statusClass(
        status
      )}`}
    >
      <span className="EnquiryManagement-status-dot" />
      {status}
    </span>
  );

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="EnquiryManagement">
      {/* HEADER */}

      <header className="EnquiryManagement-header">
        <div className="EnquiryManagement-header-content">
          <div className="EnquiryManagement-header-icon">
            <FiMessageSquare />
          </div>

          <div>
            <h1 className="EnquiryManagement-title">
              Enquiry Management
            </h1>
            <p className="EnquiryManagement-subtitle">
              Manage enquiries, track conversations and organize follow-ups.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="EnquiryManagement-primary-button"
          onClick={openCreateForm}
        >
          <FiPlus />
          Add Enquiry
        </button>
      </header>

      {/* STATISTICS */}

      <section className="EnquiryManagement-stats">
        <article className="EnquiryManagement-stat-card">
          <div className="EnquiryManagement-stat-icon EnquiryManagement-stat-total">
            <FiUsers />
          </div>
          <div>
            <p>Total Enquiries</p>
            <h2>{stats.total}</h2>
            <span>All received enquiries</span>
          </div>
        </article>

        <article className="EnquiryManagement-stat-card">
          <div className="EnquiryManagement-stat-icon EnquiryManagement-stat-new">
            <FiMessageSquare />
          </div>
          <div>
            <p>New Enquiries</p>
            <h2>{stats.new}</h2>
            <span>Awaiting initial response</span>
          </div>
        </article>

        <article className="EnquiryManagement-stat-card">
          <div className="EnquiryManagement-stat-icon EnquiryManagement-stat-progress">
            <FiClock />
          </div>
          <div>
            <p>In Progress</p>
            <h2>{stats.progress}</h2>
            <span>Currently being handled</span>
          </div>
        </article>

        <article className="EnquiryManagement-stat-card">
          <div className="EnquiryManagement-stat-icon EnquiryManagement-stat-followup">
            <FiAlertCircle />
          </div>
          <div>
            <p>Follow Ups</p>
            <h2>{stats.followUp}</h2>
            <span>Need another contact</span>
          </div>
        </article>

        <article className="EnquiryManagement-stat-card">
          <div className="EnquiryManagement-stat-icon EnquiryManagement-stat-resolved">
            <FiCheckCircle />
          </div>
          <div>
            <p>Resolved</p>
            <h2>{stats.resolved}</h2>
            <span>Successfully completed</span>
          </div>
        </article>
      </section>

      {/* CREATE / EDIT FORM */}

      {showForm && (
        <section className="EnquiryManagement-form-section">
          <div className="EnquiryManagement-section-heading">
            <div>
              <h2>
                {editingId !== null ? "Edit Enquiry" : "Add New Enquiry"}
              </h2>
              <p>
                Enter the enquiry details and update its follow-up status.
              </p>
            </div>

            <button
              type="button"
              className="EnquiryManagement-icon-button"
              aria-label="Close form"
              onClick={resetForm}
            >
              <FiX />
            </button>
          </div>

          {formError && (
            <div className="EnquiryManagement-form-error" role="alert">
              {formError}
            </div>
          )}

          <form
            className="EnquiryManagement-form"
            onSubmit={handleSubmit}
          >
            <div className="EnquiryManagement-form-grid">
              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-name">Full Name *</label>
                <input
                  id="EnquiryManagement-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-email">
                  Email Address *
                </label>
                <input
                  id="EnquiryManagement-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  required
                />
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-phone">
                  Phone Number *
                </label>
                <input
                  id="EnquiryManagement-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-subject">Subject *</label>
                <input
                  id="EnquiryManagement-subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter enquiry subject"
                  required
                />
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-category">Category</label>
                <div className="EnquiryManagement-select-wrap">
                  <select
                    id="EnquiryManagement-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option>General Inquiry</option>
                    <option>Artwork</option>
                    <option>Product Inquiry</option>
                    <option>Order Support</option>
                    <option>Bulk Order</option>
                    <option>Workshop</option>
                    <option>Collaboration</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-status">Status</label>
                <div className="EnquiryManagement-select-wrap">
                  <select
                    id="EnquiryManagement-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Follow Up</option>
                    <option>Resolved</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-priority">Priority</label>
                <div className="EnquiryManagement-select-wrap">
                  <select
                    id="EnquiryManagement-priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-source">Source</label>
                <div className="EnquiryManagement-select-wrap">
                  <select
                    id="EnquiryManagement-source"
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                  >
                    <option>Website</option>
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Social Media</option>
                    <option>Walk-in</option>
                    <option>Other</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-date">
                  Enquiry Date *
                </label>
                <input
                  id="EnquiryManagement-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-followup">
                  Follow-up Date
                </label>
                <input
                  id="EnquiryManagement-followup"
                  type="date"
                  name="followUpDate"
                  value={form.followUpDate}
                  onChange={handleChange}
                  min={form.date || undefined}
                  disabled={form.status === "Resolved"}
                />
              </div>

              <div className="EnquiryManagement-field">
                <label htmlFor="EnquiryManagement-assigned">
                  Assigned To
                </label>
                <div className="EnquiryManagement-select-wrap">
                  <select
                    id="EnquiryManagement-assigned"
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Support Team</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="EnquiryManagement-field EnquiryManagement-field-full">
                <label htmlFor="EnquiryManagement-message">
                  Enquiry Message *
                </label>
                <textarea
                  id="EnquiryManagement-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter the customer's enquiry..."
                  rows="4"
                  required
                />
              </div>

              <div className="EnquiryManagement-field EnquiryManagement-field-full">
                <label htmlFor="EnquiryManagement-notes">
                  Internal Notes
                </label>
                <textarea
                  id="EnquiryManagement-notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add internal notes or next steps..."
                  rows="3"
                />
              </div>
            </div>

            <div className="EnquiryManagement-form-actions">
              <button
                type="button"
                className="EnquiryManagement-secondary-button"
                onClick={resetForm}
              >
                <FiX />
                Cancel
              </button>

              <button
                type="submit"
                className="EnquiryManagement-primary-button"
              >
                <FiCheck />
                {editingId !== null ? "Save Changes" : "Create Enquiry"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ENQUIRY LIST */}

      <section className="EnquiryManagement-list-section">
        <div className="EnquiryManagement-section-heading EnquiryManagement-list-heading">
          <div>
            <h2>All Enquiries</h2>
            <p>Review incoming messages and manage follow-up activities.</p>
          </div>

          <span className="EnquiryManagement-result-count">
            {filteredEnquiries.length} records
          </span>
        </div>

        {/* SEARCH AND FILTERS */}

        <div className="EnquiryManagement-toolbar">
          <div className="EnquiryManagement-search">
            <FiSearch />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, subject or ID..."
              aria-label="Search enquiries"
            />
          </div>

          <div className="EnquiryManagement-filters">
            <div className="EnquiryManagement-filter">
              <FiFilter />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Resolved">Resolved</option>
              </select>
              <FiChevronDown className="EnquiryManagement-filter-chevron" />
            </div>

            <div className="EnquiryManagement-filter">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Artwork">Artwork</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Order Support">Order Support</option>
                <option value="Bulk Order">Bulk Order</option>
                <option value="Workshop">Workshop</option>
                <option value="Collaboration">Collaboration</option>
              </select>
              <FiChevronDown className="EnquiryManagement-filter-chevron" />
            </div>

            <div className="EnquiryManagement-filter">
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                aria-label="Filter by priority"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <FiChevronDown className="EnquiryManagement-filter-chevron" />
            </div>

            <div className="EnquiryManagement-filter">
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                aria-label="Sort enquiries"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A–Z</option>
              </select>
              <FiChevronDown className="EnquiryManagement-filter-chevron" />
            </div>

            <button
              type="button"
              className="EnquiryManagement-reset-button"
              onClick={resetFilters}
              title="Reset filters"
              aria-label="Reset filters"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {/* TABLE */}

        <div className="EnquiryManagement-table-wrapper">
          <table className="EnquiryManagement-table">
            <thead>
              <tr>
                <th>Enquiry</th>
                <th>Contact Details</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Follow Up</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="EnquiryManagement-enquiry-cell">
                        <div className="EnquiryManagement-avatar">
                          {getInitials(item.name)}
                        </div>

                        <div className="EnquiryManagement-enquiry-info">
                          <strong>{item.subject}</strong>
                          <span>{item.name}</span>
                          <small>ENQ-{item.id}</small>
                          <span className="EnquiryManagement-enquiry-date">
                            <FiCalendar />
                            {formatDate(item.date)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="EnquiryManagement-contact-cell">
                        <span>
                          <FiMail />
                          {item.email}
                        </span>
                        <span>
                          <FiPhone />
                          {item.phone}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="EnquiryManagement-category">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`EnquiryManagement-priority EnquiryManagement-priority-${item.priority.toLowerCase()}`}
                      >
                        <span />
                        {item.priority}
                      </span>
                    </td>

                    <td>
                      <div className="EnquiryManagement-followup-cell">
                        <span>
                          {item.followUpDate
                            ? formatDate(item.followUpDate)
                            : "Not scheduled"}
                        </span>

                        {item.status !== "Resolved" && (
                          <button
                            type="button"
                            className="EnquiryManagement-followup-link"
                            onClick={() => scheduleFollowUp(item)}
                          >
                            <FiCalendar />
                            Schedule
                          </button>
                        )}
                      </div>
                    </td>

                    <td>{renderStatus(item.status)}</td>

                    <td>
                      <div className="EnquiryManagement-actions">
                        <button
                          type="button"
                          className="EnquiryManagement-action-button EnquiryManagement-view-button"
                          title="View enquiry"
                          aria-label={`View enquiry ${item.id}`}
                          onClick={() => {
                            setSelectedEnquiry(item);
                            setActiveMenu(null);
                          }}
                        >
                          <FiEye />
                        </button>

                        <button
                          type="button"
                          className="EnquiryManagement-action-button EnquiryManagement-edit-button"
                          title="Edit enquiry"
                          aria-label={`Edit enquiry ${item.id}`}
                          onClick={() => openEditForm(item)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="EnquiryManagement-action-button EnquiryManagement-delete-button"
                          title="Delete enquiry"
                          aria-label={`Delete enquiry ${item.id}`}
                          onClick={() => setDeleteId(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="EnquiryManagement-empty">
                      <FiMessageSquare />
                      <h3>No enquiries found</h3>
                      <p>
                        Try changing your search or filters, or add a new
                        enquiry.
                      </p>
                      <button
                        type="button"
                        className="EnquiryManagement-secondary-button"
                        onClick={resetFilters}
                      >
                        <FiRefreshCw />
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="EnquiryManagement-table-footer">
          <span>
            Showing <strong>{filteredEnquiries.length}</strong> of{" "}
            <strong>{enquiries.length}</strong> enquiries
          </span>
          <span>
            <FiArrowUpRight />
            Follow-up tracking enabled
          </span>
        </div>
      </section>

      {/* VIEW DETAILS MODAL */}

      {selectedEnquiry && (
        <div
          className="EnquiryManagement-modal-overlay"
          onClick={() => setSelectedEnquiry(null)}
        >
          <section
            className="EnquiryManagement-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="EnquiryManagement-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="EnquiryManagement-modal-header">
              <div>
                <h2 id="EnquiryManagement-details-title">
                  Enquiry Details
                </h2>
                <p>ENQ-{selectedEnquiry.id}</p>
              </div>

              <button
                type="button"
                className="EnquiryManagement-icon-button"
                aria-label="Close details"
                onClick={() => setSelectedEnquiry(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="EnquiryManagement-details-profile">
              <div className="EnquiryManagement-avatar EnquiryManagement-details-avatar">
                {getInitials(selectedEnquiry.name)}
              </div>

              <div>
                <h3>{selectedEnquiry.name}</h3>
                <p>{selectedEnquiry.subject}</p>
                {renderStatus(selectedEnquiry.status)}
              </div>
            </div>

            <div className="EnquiryManagement-details-grid">
              <div>
                <span>Email Address</span>
                <strong>{selectedEnquiry.email}</strong>
              </div>

              <div>
                <span>Phone Number</span>
                <strong>{selectedEnquiry.phone}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{selectedEnquiry.category}</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>{selectedEnquiry.priority}</strong>
              </div>

              <div>
                <span>Enquiry Date</span>
                <strong>{formatDate(selectedEnquiry.date)}</strong>
              </div>

              <div>
                <span>Follow-up Date</span>
                <strong>{formatDate(selectedEnquiry.followUpDate)}</strong>
              </div>

              <div>
                <span>Source</span>
                <strong>{selectedEnquiry.source}</strong>
              </div>

              <div>
                <span>Assigned To</span>
                <strong>{selectedEnquiry.assignedTo}</strong>
              </div>

              <div className="EnquiryManagement-detail-full">
                <span>Enquiry Message</span>
                <p>{selectedEnquiry.message}</p>
              </div>

              <div className="EnquiryManagement-detail-full">
                <span>Internal Notes</span>
                <p>{selectedEnquiry.notes || "No internal notes added."}</p>
              </div>
            </div>

            <div className="EnquiryManagement-details-actions">
              {selectedEnquiry.status !== "Resolved" && (
                <>
                  <button
                    type="button"
                    className="EnquiryManagement-secondary-button"
                    onClick={() => scheduleFollowUp(selectedEnquiry)}
                  >
                    <FiCalendar />
                    Schedule Follow-up
                  </button>

                  <button
                    type="button"
                    className="EnquiryManagement-primary-button"
                    onClick={() =>
                      updateEnquiryStatus(
                        selectedEnquiry.id,
                        "Resolved"
                      )
                    }
                  >
                    <FiCheckCircle />
                    Mark Resolved
                  </button>
                </>
              )}

              <button
                type="button"
                className="EnquiryManagement-secondary-button"
                onClick={() => openEditForm(selectedEnquiry)}
              >
                <FiEdit2 />
                Edit
              </button>
            </div>
          </section>
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteId !== null && (
        <div
          className="EnquiryManagement-modal-overlay"
          onClick={() => setDeleteId(null)}
        >
          <section
            className="EnquiryManagement-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="EnquiryManagement-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="EnquiryManagement-delete-icon">
              <FiTrash2 />
            </div>

            <button
              type="button"
              className="EnquiryManagement-icon-button EnquiryManagement-delete-close"
              aria-label="Close delete dialog"
              onClick={() => setDeleteId(null)}
            >
              <FiX />
            </button>

            <h2 id="EnquiryManagement-delete-title">
              Delete Enquiry?
            </h2>

            <p>
              Are you sure you want to permanently delete this enquiry?
              This action cannot be undone.
            </p>

            <div className="EnquiryManagement-delete-actions">
              <button
                type="button"
                className="EnquiryManagement-secondary-button"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="EnquiryManagement-danger-button"
                onClick={confirmDelete}
              >
                <FiTrash2 />
                Delete Enquiry
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default EnquiryManagement;
