
import React, { useState } from "react";
import {
  FiPlus,
  FiTag,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiLayers,
  FiSearch,
  FiFolder,
  FiAlertCircle,
} from "react-icons/fi";

import "./ArtCatagory.css";

const ArtCatagory = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Traditional Art" },
    { id: 2, name: "Modern Art" },
    { id: 3, name: "Canvas Painting" },
    { id: 4, name: "Handmade Crafts" },
    { id: 5, name: "Sculptures" },
  ]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    resetMessages();

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      setError("Please enter a category name.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedName.toLowerCase() &&
        category.id !== editingId
    );

    if (duplicate) {
      setError("This category already exists. Please use another name.");
      return;
    }

    if (editingId !== null) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingId
            ? { ...category, name: trimmedName }
            : category
        )
      );

      setSuccess("Category updated successfully.");
    } else {
      const newCategory = {
        id: Date.now(),
        name: trimmedName,
      };

      setCategories((previous) => [...previous, newCategory]);
      setSuccess("New category added successfully.");
    }

    setCategoryName("");
    setEditingId(null);
  };

  const handleEdit = (category) => {
    resetMessages();
    setCategoryName(category.name);
    setEditingId(category.id);
  };

  const handleCancelEdit = () => {
    setCategoryName("");
    setEditingId(null);
    resetMessages();
  };

  const handleDelete = () => {
    if (deleteId === null) return;

    setCategories((previous) =>
      previous.filter((category) => category.id !== deleteId)
    );

    if (editingId === deleteId) {
      setCategoryName("");
      setEditingId(null);
    }

    setDeleteId(null);
    setSuccess("Category deleted successfully.");
    setError("");
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const deletingCategory = categories.find(
    (category) => category.id === deleteId
  );

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
            collection structured.
          </p>
        </div>

        <div className="ArtCatagory-header__badge">
          <span className="ArtCatagory-header__badge-icon">
            <FiLayers size={18} />
          </span>

          <div>
            <strong>{categories.length}</strong>
            <span>Total Categories</span>
          </div>
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
              ? "Update the name of your selected category."
              : "Create a new category to organize your artworks."}
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
              >
                {editingId !== null ? (
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
                >
                  <FiX size={17} />
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* FORM INFORMATION CARD */}
          <div className="ArtCatagory-info-card">
            <div className="ArtCatagory-info-card__icon">
              <FiFolder size={20} />
            </div>

            <div>
              <h3>Keep It Organized</h3>
              <p>
                Use meaningful category names to help organize and
                identify your artwork collection.
              </p>
            </div>
          </div>
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

              <p>View and manage your existing categories.</p>
            </div>

            <span className="ArtCatagory-count">
              {filteredCategories.length}{" "}
              {filteredCategories.length === 1 ? "category" : "categories"}
            </span>
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
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => (
                    <tr key={category.id}>
                      <td className="ArtCatagory-table__serial">
                        <span className="ArtCatagory-serial-badge">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      <td>
                        <div className="ArtCatagory-category-cell">
                          <span className="ArtCatagory-category-cell__icon">
                            <FiTag size={17} />
                          </span>

                          <div className="ArtCatagory-category-cell__content">
                            <strong>{category.name}</strong>
                            <span>Artwork category</span>
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
                              setDeleteId(category.id);
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
                  ))
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
                            : "Add your first category using the form on the left."}
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

          {/* TABLE FOOTER */}
          <div className="ArtCatagory-table-footer">
            <span>
              Showing{" "}
              <strong>{filteredCategories.length}</strong> of{" "}
              <strong>{categories.length}</strong> categories
            </span>

            <span className="ArtCatagory-table-footer__note">
              <FiCheck size={14} />
              Category overview
            </span>
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
              <strong>{deletingCategory?.name}</strong>? This action
              cannot be undone.
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
