import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiTag,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiSearch,
  FiFolder,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

import "./ArtCatagory.css";

import { CATEGORIES_API_URL as API_URL } from "../../config/api";

const ArtCatagory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  /* =====================================
     FETCH CATEGORIES FROM DATABASE
  ====================================== */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to load categories from database:", err);
      setError("Could not connect to backend server. Please verify it is running.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* =====================================
     HANDLE SUBMIT (SAVE / UPDATE TO DB)
  ====================================== */
  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    const duplicate = categories.some((category) => {
      const catId = category._id || category.id;
      return (
        category.name.toLowerCase() === trimmedName.toLowerCase() &&
        catId !== editingId
      );
    });

    if (duplicate) {
      setError("This category already exists. Please use another name.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId !== null) {
        // UPDATE IN DATABASE
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to update category in database.");
          return;
        }

        setCategories((previous) =>
          previous.map((category) => {
            const catId = category._id || category.id;
            return catId === editingId ? data.data : category;
          })
        );

        setSuccess("Category updated successfully in database.");
      } else {
        // CREATE IN DATABASE
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to save category into database.");
          return;
        }

        setCategories((previous) => [data.data, ...previous]);
        setSuccess("New category added and saved into database successfully.");
      }

      setCategoryName("");
      setEditingId(null);
    } catch (err) {
      console.error("Error saving category into database:", err);
      setError("Network or server error while saving category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    resetMessages();
    setCategoryName(category.name);
    setEditingId(category._id || category.id);
  };

  const handleCancelEdit = () => {
    setCategoryName("");
    setEditingId(null);
    resetMessages();
  };

  /* =====================================
     HANDLE DELETE (DELETE FROM DB)
  ====================================== */
  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const res = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to delete category from database.");
        return;
      }

      setCategories((previous) =>
        previous.filter((category) => {
          const catId = category._id || category.id;
          return catId !== deleteId;
        })
      );

      if (editingId === deleteId) {
        setCategoryName("");
        setEditingId(null);
      }

      setDeleteId(null);
      setSuccess("Category deleted successfully from database.");
      setError("");
    } catch (err) {
      console.error("Error deleting category from database:", err);
      setError("Network or server error while deleting category.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    (category.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim())
  );

  const deletingCategory = categories.find((category) => {
    const catId = category._id || category.id;
    return catId === deleteId;
  });

  return (
    <section className="ArtCatagory">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <header className="ArtCatagory-header">
        <div className="ArtCatagory-header__content">
          <span className="ArtCatagory-header__eyebrow">
            ART & CULTURE / COLLECTIONS
          </span>

          <h1>Category Management</h1>

          <p>
            Organize your artwork categories and keep your creative
            collection structured in the database.
          </p>
        </div>

      </header>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}
      <div className="ArtCatagory-layout">
        {/* ===================================
            LEFT: CATEGORY FORM
        ==================================== */}
        <aside className="ArtCatagory-form-panel">
          <div className="ArtCatagory-panel-heading">
            <div className="ArtCatagory-panel-heading__icon">
              {editingId !== null ? (
                <FiEdit2 size={19} />
              ) : (
                <FiPlus size={21} />
              )}
            </div>

            <div>
              <span className="ArtCatagory-panel-heading__eyebrow">
                CATEGORY DETAILS
              </span>

              <h2>
                {editingId !== null ? "Edit Category" : "Add Category"}
              </h2>
            </div>
          </div>

          <p className="ArtCatagory-form-description">
            {editingId !== null
              ? "Update the name of your selected category in the database."
              : "Create a new category to organize your artworks and save directly into database."}
          </p>

          <form
            className="ArtCatagory-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="ArtCatagory-form__field">
              <label htmlFor="ArtCatagory-name">
                Category Name <span>*</span>
              </label>

              <div
                className={`ArtCatagory-form__input-wrap ${
                  error ? "ArtCatagory-form__input-wrap--error" : ""
                }`}
              >
                <FiTag size={18} />

                <input
                  id="ArtCatagory-name"
                  type="text"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(event) => {
                    setCategoryName(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  maxLength={80}
                  autoComplete="off"
                  aria-invalid={Boolean(error)}
                  required
                />

                {categoryName && (
                  <button
                    type="button"
                    className="ArtCatagory-form__clear"
                    onClick={() => {
                      setCategoryName("");
                      setError("");
                    }}
                    aria-label="Clear category name"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <div className="ArtCatagory-form__hint">
                <span>Choose a clear, descriptive category name.</span>
                <span>{categoryName.length}/80</span>
              </div>
            </div>

            {error && (
              <div
                className="ArtCatagory-message ArtCatagory-message--error"
                role="alert"
              >
                <FiAlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                className="ArtCatagory-message ArtCatagory-message--success"
                role="status"
              >
                <FiCheck size={17} />
                <span>{success}</span>
              </div>
            )}

            <div className="ArtCatagory-form__actions">
              <button
                type="submit"
                className="ArtCatagory-button ArtCatagory-button--primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FiLoader size={18} className="Coupons-spinning" />
                    Saving...
                  </>
                ) : editingId !== null ? (
                  <>
                    <FiCheck size={17} />
                    Update Category
                  </>
                ) : (
                  <>
                    <FiPlus size={18} />
                    Add Category
                  </>
                )}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="ArtCatagory-button ArtCatagory-button--secondary"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                >
                  <FiX size={17} />
                  Cancel
                </button>
              )}
            </div>
          </form>

        </aside>

        {/* ===================================
            RIGHT: CATEGORY TABLE
        ==================================== */}
        <div className="ArtCatagory-table-panel">
          <div className="ArtCatagory-table-panel__header">
            <div className="ArtCatagory-table-panel__title">
              <span className="ArtCatagory-panel-heading__eyebrow">
                YOUR COLLECTION
              </span>

              <h2>All Categories</h2>

              <p>View and manage existing categories stored in database.</p>
            </div>

          </div>

          {/* TABLE SEARCH */}
          <div className="ArtCatagory-table-toolbar">
            <div className="ArtCatagory-search">
              <FiSearch size={18} />

              <input
                type="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search categories"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="ArtCatagory-table-wrap">
            <table className="ArtCatagory-table">
              <thead>
                <tr>
                  <th className="ArtCatagory-table__serial">SL. NO.</th>
                  <th>CATEGORY NAME</th>
                  <th className="ArtCatagory-table__actions-heading">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="ArtCatagory-empty">
                        <FiLoader size={26} className="Coupons-spinning" />
                        <h3>Loading categories from database...</h3>
                      </div>
                    </td>
                  </tr>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => {
                    const catId = category._id || category.id;
                    return (
                      <tr key={catId}>
                        <td className="ArtCatagory-table__serial">
                          <span className="ArtCatagory-serial-badge">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>

                        <td>
                          <div className="ArtCatagory-category-cell">
                            <div className="ArtCatagory-category-cell__content">
                              <strong>{category.name}</strong>
                            </div>
                          </div>
                        </td>

                        <td className="ArtCatagory-table__actions">
                          <div className="ArtCatagory-row-actions">
                            <button
                              type="button"
                              className="ArtCatagory-action-button ArtCatagory-action-button--edit"
                              onClick={() => handleEdit(category)}
                              aria-label={`Edit ${category.name}`}
                              title="Edit category"
                            >
                              <FiEdit2 size={16} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="ArtCatagory-action-button ArtCatagory-action-button--delete"
                              onClick={() => {
                                resetMessages();
                                setDeleteId(catId);
                              }}
                              aria-label={`Delete ${category.name}`}
                              title="Delete category"
                            >
                              <FiTrash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3}>
                      <div className="ArtCatagory-empty">
                        <div className="ArtCatagory-empty__icon">
                          <FiFolder size={26} />
                        </div>

                        <h3>
                          {searchTerm
                            ? "No Categories Found"
                            : "No Categories Yet"}
                        </h3>

                        <p>
                          {searchTerm
                            ? "Try searching with another category name."
                            : "Add your first category using the form on the left to save it to database."}
                        </p>

                        {searchTerm && (
                          <button
                            type="button"
                            className="ArtCatagory-button ArtCatagory-button--secondary"
                            onClick={() => setSearchTerm("")}
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* =====================================
          DELETE CONFIRMATION MODAL
      ====================================== */}
      {deleteId !== null && (
        <div
          className="ArtCatagory-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteId(null);
            }
          }}
        >
          <div
            className="ArtCatagory-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ArtCatagory-delete-title"
            aria-describedby="ArtCatagory-delete-description"
          >
            <div className="ArtCatagory-delete-modal__icon">
              <FiTrash2 size={23} />
            </div>

            <h2 id="ArtCatagory-delete-title">Delete Category?</h2>

            <p id="ArtCatagory-delete-description">
              Are you sure you want to delete{" "}
              <strong>{deletingCategory?.name}</strong>? This will permanently remove it from the database.
            </p>

            <div className="ArtCatagory-delete-modal__actions">
              <button
                type="button"
                className="ArtCatagory-button ArtCatagory-button--secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ArtCatagory-button ArtCatagory-button--danger"
                onClick={handleDelete}
              >
                <FiTrash2 size={16} />
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArtCatagory;
