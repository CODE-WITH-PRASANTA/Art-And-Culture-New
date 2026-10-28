import React, { useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiImage,
  FiUploadCloud,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiSearch,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";

import "./Gallary.css";

import { API_BASE_URL, GALLERY_API_URL as API_URL } from "../../config/api";

const getPhotoUrl = (url) => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const Gallary = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [viewPhoto, setViewPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setGalleryItems(data.data);
      }
    } catch (err) {
      console.error("Failed to load gallery items from server:", err);
      setError("Could not connect to backend server. Please verify it is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  const resetForm = () => {
    setTitle("");
    setPhoto(null);
    setPhotoPreview("");
    setEditingId(null);
    setError("");

    clearPreviewUrl();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    clearMessages();

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Photo size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    clearPreviewUrl();

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setPhoto(file);
    setPhotoPreview(previewUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a gallery title.");
      return;
    }

    if (!photo && !photoPreview) {
      setError("Please upload a gallery photo.");
      return;
    }

    try {
      if (editingId !== null) {
        let response;
        if (photo) {
          const formData = new FormData();
          formData.append("title", trimmedTitle);
          formData.append("photo", photo);
          response = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            body: formData,
          });
        } else {
          response = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: trimmedTitle }),
          });
        }

        const data = await response.json();
        if (data.success) {
          setSuccess("Gallery item updated successfully in database.");
          fetchGalleryItems();
          resetForm();
        } else {
          setError(data.message || "Failed to update gallery item.");
        }
      } else {
        let response;
        if (photo) {
          const formData = new FormData();
          formData.append("title", trimmedTitle);
          formData.append("photo", photo);
          response = await fetch(API_URL, {
            method: "POST",
            body: formData,
          });
        } else if (photoPreview) {
          response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: trimmedTitle, photo: photoPreview }),
          });
        }

        const data = await response.json();
        if (data.success) {
          setSuccess("Gallery photo saved successfully to database.");
          fetchGalleryItems();
          resetForm();
        } else {
          setError(data.message || "Failed to save gallery photo.");
        }
      }
    } catch (err) {
      console.error("Error saving gallery item:", err);
      setError("Server error: Unable to connect to backend.");
    }
  };

  const handleEdit = (item) => {
    clearMessages();
    clearPreviewUrl();

    setEditingId(item._id || item.id);
    setTitle(item.title);
    setPhoto(null);
    setPhotoPreview(getPhotoUrl(item.photo));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      const response = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setGalleryItems((previous) =>
          previous.filter((item) => (item._id || item.id) !== deleteId)
        );

        if (editingId === deleteId) {
          resetForm();
        }

        if ((viewPhoto?._id || viewPhoto?.id) === deleteId) {
          setViewPhoto(null);
        }

        setDeleteId(null);
        setError("");
        setSuccess("Gallery item deleted successfully from database.");
      } else {
        setError(data.message || "Failed to delete gallery item.");
      }
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      setError("Server error: Unable to delete gallery item.");
    }
  };

  const filteredItems = galleryItems.filter((item) =>
    (item.title || "").toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const deletingItem = galleryItems.find(
    (item) => (item._id || item.id) === deleteId
  );

  return (
    <section className="Gallary">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <header className="Gallary-header">
        <div className="Gallary-header__content">
          <span className="Gallary-header__eyebrow">
            ART & CULTURE / MEDIA LIBRARY
          </span>

          <h1>Gallery Management</h1>

          <p>
            Upload, organize, and manage the photos that showcase your
            creative collection. Real-time synced with MongoDB.
          </p>
        </div>

        <div className="Gallary-header__summary">
          <div className="Gallary-header__summary-icon">
            <FiImage size={20} />
          </div>

          <div>
            <strong>{galleryItems.length}</strong>
            <span>Total Photos</span>
          </div>
        </div>
      </header>

      {/* =====================================
          MAIN CONTENT
      ====================================== */}
      <div className="Gallary-layout">
        {/* ===================================
            LEFT: GALLERY FORM
        ==================================== */}
        <aside className="Gallary-form-panel">
          <div className="Gallary-panel-heading">
            <div className="Gallary-panel-heading__icon">
              {editingId !== null ? (
                <FiEdit2 size={19} />
              ) : (
                <FiPlus size={21} />
              )}
            </div>

            <div>
              <span className="Gallary-panel-heading__eyebrow">
                PHOTO DETAILS
              </span>

              <h2>
                {editingId !== null ? "Edit Gallery" : "Add Gallery"}
              </h2>
            </div>
          </div>

          <p className="Gallary-form-description">
            {editingId !== null
              ? "Update the title or replace the selected photo."
              : "Add a descriptive title and upload your gallery photo."}
          </p>

          <form
            className="Gallary-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* TITLE */}
            <div className="Gallary-form__field">
              <label htmlFor="Gallary-title">
                Gallery Title <span>*</span>
              </label>

              <input
                id="Gallary-title"
                className="Gallary-form__title-input"
                type="text"
                placeholder="Enter gallery title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  clearMessages();
                }}
                maxLength={100}
                autoComplete="off"
                required
              />

              <div className="Gallary-form__hint">
                <span>Use a clear, descriptive title.</span>
                <span>{title.length}/100</span>
              </div>
            </div>

            {/* PHOTO UPLOAD */}
            <div className="Gallary-form__field">
              <label>
                Upload Photo <span>*</span>
              </label>

              <input
                ref={fileInputRef}
                id="Gallary-photo"
                className="Gallary-form__file-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />

              {photoPreview ? (
                <div className="Gallary-upload-preview">
                  <img
                    src={photoPreview}
                    alt="Gallery upload preview"
                    className="Gallary-upload-preview__image"
                  />

                  <div className="Gallary-upload-preview__overlay">
                    <span>
                      <FiCheck size={15} />
                      Photo selected
                    </span>

                    <div className="Gallary-upload-preview__actions">
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        aria-label="Replace gallery photo"
                        title="Replace photo"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview("");
                          clearPreviewUrl();
                          clearMessages();

                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        aria-label="Remove selected photo"
                        title="Remove photo"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="Gallary-upload"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="Gallary-upload__icon">
                    <FiUploadCloud size={27} />
                  </span>

                  <strong>Click to upload a photo</strong>

                  <span>
                    Select an image from your device
                  </span>

                  <span className="Gallary-upload__formats">
                    JPG, PNG, WEBP · Maximum 10 MB
                  </span>
                </button>
              )}
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                className="Gallary-message Gallary-message--error"
                role="alert"
              >
                <FiAlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {success && (
              <div
                className="Gallary-message Gallary-message--success"
                role="status"
              >
                <FiCheck size={17} />
                <span>{success}</span>
              </div>
            )}

            {/* FORM BUTTONS */}
            <div className="Gallary-form__actions">
              <button
                type="submit"
                className="Gallary-button Gallary-button--primary"
              >
                {editingId !== null ? (
                  <>
                    <FiCheck size={17} />
                    Update Gallery
                  </>
                ) : (
                  <>
                    <FiPlus size={18} />
                    Add to Gallery
                  </>
                )}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="Gallary-button Gallary-button--secondary"
                  onClick={resetForm}
                >
                  <FiX size={17} />
                  Cancel
                </button>
              )}
            </div>
          </form>


        </aside>

        {/* ===================================
            RIGHT: GALLERY TABLE
        ==================================== */}
        <div className="Gallary-table-panel">
          <div className="Gallary-table-panel__header">
            <div className="Gallary-table-panel__heading">
              <span className="Gallary-panel-heading__eyebrow">
                YOUR COLLECTION
              </span>

              <h2>Gallery Data</h2>

              <p>Browse, edit, and organize your uploaded photos.</p>
            </div>

            <span className="Gallary-count">
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "photo" : "photos"}
            </span>
          </div>

          {/* SEARCH */}
          <div className="Gallary-toolbar">
            <div className="Gallary-search">
              <FiSearch size={18} />

              <input
                type="search"
                placeholder="Search gallery title..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search gallery"
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
          <div className="Gallary-table-wrap">
            <table className="Gallary-table">
              <thead>
                <tr>
                  <th className="Gallary-table__serial-heading">
                    SL. NO.
                  </th>

                  <th>TITLE</th>

                  <th>PHOTO</th>

                  <th className="Gallary-table__action-heading">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => {
                    const itemId = item._id || item.id;
                    const photoSrc = getPhotoUrl(item.photo || item.image);

                    return (
                      <tr key={itemId}>
                        <td className="Gallary-table__serial">
                          <span className="Gallary-serial-badge">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>

                        <td className="Gallary-table__title">
                          <strong>{item.title}</strong>
                          <span>{item.category || "Gallery photo"}</span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="Gallary-thumbnail-button"
                            onClick={() => setViewPhoto(item)}
                            aria-label={`View photo: ${item.title}`}
                            title="View photo"
                          >
                            <img
                              className="Gallary-thumbnail"
                              src={photoSrc}
                              alt={item.title}
                            />

                            <span className="Gallary-thumbnail__overlay">
                              <FiEye size={17} />
                            </span>
                          </button>
                        </td>

                        <td className="Gallary-table__actions">
                          <div className="Gallary-row-actions">
                            <button
                              type="button"
                              className="Gallary-action-button Gallary-action-button--edit"
                              onClick={() => handleEdit(item)}
                              title="Edit gallery item"
                              aria-label={`Edit ${item.title}`}
                            >
                              <FiEdit2 size={15} />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              className="Gallary-action-button Gallary-action-button--delete"
                              onClick={() => {
                                clearMessages();
                                setDeleteId(itemId);
                              }}
                              title="Delete gallery item"
                              aria-label={`Delete ${item.title}`}
                            >
                              <FiTrash2 size={15} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="Gallary-empty">
                        <div className="Gallary-empty__icon">
                          <FiImage size={27} />
                        </div>

                        <h3>
                          {searchTerm
                            ? "No Photos Found"
                            : "Your Gallery Is Empty"}
                        </h3>

                        <p>
                          {searchTerm
                            ? "Try a different search term to find your gallery photos."
                            : "Upload your first photo using the form on the left. Your gallery items will appear here."}
                        </p>

                        {searchTerm && (
                          <button
                            type="button"
                            className="Gallary-button Gallary-button--secondary"
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
          PHOTO VIEW MODAL
      ====================================== */}
      {viewPhoto && (
        <div
          className="Gallary-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewPhoto(null);
            }
          }}
        >
          <div
            className="Gallary-photo-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo preview: ${viewPhoto.title}`}
          >
            <div className="Gallary-photo-modal__header">
              <div>
                <span>GALLERY PREVIEW</span>
                <h2>{viewPhoto.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setViewPhoto(null)}
                aria-label="Close photo preview"
              >
                <FiX size={21} />
              </button>
            </div>

            <div className="Gallary-photo-modal__body">
              <img
                src={getPhotoUrl(viewPhoto.photo || viewPhoto.image)}
                alt={viewPhoto.title}
              />
            </div>

            <div className="Gallary-photo-modal__footer">
              <button
                type="button"
                className="Gallary-button Gallary-button--secondary"
                onClick={() => setViewPhoto(null)}
              >
                Close Preview
              </button>

              <button
                type="button"
                className="Gallary-button Gallary-button--primary"
                onClick={() => {
                  const selectedItem = viewPhoto;
                  setViewPhoto(null);
                  handleEdit(selectedItem);
                }}
              >
                <FiEdit2 size={16} />
                Edit Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          DELETE CONFIRMATION MODAL
      ====================================== */}
      {deleteId !== null && (
        <div
          className="Gallary-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteId(null);
            }
          }}
        >
          <div
            className="Gallary-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="Gallary-delete-title"
            aria-describedby="Gallary-delete-description"
          >
            <div className="Gallary-delete-modal__icon">
              <FiTrash2 size={23} />
            </div>

            <h2 id="Gallary-delete-title">Delete Gallery Photo?</h2>

            <p id="Gallary-delete-description">
              Are you sure you want to delete{" "}
              <strong>{deletingItem?.title}</strong>? This action
              will remove it from the database permanently.
            </p>

            <div className="Gallary-delete-modal__actions">
              <button
                type="button"
                className="Gallary-button Gallary-button--secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="Gallary-button Gallary-button--danger"
                onClick={handleDelete}
              >
                <FiTrash2 size={16} />
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallary;
