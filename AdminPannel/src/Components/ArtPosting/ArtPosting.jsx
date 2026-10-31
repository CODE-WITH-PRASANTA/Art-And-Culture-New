import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  FiPlus,
  FiGrid,
  FiList,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiUploadCloud,
  FiX,
  FiSave,
  FiEye,
  FiPackage,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import "./ArtPosting.css";

import { API_BASE_URL, ARTS_API_URL, CATEGORIES_API_URL } from "../../config/api";

const emptyForm = {
  artNo: "",
  title: "",
  description: "",
  category: "",
  artistName: "",
  price: "",
  discount: "0",
  stockQuantity: "",
  tags: [],
  tagsInput: "",
  artistAbout: "",
  sizeOverview: "",
  framing: "No",
  themeDetails: "",
  photos: [],
  signature: null,
  certificate: "No",
  isPublished: true,
  isGeneralArtwork: true,
  isStreamingCollection: false,
  artType: "General Artwork",
};

const getImageUrl = (photo) => {
  if (!photo) return "";
  if (typeof photo === "string") {
    if (photo.startsWith("data:") || photo.startsWith("http")) return photo;
    return `${API_BASE_URL}${photo}`;
  }
  if (photo.dataUrl && photo.dataUrl.startsWith("data:")) return photo.dataUrl;
  if (photo.url) {
    if (photo.url.startsWith("http")) return photo.url;
    return `${API_BASE_URL}${photo.url}`;
  }
  if (photo.dataUrl) {
    if (photo.dataUrl.startsWith("http")) return photo.dataUrl;
    return `${API_BASE_URL}${photo.dataUrl}`;
  }
  return "";
};

