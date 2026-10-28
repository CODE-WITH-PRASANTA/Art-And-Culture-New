

import React, { useEffect, useMemo, useState } from "react";
import { USERS_API_URL } from "../../config/api";

import {
  FiUsers,
  FiUserPlus,
  FiUserCheck,
  FiUserX,
  FiClock,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiShoppingBag,
  FiChevronDown,
  FiRefreshCw,
} from "react-icons/fi";

import "./Users.css";


const emptyUser = {
  name: "",
  email: "",
  phone: "",
  role: "Customer",
  status: "Active",
  password: "",
};

/* ========================================
   HELPERS
======================================== */

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

/* ========================================
   USERS COMPONENT
======================================== */

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyUser);

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [notice, setNotice] = useState("");

  /* ========================================
     FETCH USERS FROM BACKEND
  ======================================== */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(USERS_API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users from backend:", err);
      setNotice("Could not load users from backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ========================================
     STATISTICS
  ======================================== */

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((user) => user.status === "Active").length,
      inactive: users.filter((user) => user.status === "Inactive").length,
      blocked: users.filter((user) => user.status === "Blocked").length,
    }),
    [users]
  );

  /* ========================================
     FILTER AND SORT
  ======================================== */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    return result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "oldest") {
        return new Date(a.joined) - new Date(b.joined);
      }

      return new Date(b.joined) - new Date(a.joined);
    });
  }, [users, search, roleFilter, statusFilter, sortBy]);

  /* ========================================
     FORM HANDLERS
  ======================================== */

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...emptyUser });
    setShowForm(true);
    setActiveMenu(null);
    setNotice("");
  };

  const openEditForm = (user) => {
    const userId = user.id || user._id;
    setEditingId(userId);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone === "—" ? "" : user.phone || "",
      role: user.role || "Customer",
      status: user.status || "Active",
      password: "",
    });

    setShowForm(true);
    setSelectedUser(null);
    setActiveMenu(null);
    setNotice("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({ ...emptyUser });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedPhone = form.phone ? form.phone.trim() : "";

    const emailExists = users.some(
      (user) =>
        (user.email || "").toLowerCase() === normalizedEmail &&
        (user.id || user._id) !== editingId
    );

    if (emailExists) {
      setNotice("A user with this email address already exists.");
      return;
    }

    try {
      if (editingId !== null) {
        // Update user in backend
        const res = await fetch(`${USERS_API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            email: normalizedEmail,
            phone: normalizedPhone,
            role: form.role,
            status: form.status,
            password: form.password ? form.password.trim() : undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setNotice(data.message || "Failed to update user in database.");
          return;
        }

        setUsers((previous) =>
          previous.map((user) =>
            (user.id === editingId || user._id === editingId)
              ? { ...user, ...data.user }
              : user
          )
        );

        setNotice("");
        resetForm();
        return;
      }

      // Create new user in backend
      const res = await fetch(USERS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          role: form.role,
          status: form.status,
          password: form.password ? form.password.trim() : "123456",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setNotice(data.message || "Failed to create user in database.");
        return;
      }

      setUsers((previous) => [data.user, ...previous]);
      setNotice("");
      resetForm();
    } catch (err) {
      console.error("User save error:", err);
      setNotice(err.message || "An unexpected error occurred while saving user.");
    }
  };

  /* ========================================
     DELETE USER
  ======================================== */

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`${USERS_API_URL}/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((previous) =>
          previous.filter((user) => (user.id !== deleteId && user._id !== deleteId))
        );
      }
    } catch (err) {
      console.error("Delete user error:", err);
    } finally {
      if (selectedUser?.id === deleteId || selectedUser?._id === deleteId) {
        setSelectedUser(null);
      }
      setDeleteId(null);
      setActiveMenu(null);
    }
  };

  /* ========================================
     TOGGLE USER STATUS
  ======================================== */

  const toggleUserStatus = async (user) => {
    const nextStatus = user.status === "Blocked" ? "Active" : "Blocked";
    const userId = user.id || user._id;

    try {
      const res = await fetch(`${USERS_API_URL}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((previous) =>
          previous.map((item) =>
            (item.id === userId || item._id === userId)
              ? { ...item, status: nextStatus }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    } finally {
      setActiveMenu(null);
      setSelectedUser((previous) =>
        (previous?.id === userId || previous?._id === userId)
          ? { ...previous, status: nextStatus }
          : previous
      );
    }
  };

  /* ========================================
     RESET FILTERS
  ======================================== */

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
    setSortBy("newest");
  };

  /* ========================================
     STATUS BADGE
  ======================================== */

  const renderStatus = (status) => (
    <span
      className={`Users-status Users-status-${status.toLowerCase()}`}
    >
      <span className="Users-status-dot" />
      {status}
    </span>
  );

  /* ========================================
     RENDER COMPONENT
  ======================================== */

  return (
    <div className="Users">
      {/* PAGE HEADER */}

      <header className="Users-header">
        <div className="Users-header-content">
          <div className="Users-header-icon">
            <FiUsers />
          </div>

          <div>
            <h1 className="Users-title">User Management</h1>
            <p className="Users-subtitle">
              Manage your customers, team members and account access.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="Users-primary-button"
          onClick={openCreateForm}
        >
          <FiUserPlus />
          Add New User
        </button>
      </header>

      {/* STATISTICS */}

      <section className="Users-stats">
        <article className="Users-stat-card">
          <div className="Users-stat-icon Users-stat-icon-total">
            <FiUsers />
          </div>

          <div className="Users-stat-info">
            <p>Total Users</p>
            <h2>{stats.total}</h2>
            <span>Registered accounts</span>
          </div>
        </article>

        <article className="Users-stat-card">
          <div className="Users-stat-icon Users-stat-icon-active">
            <FiUserCheck />
          </div>

          <div className="Users-stat-info">
            <p>Active Users</p>
            <h2>{stats.active}</h2>
            <span>Accounts enabled</span>
          </div>
        </article>

        <article className="Users-stat-card">
          <div className="Users-stat-icon Users-stat-icon-inactive">
            <FiClock />
          </div>

          <div className="Users-stat-info">
            <p>Inactive Users</p>
            <h2>{stats.inactive}</h2>
            <span>Currently inactive</span>
          </div>
        </article>

        <article className="Users-stat-card">
          <div className="Users-stat-icon Users-stat-icon-blocked">
            <FiUserX />
          </div>

          <div className="Users-stat-info">
            <p>Blocked Users</p>
            <h2>{stats.blocked}</h2>
            <span>Restricted accounts</span>
          </div>
        </article>
      </section>

      {/* USER FORM */}

      {showForm && (
        <section className="Users-form-section">
          <div className="Users-section-heading">
            <div>
              <h2>{editingId ? "Edit User" : "Add New User"}</h2>
              <p>
                {editingId
                  ? "Update account information and permissions."
                  : "Enter the details for the new user account."}
              </p>
            </div>

            <button
              type="button"
              className="Users-icon-button"
              onClick={resetForm}
              aria-label="Close user form"
            >
              <FiX />
            </button>
          </div>

          {notice && (
            <div className="Users-form-notice" role="alert">
              {notice}
            </div>
          )}

          <form className="Users-form" onSubmit={handleSubmit}>
            <div className="Users-form-grid">
              <div className="Users-field">
                <label htmlFor="Users-name">Full Name *</label>
                <input
                  id="Users-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="Users-field">
                <label htmlFor="Users-email">Email Address *</label>
                <input
                  id="Users-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="Users-field">
                <label htmlFor="Users-phone">Phone Number</label>
                <input
                  id="Users-phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </div>

              <div className="Users-field">
                <label htmlFor="Users-role">User Role *</label>
                <div className="Users-select-wrap">
                  <select
                    id="Users-role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="Customer">Customer</option>
                    <option value="Artist">Artist</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="Users-field">
                <label htmlFor="Users-status">Account Status *</label>
                <div className="Users-select-wrap">
                  <select
                    id="Users-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                  <FiChevronDown />
                </div>
              </div>

              <div className="Users-field">
                <label htmlFor="Users-password">
                  {editingId ? "Change Password (optional)" : "Password (default: 123456)"}
                </label>
                <input
                  id="Users-password"
                  type="password"
                  name="password"
                  value={form.password || ""}
                  onChange={handleChange}
                  placeholder={
                    editingId
                      ? "Leave blank to keep current password"
                      : "Enter password or default: 123456"
                  }
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
            </div>

            <div className="Users-form-actions">
              <button
                type="button"
                className="Users-secondary-button"
                onClick={resetForm}
              >
                <FiX />
                Cancel
              </button>

              <button type="submit" className="Users-primary-button">
                <FiCheck />
                {editingId ? "Save Changes" : "Create User"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* USER LIST */}

      <section className="Users-list-section">
        <div className="Users-section-heading Users-list-heading">
          <div>
            <h2>All Users</h2>
            <p>View and manage registered accounts.</p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              className="Users-secondary-button"
              onClick={fetchUsers}
              title="Refresh users from database"
              style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <FiRefreshCw style={loading ? { animation: "spin 1s linear infinite" } : {}} />
              <span>Sync</span>
            </button>
            <div className="Users-list-count">
              <FiUsers />
              <span>{filteredUsers.length} users</span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}

        <div className="Users-toolbar">
          <div className="Users-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search users"
            />
          </div>

          <div className="Users-toolbar-filters">
            <div className="Users-filter">
              <FiShield />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter by user role"
              >
                <option value="All">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <FiChevronDown className="Users-filter-chevron" />
            </div>

            <div className="Users-filter">
              <FiFilter />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by user status"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
              <FiChevronDown className="Users-filter-chevron" />
            </div>

            <div className="Users-filter Users-sort-filter">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort users"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A–Z</option>
              </select>
              <FiChevronDown className="Users-filter-chevron" />
            </div>

            <button
              type="button"
              className="Users-reset-button"
              onClick={resetFilters}
              title="Reset search and filters"
              aria-label="Reset filters"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {/* TABLE */}

        <div className="Users-table-wrapper">
          <table className="Users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    <FiRefreshCw style={{ animation: "spin 1s linear infinite", fontSize: "24px", color: "var(--color-primary, #d08a24)" }} />
                    <p style={{ marginTop: "10px", color: "#666", fontSize: "13px" }}>Loading users from database...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="Users-user-cell">
                        {user.avatar ? (
                          <img
                            className="Users-avatar"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <div className="Users-avatar Users-avatar-initials">
                            {getInitials(user.name)}
                          </div>
                        )}

                        <div className="Users-user-info">
                          <strong>{user.name}</strong>
                          <span>ID: {String(user.id).slice(-8)}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="Users-contact-cell">
                        <span>
                          <FiMail />
                          {user.email}
                        </span>
                        <span>
                          <FiPhone />
                          {user.phone || "Not provided"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`Users-role Users-role-${user.role.toLowerCase()}`}
                      >
                        {user.role === "Admin" && <FiShield />}
                        {user.role === "Manager" && <FiUsers />}
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className="Users-date">
                        <FiCalendar />
                        {formatDate(user.joined)}
                      </span>
                    </td>

                    <td>
                      <span className="Users-order-count">
                        <FiShoppingBag />
                        {user.orders}
                      </span>
                    </td>

                    <td>
                      <strong className="Users-spent">
                        {formatCurrency(user.spent)}
                      </strong>
                    </td>

                    <td>{renderStatus(user.status)}</td>

                    <td>
                      <div className="Users-action-area">
                        <button
                          type="button"
                          className="Users-action-trigger"
                          aria-label={`Actions for ${user.name}`}
                          aria-expanded={activeMenu === user.id}
                          onClick={() =>
                            setActiveMenu((previous) =>
                              previous === user.id ? null : user.id
                            )
                          }
                        >
                          <FiMoreVertical />
                        </button>

                        {activeMenu === user.id && (
                          <div className="Users-action-menu">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setActiveMenu(null);
                              }}
                            >
                              <FiEye />
                              View Details
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditForm(user)}
                            >
                              <FiEdit2 />
                              Edit User
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleUserStatus(user)}
                            >
                              {user.status === "Blocked" ? (
                                <FiUserCheck />
                              ) : (
                                <FiUserX />
                              )}
                              {user.status === "Blocked"
                                ? "Unblock User"
                                : "Block User"}
                            </button>

                            <button
                              type="button"
                              className="Users-menu-delete"
                              onClick={() => {
                                setDeleteId(user.id);
                                setActiveMenu(null);
                              }}
                            >
                              <FiTrash2 />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="Users-empty-state">
                      <div className="Users-empty-icon">
                        <FiUsers />
                      </div>
                      <h3>No users found</h3>
                      <p>
                        Try another search or change your filters.
                      </p>
                      <button
                        type="button"
                        className="Users-secondary-button"
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

        <div className="Users-table-footer">
          <span>
            Showing <strong>{filteredUsers.length}</strong> of{" "}
            <strong>{users.length}</strong> users
          </span>
          <span className="Users-footer-note">
            <FiShield />
            Account management
          </span>
        </div>
      </section>

      {/* USER DETAILS MODAL */}

      {selectedUser && (
        <div
          className="Users-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <section
            className="Users-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Users-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="Users-modal-header">
              <div>
                <h2 id="Users-details-title">User Details</h2>
                <p>Account information and activity.</p>
              </div>

              <button
                type="button"
                className="Users-icon-button"
                aria-label="Close user details"
                onClick={() => setSelectedUser(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="Users-profile">
              {selectedUser.avatar ? (
                <img
                  className="Users-profile-avatar"
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                />
              ) : (
                <div className="Users-profile-avatar Users-profile-initials">
                  {getInitials(selectedUser.name)}
                </div>
              )}

              <h3>{selectedUser.name}</h3>
              <p>{selectedUser.email}</p>
              {renderStatus(selectedUser.status)}
            </div>

            <div className="Users-details-grid">
              <div className="Users-detail-item">
                <span>Phone Number</span>
                <strong>{selectedUser.phone || "Not provided"}</strong>
              </div>

              <div className="Users-detail-item">
                <span>Account Role</span>
                <strong>{selectedUser.role}</strong>
              </div>

              <div className="Users-detail-item">
                <span>Joined Date</span>
                <strong>{formatDate(selectedUser.joined)}</strong>
              </div>

              <div className="Users-detail-item">
                <span>Total Orders</span>
                <strong>{selectedUser.orders}</strong>
              </div>

              <div className="Users-detail-item Users-detail-full">
                <span>Total Purchase Value</span>
                <strong>{formatCurrency(selectedUser.spent)}</strong>
              </div>
            </div>

            <div className="Users-modal-actions">
              <button
                type="button"
                className="Users-secondary-button"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="Users-primary-button"
                onClick={() => openEditForm(selectedUser)}
              >
                <FiEdit2 />
                Edit User
              </button>
            </div>
          </section>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

      {deleteId !== null && (
        <div
          className="Users-modal-overlay"
          onClick={() => setDeleteId(null)}
        >
          <section
            className="Users-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="Users-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="Users-delete-icon">
              <FiTrash2 />
            </div>

            <button
              type="button"
              className="Users-icon-button Users-delete-close"
              aria-label="Close delete confirmation"
              onClick={() => setDeleteId(null)}
            >
              <FiX />
            </button>

            <h2 id="Users-delete-title">Delete User?</h2>
            <p>
              This will permanently remove this user from the current list.
              This action cannot be undone.
            </p>

            <div className="Users-modal-actions">
              <button
                type="button"
                className="Users-secondary-button"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="Users-danger-button"
                onClick={handleDelete}
              >
                <FiTrash2 />
                Delete User
              </button>
            </div>
          </section>
        </div>
      )}

      {/* CLICK-OUTSIDE MENU DISMISS LAYER */}

      {activeMenu !== null && (
        <button
          type="button"
          className="Users-menu-dismiss"
          aria-label="Close user actions menu"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default Users;