const getNextArtNumber = (arts) => {
  const highestExisting = (arts || []).reduce((max, art) => {
    const match = String(art.artNo || "").match(/ART-(\d+)/i);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return highestExisting + 1;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getDiscountedPrice = (price, discount) => {
  return Math.max(
    0,
    Number(price || 0) -
      (Number(price || 0) * Number(discount || 0)) / 100
  );
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file."));

    reader.readAsDataURL(file);
  });

const ArtPosting = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const editParam = searchParams.get("edit");
  const modeParam = searchParams.get("mode");

  const [arts, setArts] = useState([]);
  const [loadingArts, setLoadingArts] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [activeView, setActiveView] = useState("form");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewArt, setPreviewArt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const photoInputRef = useRef(null);
  const signatureInputRef = useRef(null);

  const itemsPerPage = 8;

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch live arts from database
  const fetchArts = async () => {
    try {
      setLoadingArts(true);
      const res = await fetch(ARTS_API_URL);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setArts(json.data);
      } else {
        setArts([]);
      }
    } catch (err) {
      console.error("Failed to load artworks in ArtPosting:", err);
    } finally {
      setLoadingArts(false);
    }
  };

  useEffect(() => {
    fetchArts();
  }, []);

  // Auto-open artwork in edit mode if ?edit=<id> is in URL
  useEffect(() => {
    if (!editParam) return;

    const loadArtToEdit = async () => {
      try {
        const res = await fetch(`${ARTS_API_URL}/${editParam}`);
        const json = await res.json();
        if (json.success && json.data) {
          handleEdit(json.data);
        }
      } catch (err) {
        console.error("Failed to load artwork for editing:", err);
      }
    };

    loadArtToEdit();
  }, [editParam]);

  // Open fresh creation form if ?mode=new is in URL
  useEffect(() => {
    if (modeParam === "new") {
      setEditingId(null);
      setForm(emptyForm);
      setPhotoPreviews([]);
      setSignaturePreview(null);
      setActiveView("form");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [modeParam]);

  // Fetch live categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch(CATEGORIES_API_URL);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const names = json.data.map((cat) => cat.name);
          setCategories(names);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Failed to load categories in ArtPosting:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const nextArtNo = useMemo(() => {
    return `ART-${String(getNextArtNumber(arts)).padStart(4, "0")}`;
  }, [arts]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotosChange = async (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (!selectedFiles.length) return;

    const remainingSlots = 5 - photoPreviews.length;

    if (remainingSlots <= 0) {
      setNotice({
        type: "error",
        text: "You can upload a maximum of five artwork photos.",
      });
      return;
    }

    const acceptedFiles = selectedFiles.slice(0, remainingSlots);
    const newPhotos = [];

    for (const file of acceptedFiles) {
      if (!file.type.startsWith("image/")) {
        setNotice({
          type: "error",
          text: "Only image files are allowed.",
        });
        continue;
      }

      if (file.size > 3 * 1024 * 1024) {
        setNotice({
          type: "error",
          text: `${file.name} exceeds the 3 MB limit.`,
        });
        continue;
      }

      try {
        const dataUrl = await fileToDataUrl(file);

        newPhotos.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          dataUrl,
        });
      } catch {
        setNotice({
          type: "error",
          text: `Could not read ${file.name}.`,
        });
      }
    }

    setPhotoPreviews((prev) => [...prev, ...newPhotos].slice(0, 5));

    if (selectedFiles.length > remainingSlots) {
      setNotice({
        type: "error",
        text: "Only five photos are allowed. Extra files were skipped.",
      });
    }
  };

  const removePhoto = (photoId) => {
    setPhotoPreviews((prev) =>
      prev.filter((photo) => photo.id !== photoId)
    );
  };

  const handleSignatureChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice({
        type: "error",
        text: "Please select an image for the artist signature.",
      });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setNotice({
        type: "error",
        text: "Signature image must be smaller than 3 MB.",
      });
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);

      setSignaturePreview({
        name: file.name,
        dataUrl,
      });
    } catch {
      setNotice({
        type: "error",
        text: "Could not read the signature image.",
      });
    }
  };

  const removeSignature = () => {
    setSignaturePreview(null);
  };

  const handleTagsKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();

      const value = form.tagsInput.trim().replace(/,$/, "");
      if (!value) return;

      setForm((prev) => ({
        ...prev,
        tags: [
          ...new Set([
            ...prev.tags,
            ...value.split(",").map((tag) => tag.trim()).filter(Boolean),
          ]),
        ],
        tagsInput: "",
      }));
    }
  };

  const addTagsFromInput = () => {
    const values = form.tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,
      tags: [...new Set([...prev.tags, ...values])],
      tagsInput: "",
    }));
  };

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPhotoPreviews([]);
    setSignaturePreview(null);

    if (photoInputRef.current) photoInputRef.current.value = "";
    if (signatureInputRef.current) {
      signatureInputRef.current.value = "";
    }
    if (searchParams.get("edit")) {
      setSearchParams({}, { replace: true });
    }
  };

  const openNewForm = () => {
    resetForm();
    setActiveView("form");
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Please enter the artwork title.";
    if (!form.category) return "Please select an artwork category.";
    if (!form.artistName.trim()) return "Please enter the artist name.";
    if (form.description.replace(/<[^>]*>/g, "").trim().length === 0) {
      return "Please enter the artwork description.";
    }
    if (photoPreviews.length === 0) {
      return "Please upload at least one artwork photo.";
    }
    if (form.price === "" || Number(form.price) <= 0) {
      return "Please enter a price greater than zero.";
    }
    if (Number(form.discount) < 0 || Number(form.discount) > 100) {
      return "Discount must be between 0 and 100.";
    }
    if (
      form.stockQuantity === "" ||
      !Number.isInteger(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    ) {
      return "Please enter a valid, non-negative stock quantity.";
    }
    if (!form.sizeOverview.trim()) return "Please enter the size overview.";
    if (form.tags.length === 0 && !form.tagsInput.trim()) {
      return "Please add at least one artwork tag.";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setNotice({
        type: "error",
        text: validationError,
      });
      return;
    }

    addTagsFromInput();

    const pendingTags = form.tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const finalTags = [
      ...new Set([...form.tags, ...pendingTags]),
    ];

    const payload = {
      ...form,
      tags: finalTags,
      tagsInput: "",
      artNo: editingId ? form.artNo : nextArtNo,
      price: Number(form.price),
      discount: Number(form.discount || 0),
      stockQuantity: Number(form.stockQuantity),
      isPublished: Boolean(form.isPublished),
      isGeneralArtwork: Boolean(form.isGeneralArtwork),
      isStreamingCollection: Boolean(form.isStreamingCollection),
      status: form.isPublished ? "Published" : "Unpublished",
      artType:
        form.isGeneralArtwork && form.isStreamingCollection
          ? "General & Streaming"
          : form.isStreamingCollection
          ? "Streaming Collection"
          : "General Artwork",
      photos: photoPreviews,
      signature: signaturePreview,
    };

    setIsSaving(true);

    try {
      const endpoint = editingId
        ? `${ARTS_API_URL}/${editingId}`
        : ARTS_API_URL;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.message || "Failed to save artwork.");
      }

      setNotice({
        type: "success",
        text:
          resData.message ||
          (editingId
            ? "Artwork updated successfully."
            : `${payload.artNo} created successfully.`),
      });

      await fetchArts();
      resetForm();
      setActiveView("table");
      setCurrentPage(1);
    } catch (err) {
      console.error("Save error:", err);
      setNotice({
        type: "error",
        text: err.message || "Error saving artwork to database.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (art) => {
    setEditingId(art._id || art.id);

    setForm({
      ...emptyForm,
      ...art,
      artNo: art.artNo,
      title: art.title,
      description: art.description || "",
      category: art.category,
      artistName: art.artistName,
      price: art.price,
      discount: art.discount !== undefined ? String(art.discount) : "0",
      stockQuantity:
        art.stockQuantity !== undefined ? String(art.stockQuantity) : "",
      artistAbout: art.artistAbout || "",
      sizeOverview: art.sizeOverview || "",
      framing: art.framing || "No",
      themeDetails: art.themeDetails || "",
      certificate: art.certificate || "No",
      isPublished:
        art.isPublished !== undefined
          ? Boolean(art.isPublished)
          : art.status !== "Unpublished" && art.status !== "Draft",
      isGeneralArtwork:
        art.isGeneralArtwork !== undefined
          ? Boolean(art.isGeneralArtwork)
          : art.artType !== "Streaming Collection",
      isStreamingCollection:
        art.isStreamingCollection !== undefined
          ? Boolean(art.isStreamingCollection)
          : art.artType === "Streaming Collection" || art.artType === "General & Streaming",
      artType: art.artType || "General Artwork",
      tags: art.tags || [],
      tagsInput: "",
    });

    const mappedPhotos = (art.photos || []).map((p, idx) => ({
      id: p.id || `photo-${idx}`,
      name: p.name || `photo-${idx + 1}`,
      dataUrl: getImageUrl(p),
      url: p.url,
    }));
    setPhotoPreviews(mappedPhotos);

    if (art.signature) {
      setSignaturePreview({
        name: art.signature.name || "signature",
        dataUrl: getImageUrl(art.signature),
        url: art.signature.url,
      });
    } else {
      setSignaturePreview(null);
    }

    setActiveView("form");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const targetId = deleteTarget._id || deleteTarget.id;

    try {
      const res = await fetch(`${ARTS_API_URL}/${targetId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete artwork.");
      }

      setNotice({
        type: "success",
        text: "Artwork deleted successfully from database.",
      });

      if (editingId === targetId) {
        resetForm();
      }

      setDeleteTarget(null);
      await fetchArts();
    } catch (err) {
      console.error("Delete error:", err);
      setNotice({
        type: "error",
        text: err.message || "Could not delete artwork.",
      });
    }
  };

  const filteredArts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return arts.filter((art) => {
      const matchesSearch = [
        art.artNo,
        art.title,
        art.artistName,
        art.category,
        ...(art.tags || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchText);

      const matchesCategory =
        filterCategory === "All" ||
        art.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [arts, search, filterCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArts.length / itemsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedArts = filteredArts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const totalStock = arts.reduce(
    (total, art) => total + Number(art.stockQuantity || 0),
    0
  );

  const totalValue = arts.reduce(
    (total, art) =>
      total +
      getDiscountedPrice(art.price, art.discount) *
        Number(art.stockQuantity || 0),
    0
  );

  const editorInit = {
    height: 250,
    menubar: "edit view insert format tools",
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "code",
      "fullscreen",
      "insertdatetime",
      "table",
      "wordcount",
    ],
    toolbar:
      "undo redo | blocks | bold italic underline | " +
      "forecolor backcolor | alignleft aligncenter alignright | " +
      "bullist numlist | link table | removeformat | code",
    content_style:
      "body { font-family: Arial, sans-serif; font-size: 14px; color: #40372e; line-height: 1.7; }",
    branding: false,
    promotion: false,
    resize: true,
  };

  return (
    <div className="ArtPosting">
      {/* Header */}
      <header className="ArtPosting-header">
        <div className="ArtPosting-header__content">
          <span className="ArtPosting-header__eyebrow">
            ART COLLECTION / ADMINISTRATION
          </span>

          <h1>Art Management</h1>

          <p>
            Create, organize, and manage your artwork collection.
          </p>
        </div>

        <button
          type="button"
          className="ArtPosting-header__add"
          onClick={openNewForm}
        >
          <FiPlus />
          <span>Add New Art</span>
        </button>
      </header>

      {/* Summary Cards */}
      <section className="ArtPosting-stats">
        <div className="ArtPosting-stat">
          <div className="ArtPosting-stat__icon">
            <FiImage />
          </div>
          <div>
            <span className="ArtPosting-stat__label">
              Total Artworks
            </span>
            <strong>{arts.length}</strong>
          </div>
        </div>

        <div className="ArtPosting-stat">
          <div className="ArtPosting-stat__icon">
            <FiPackage />
          </div>
          <div>
            <span className="ArtPosting-stat__label">
              Available Stock
            </span>
            <strong>{totalStock}</strong>
          </div>
        </div>

        <div className="ArtPosting-stat">
          <div className="ArtPosting-stat__icon">
            <FiTag />
          </div>
          <div>
            <span className="ArtPosting-stat__label">
              Categories Used
            </span>
            <strong>
              {new Set(arts.map((art) => art.category)).size}
            </strong>
          </div>
        </div>

        <div className="ArtPosting-stat">
          <div className="ArtPosting-stat__icon">
            <FiGrid />
          </div>
          <div>
            <span className="ArtPosting-stat__label">
              Stock Value
            </span>
            <strong className="ArtPosting-stat__value">
              {formatCurrency(totalValue)}
            </strong>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="ArtPosting-workspace">
        {/* Left View Switcher */}
        <aside className="ArtPosting-switcher">
          <span className="ArtPosting-switcher__label">
            WORKSPACE
          </span>

          <button
            type="button"
            className={`ArtPosting-switcher__button ${
              activeView === "form"
                ? "ArtPosting-switcher__button--active"
                : ""
            }`}
            onClick={() => setActiveView("form")}
          >
            <FiPlus />
            <span>Art Form</span>
          </button>

          <button
            type="button"
            className={`ArtPosting-switcher__button ${
              activeView === "table"
                ? "ArtPosting-switcher__button--active"
                : ""
            }`}
            onClick={() => setActiveView("table")}
          >
            <FiList />
            <span>Art Data</span>
            <span className="ArtPosting-switcher__count">
              {arts.length}
            </span>
          </button>

          <div className="ArtPosting-switcher__note">
            <FiCheckCircle />
            <p>
              Keep your artwork details accurate and your collection
              organized.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ArtPosting-main">
          {activeView === "form" ? (
            <form
              className="ArtPosting-form"
              onSubmit={handleSubmit}
            >
              <div className="ArtPosting-panel-header">
                <div>
                  <span className="ArtPosting-panel-header__eyebrow">
                    {editingId ? "UPDATE COLLECTION" : "NEW COLLECTION"}
                  </span>

                  <h2>
                    {editingId ? "Edit Artwork" : "Post New Artwork"}
                  </h2>

                  <p>
                    Complete the details below to manage your artwork.
                  </p>
                </div>

                <div className="ArtPosting-art-number">
                  <span>ART NO.</span>
                  <strong>
                    {editingId ? form.artNo : nextArtNo}
                  </strong>
                  <small>
                    {editingId ? "Existing record" : "Auto-generated"}
                  </small>
                </div>
              </div>

              {/* Artwork Images */}
              <section className="ArtPosting-section">
                <div className="ArtPosting-section__heading">
                  <div className="ArtPosting-section__number">01</div>
                  <div>
                    <h3>Artwork Photos</h3>
                    <p>
                      Upload up to five clear, high-quality images.
                    </p>
                  </div>
                </div>

                <div className="ArtPosting-photos">
                  {photoPreviews.map((photo, index) => (
                    <div
                      className="ArtPosting-photo"
                      key={photo.id || `${photo.name}-${index}`}
                    >
                      <img src={getImageUrl(photo)} alt={photo.name} />

                      <span className="ArtPosting-photo__number">
                        {index + 1}
                      </span>

                      <button
                        type="button"
                        className="ArtPosting-photo__remove"
                        onClick={() => removePhoto(photo.id)}
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <FiX />
                      </button>

                      {index === 0 && (
                        <span className="ArtPosting-photo__primary">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}

                  {photoPreviews.length < 5 && (
                    <button
                      type="button"
                      className="ArtPosting-photo-upload"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <FiUploadCloud />
                      <strong>Add Photo</strong>
                      <span>
                        {photoPreviews.length}/5 uploaded
                      </span>
                    </button>
                  )}
                </div>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handlePhotosChange}
                />

                <p className="ArtPosting-help">
                  Supported image formats. Maximum 3 MB per image.
                  Upload at least one photo.
                </p>
              </section>

              {/* Basic Details */}
              <section className="ArtPosting-section">
                <div className="ArtPosting-section__heading">
                  <div className="ArtPosting-section__number">02</div>
                  <div>
                    <h3>Basic Information</h3>
                    <p>Enter the artwork's main details.</p>
                  </div>
                </div>

                <div className="ArtPosting-grid ArtPosting-grid--two">
                  <div className="ArtPosting-field">
                    <label htmlFor="ArtPosting-title">
                      Artwork Title <span>*</span>
                    </label>
                    <input
                      id="ArtPosting-title"
                      type="text"
                      placeholder="e.g. The Golden Heritage"
                      value={form.title}
                      onChange={(e) =>
                        updateField("title", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="ArtPosting-field">
                    <label htmlFor="ArtPosting-category">
                      Category <span>*</span>
                    </label>
                    <select
                      id="ArtPosting-category"
                      value={form.category}
                      onChange={(e) =>
                        updateField("category", e.target.value)
                      }
                      required
                    >
                      <option value="">
                        {loadingCategories
                          ? "Loading categories..."
                          : categories.length === 0
                          ? "No categories found"
                          : "Select category"}
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ArtPosting-field">
                    <label htmlFor="ArtPosting-artist">
                      Artist Name <span>*</span>
                    </label>
                    <input
                      id="ArtPosting-artist"
                      type="text"
                      placeholder="Enter artist's full name"
                      value={form.artistName}
                      onChange={(e) =>
                        updateField("artistName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="ArtPosting-field">
                    <label htmlFor="ArtPosting-size">
                      Size Overview <span>*</span>
                    </label>
                    <input
                      id="ArtPosting-size"
                      type="text"
                      placeholder="e.g. 24 × 36 inches"
                      value={form.sizeOverview}
                      onChange={(e) =>
                        updateField("sizeOverview", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="ArtPosting-field ArtPosting-field--editor">
                  <label>Artwork Description <span>*</span></label>
                  <Editor
                    apiKey="8hswbe7bfeeneui9eb9gjgsym8ku30nx5gwre9808ajdzniu"
                    value={form.description}
                    onEditorChange={(value) =>
                      updateField("description", value)
                    }
                    init={editorInit}
                  />
                </div>
              </section>

              {/* Pricing and Inventory */}
              <section className="ArtPosting-section">
                <div className="ArtPosting-section__heading">
                  <div className="ArtPosting-section__number">03</div>
                  <div>
                    <h3>Pricing & Inventory</h3>
                    <p>Set the selling price and stock availability.</p>
                  </div>
                </div>

                <div className="ArtPosting-grid ArtPosting-grid--four">
                  <div className="ArtPosting-field">
                    <label htmlFor="ArtPosting-price">
                      Price (₹) <span>*</span>
                    </label>
                    <div className="ArtPosting-input-prefix">
                      <span>₹</span>
                      <input
                        id="ArtPosting-price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) =>
                          updateField("price", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="ArtPosting-field">
                    <label htmlFor="ArtPosting-discount">
                      Discount (%)
                    </label>
                    <div className="ArtPosting-input-prefix">
                      <input
                        id="ArtPosting-discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="0"
                        value={form.discount}
                        onChange={(e) =>
                          updateField("discount", e.target.value)
                        }
                      />
                      <span>%</span>
                    </div>
                  </div>

                  <div className="ArtPosting-field">
                    <label htmlFor="ArtPosting-stock">
                      Stock Quantity <span>*</span>
                    </label>
                    <input
                      id="ArtPosting-stock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={form.stockQuantity}
                      onChange={(e) =>
                        updateField("stockQuantity", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="ArtPosting-field">
                    <label>Final Price</label>
                    <div className="ArtPosting-price-preview">
                      <strong>
                        {formatCurrency(
                          getDiscountedPrice(
                            form.price,
                            form.discount
                          )
                        )}
                      </strong>
                      {Number(form.discount) > 0 && (
                        <small>
                          {form.discount}% discount applied
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Tags */}
              <section className="ArtPosting-section">
                <div className="ArtPosting-section__heading">
                  <div className="ArtPosting-section__number">04</div>
                  <div>
                    <h3>Artwork Tags</h3>
                    <p>
                      Add searchable keywords to help customers discover
                      the artwork.
                    </p>
                  </div>
                </div>

                <div className="ArtPosting-field">
                  <label htmlFor="ArtPosting-tags">
                    Tags <span>*</span>
                  </label>

                  <div className="ArtPosting-tags-input">
                    {form.tags.map((tag) => (
                      <span className="ArtPosting-tag" key={tag}>
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          aria-label={`Remove ${tag}`}
                        >
                          <FiX />
                        </button>
                      </span>
                    ))}

                    <input
                      id="ArtPosting-tags"
                      type="text"
                      placeholder="Type a tag and press Enter"
                      value={form.tagsInput}
                      onChange={(e) =>
                        updateField("tagsInput", e.target.value)
                      }
                      onKeyDown={handleTagsKeyDown}
                      onBlur={addTagsFromInput}
                    />
                  </div>

                  <p className="ArtPosting-help">
                    Press Enter or a comma to add each tag. Examples:
                    Original Art, Canvas, Odisha, Handmade.
                  </p>
                </div>
              </section>

              {/* Artist Information */}
              <section className="ArtPosting-section">
                <div className="ArtPosting-section__heading">
                  <div className="ArtPosting-section__number">05</div>
                  <div>
                    <h3>Artist & Theme Details</h3>
                    <p>Share the artist's story and artwork context.</p>
                  </div>
                </div>

                <div className="ArtPosting-field ArtPosting-field--editor">
                  <label>Artist About</label>
                  <Editor
                    apiKey="8hswbe7bfeeneui9eb9gjgsym8ku30nx5gwre9808ajdzniu"
                    value={form.artistAbout}
                    onEditorChange={(value) =>
                      updateField("artistAbout", value)
                    }
                    init={{
                      ...editorInit,
                      height: 220,
                    }}
                  />
                </div>

                <div className="ArtPosting-field">
                  <label htmlFor="ArtPosting-theme">
                    Theme Details
                  </label>
                  <textarea
                    id="ArtPosting-theme"
                    rows="4"
                    placeholder="Describe the inspiration, artistic style, story, and theme..."
                    value={form.themeDetails}
                    onChange={(e) =>
                      updateField("themeDetails", e.target.value)
                    }
                  />
                </div>
              </section>

              {/* Finishing and Documents */}
              <section className="ArtPosting-section">
                <div className="ArtPosting-section__heading">
                  <div className="ArtPosting-section__number">06</div>
                  <div>
                    <h3>Finishing & Authentication</h3>
                    <p>Specify framing and authenticity information.</p>
                  </div>
                </div>

                <div className="ArtPosting-grid ArtPosting-grid--two">
                  <div className="ArtPosting-field">
                    <label>Framing Available?</label>
                    <div className="ArtPosting-radio-group">
                      {["Yes", "No"].map((value) => (
                        <label
                          key={value}
                          className={`ArtPosting-radio ${
                            form.framing === value
                              ? "ArtPosting-radio--active"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="ArtPosting-framing"
                            value={value}
                            checked={form.framing === value}
                            onChange={(e) =>
                              updateField("framing", e.target.value)
                            }
                          />
                          <span className="ArtPosting-radio__indicator" />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="ArtPosting-field">
                    <label>Certificate of Authenticity?</label>
                    <div className="ArtPosting-radio-group">
                      {["Yes", "No"].map((value) => (
                        <label
                          key={value}
                          className={`ArtPosting-radio ${
                            form.certificate === value
                              ? "ArtPosting-radio--active"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="ArtPosting-certificate"
                            value={value}
                            checked={form.certificate === value}
                            onChange={(e) =>
                              updateField("certificate", e.target.value)
                            }
                          />
                          <span className="ArtPosting-radio__indicator" />
                          {value}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ArtPosting-field">
                  <label>Artist Signature</label>

                  {signaturePreview ? (
                    <div className="ArtPosting-signature-preview">
                      <img
                        src={getImageUrl(signaturePreview)}
                        alt="Artist signature"
                      />

                      <span>{signaturePreview.name}</span>

                      <button
                        type="button"
                        onClick={removeSignature}
                        aria-label="Remove signature"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="ArtPosting-signature-upload"
                      onClick={() =>
                        signatureInputRef.current?.click()
                      }
                    >
                      <FiUploadCloud />
                      <span>
                        <strong>Upload Artist Signature</strong>
                        <small>PNG, JPG or other image formats</small>
                      </span>
                    </button>
                  )}

                  <input
                    ref={signatureInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleSignatureChange}
                  />
                </div>
              </section>


              {/* Form Actions */}
              <div className="ArtPosting-form-actions">
                <button
                  type="button"
                  className="ArtPosting-button ArtPosting-button--secondary"
                  onClick={resetForm}
                >
                  <FiX />
                  {editingId ? "Cancel Edit" : "Reset Form"}
                </button>

                <button
                  type="submit"
                  className="ArtPosting-button ArtPosting-button--primary"
                  disabled={isSaving}
                >
                  <FiSave />
                  {isSaving
                    ? "Saving..."
                    : editingId
                    ? "Update Artwork"
                    : "Save Artwork"}
                </button>
              </div>
            </form>
          ) : (
            /* Artwork Table */
            <section className="ArtPosting-table-panel">
              <div className="ArtPosting-panel-header">
                <div>
                  <span className="ArtPosting-panel-header__eyebrow">
                    COLLECTION DATABASE
                  </span>
                  <h2>Artwork Records</h2>
                  <p>
                    View, search, edit, and manage your artworks.
                  </p>
                </div>

                <button
                  type="button"
                  className="ArtPosting-button ArtPosting-button--primary"
                  onClick={openNewForm}
                >
                  <FiPlus />
                  Add Artwork
                </button>
              </div>

              <div className="ArtPosting-table-toolbar">
                <div className="ArtPosting-search">
                  <FiSearch />
                  <input
                    type="search"
                    placeholder="Search art no., title, artist..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <select
                  className="ArtPosting-category-filter"
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by category"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ArtPosting-table-scroll">
                <table className="ArtPosting-table">
                  <thead>
                    <tr>
                      <th>Artwork</th>
                      <th>Art No.</th>
                      <th>Artist</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedArts.length ? (
                      paginatedArts.map((art) => (
                        <tr key={art._id || art.id || art.artNo}>
                          <td>
                            <div className="ArtPosting-table-artwork">
                              <div className="ArtPosting-table-artwork__image">
                                {getImageUrl(art.photos?.[0]) ? (
                                  <img
                                    src={getImageUrl(art.photos[0])}
                                    alt={art.title}
                                  />
                                ) : (
                                  <FiImage />
                                )}
                              </div>

                              <div className="ArtPosting-table-artwork__info">
                                <strong>{art.title}</strong>
                                <span>
                                  {art.photos?.length || 0} photo(s)
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="ArtPosting-art-badge">
                              {art.artNo}
                            </span>
                          </td>

                          <td>{art.artistName}</td>

                          <td>
                            <span className="ArtPosting-category-badge">
                              {art.category}
                            </span>
                          </td>

                          <td>
                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                              {art.isGeneralArtwork !== false && (
                                <span className="ArtPosting-type-badge ArtPosting-type-badge--gold">
                                  General
                                </span>
                              )}
                              {Boolean(art.isStreamingCollection) && (
                                <span className="ArtPosting-type-badge ArtPosting-type-badge--purple">
                                  Streaming
                                </span>
                              )}
                              {art.isGeneralArtwork === false && !art.isStreamingCollection && (
                                <span style={{ color: "#9c8e7e", fontSize: "11px" }}>None</span>
                              )}
                            </div>
                          </td>

                          <td>
                            <div className="ArtPosting-table-price">
                              <strong>
                                {formatCurrency(
                                  getDiscountedPrice(
                                    art.price,
                                    art.discount
                                  )
                                )}
                              </strong>

                              {Number(art.discount) > 0 && (
                                <del>
                                  {formatCurrency(art.price)}
                                </del>
                              )}
                            </div>
                          </td>

                          <td>{art.stockQuantity}</td>

                          <td>
                            <span
                              className={`ArtPosting-status-badge ${
                                art.isPublished === false ||
                                art.status === "Unpublished"
                                  ? "ArtPosting-status-badge--unpublished"
                                  : "ArtPosting-status-badge--published"
                              }`}
                            >
                              <span className="ArtPosting-status-badge__dot" />
                              {art.isPublished === false ||
                              art.status === "Unpublished"
                                ? "Unpublished"
                                : "Published"}
                            </span>
                          </td>

                          <td>
                            <div className="ArtPosting-table-actions">
                              <button
                                type="button"
                                className="ArtPosting-action ArtPosting-action--view"
                                title="View artwork"
                                aria-label={`View ${art.title}`}
                                onClick={() => setPreviewArt(art)}
                              >
                                <FiEye />
                              </button>

                              <button
                                type="button"
                                className="ArtPosting-action ArtPosting-action--edit"
                                title="Edit artwork"
                                aria-label={`Edit ${art.title}`}
                                onClick={() => handleEdit(art)}
                              >
                                <FiEdit2 />
                              </button>

                              <button
                                type="button"
                                className="ArtPosting-action ArtPosting-action--delete"
                                title="Delete artwork"
                                aria-label={`Delete ${art.title}`}
                                onClick={() => setDeleteTarget(art)}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">
                          <div className="ArtPosting-empty">
                            <div className="ArtPosting-empty__icon">
                              <FiImage />
                            </div>

                            <h3>No artwork found</h3>

                            <p>
                              {arts.length
                                ? "Try another search term or category."
                                : "Create your first artwork to start building your collection."}
                            </p>

                            {!arts.length && (
                              <button
                                type="button"
                                className="ArtPosting-button ArtPosting-button--primary"
                                onClick={openNewForm}
                              >
                                <FiPlus />
                                Create Artwork
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="ArtPosting-table-footer">
                <span>
                  Showing{" "}
                  {filteredArts.length
                    ? (safeCurrentPage - 1) * itemsPerPage + 1
                    : 0}
                  {" "}–{" "}
                  {Math.min(
                    safeCurrentPage * itemsPerPage,
                    filteredArts.length
                  )}{" "}
                  of {filteredArts.length} artworks
                </span>

                <div className="ArtPosting-pagination">
                  <button
                    type="button"
                    disabled={safeCurrentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    aria-label="Previous page"
                  >
                    <FiChevronLeft />
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - safeCurrentPage) <= 1
                    )
                    .map((page, index, pages) => (
                      <React.Fragment key={page}>
                        {index > 0 &&
                          pages[index - 1] !== page - 1 && (
                            <span className="ArtPosting-pagination__dots">
                              ...
                            </span>
                          )}

                        <button
                          type="button"
                          className={
                            safeCurrentPage === page
                              ? "ArtPosting-pagination__active"
                              : ""
                          }
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}

                  <button
                    type="button"
                    disabled={safeCurrentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    aria-label="Next page"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Notifications */}
      {notice && (
        <div
          className={`ArtPosting-toast ArtPosting-toast--${notice.type}`}
          role="status"
        >
          {notice.type === "success" ? (
            <FiCheckCircle />
          ) : (
            <FiAlertCircle />
          )}

          <span>{notice.text}</span>

          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="ArtPosting-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div
            className="ArtPosting-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ArtPosting-delete-title"
          >
            <div className="ArtPosting-confirm-modal__icon">
              <FiTrash2 />
            </div>

            <h3 id="ArtPosting-delete-title">Delete Artwork?</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>? This action cannot
              be undone.
            </p>

            <div className="ArtPosting-confirm-modal__actions">
              <button
                type="button"
                className="ArtPosting-button ArtPosting-button--secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ArtPosting-button ArtPosting-button--danger"
                onClick={confirmDelete}
              >
                <FiTrash2 />
                Delete Artwork
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artwork Preview */}
      {previewArt && (
        <div
          className="ArtPosting-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPreviewArt(null);
          }}
        >
          <div
            className="ArtPosting-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ArtPosting-preview-title"
          >
            <div className="ArtPosting-preview-modal__header">
              <div>
                <span>ARTWORK DETAILS</span>
                <h3 id="ArtPosting-preview-title">
                  {previewArt.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewArt(null)}
                aria-label="Close preview"
              >
                <FiX />
              </button>
            </div>

            <div className="ArtPosting-preview-modal__body">
              <div className="ArtPosting-preview-modal__photos">
                {previewArt.photos?.map((photo, index) => (
                  <img
                    key={photo.id || `${photo.name}-${index}`}
                    src={getImageUrl(photo)}
                    alt={`${previewArt.title} ${index + 1}`}
                  />
                ))}
              </div>

              <div className="ArtPosting-preview-modal__details">
                <p>
                  <strong>Art No.:</strong> {previewArt.artNo}
                </p>
                <p>
                  <strong>Artist:</strong> {previewArt.artistName}
                </p>
                <p>
                  <strong>Category:</strong> {previewArt.category}
                </p>
                <p>
                  <strong>Collections:</strong>{" "}
                  <span style={{ display: "inline-flex", gap: "6px", verticalAlign: "middle" }}>
                    {previewArt.isGeneralArtwork !== false && (
                      <span className="ArtPosting-type-badge ArtPosting-type-badge--gold">
                        General Artwork
                      </span>
                    )}
                    {Boolean(previewArt.isStreamingCollection) && (
                      <span className="ArtPosting-type-badge ArtPosting-type-badge--purple">
                        Streaming Collection
                      </span>
                    )}
                    {previewArt.isGeneralArtwork === false && !previewArt.isStreamingCollection && (
                      <span style={{ color: "#9c8e7e" }}>None</span>
                    )}
                  </span>
                </p>
                <p>
                  <strong>Publish Status:</strong>{" "}
                  <span
                    className={`ArtPosting-status-badge ${
                      previewArt.isPublished === false ||
                      previewArt.status === "Unpublished"
                        ? "ArtPosting-status-badge--unpublished"
                        : "ArtPosting-status-badge--published"
                    }`}
                  >
                    <span className="ArtPosting-status-badge__dot" />
                    {previewArt.isPublished === false ||
                    previewArt.status === "Unpublished"
                      ? "Unpublished"
                      : "Published"}
                  </span>
                </p>
                <p>
                  <strong>Size:</strong> {previewArt.sizeOverview}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  {formatCurrency(
                    getDiscountedPrice(
                      previewArt.price,
                      previewArt.discount
                    )
                  )}
                </p>
                <p>
                  <strong>Discount:</strong> {previewArt.discount}%
                </p>
                <p>
                  <strong>Stock:</strong> {previewArt.stockQuantity}
                </p>
                <p>
                  <strong>Framing:</strong> {previewArt.framing}
                </p>
                <p>
                  <strong>Certificate:</strong> {previewArt.certificate}
                </p>

                <div>
                  <strong>Tags:</strong>
                  <div className="ArtPosting-preview-modal__tags">
                    {previewArt.tags?.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="ArtPosting-preview-modal__richtext">
                  <strong>Description</strong>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: previewArt.description || "",
                    }}
                  />
                </div>

                {previewArt.artistAbout && (
                  <div className="ArtPosting-preview-modal__richtext">
                    <strong>Artist About</strong>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: previewArt.artistAbout,
                      }}
                    />
                  </div>
                )}

                {previewArt.themeDetails && (
                  <p>
                    <strong>Theme:</strong> {previewArt.themeDetails}
                  </p>
                )}
              </div>
            </div>

            <div className="ArtPosting-preview-modal__footer">
              <button
                type="button"
                className="ArtPosting-button ArtPosting-button--secondary"
                onClick={() => setPreviewArt(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="ArtPosting-button ArtPosting-button--primary"
                onClick={() => {
                  const art = previewArt;
                  setPreviewArt(null);
                  handleEdit(art);
                }}
              >
                <FiEdit2 />
                Edit Artwork
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPosting;