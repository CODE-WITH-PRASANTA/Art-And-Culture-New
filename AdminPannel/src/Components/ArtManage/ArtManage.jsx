import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Grid2X2,
  List,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Upload,
  EyeOff,
  Palette,
  Package,
  CheckCircle2,
  Clock3,
  Plus,
  X,
  ChevronDown,
  Image as ImageIcon,
  ArrowUpRight,
  Tag,
  UserRound,
  IndianRupee,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import "./ArtManage.css";

import { API_BASE_URL, ARTS_API_URL, CATEGORIES_API_URL } from "../../config/api";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);

const ArtManage = ({
  artworks: artworksProp,
  onEditArt,
  onViewArt,
  onDeleteArt,
  onAddArt,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [localArtworks, setLocalArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const [categories, setCategories] = useState(["All Categories"]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const res = await fetch(ARTS_API_URL);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((art) => ({
          ...art,
          id: art._id || art.id,
          artist: art.artistName || art.artist || "Unknown Artist",
          stock:
            art.stockQuantity !== undefined
              ? art.stockQuantity
              : art.stock || 0,
          status:
            art.status === "Available"
              ? "Published"
              : art.status || "Published",
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
          image: art.photos?.[0]?.url
            ? art.photos[0].url.startsWith("http")
              ? art.photos[0].url
              : `${API_BASE_URL}${art.photos[0].url}`
            : art.photos?.[0]?.dataUrl || art.image || "",
          createdAt: art.createdAt
            ? new Date(art.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
        }));
        setLocalArtworks(mapped);
      } else {
        setLocalArtworks([]);
      }
    } catch (err) {
      console.error("Failed to load artworks in ArtManage:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORIES_API_URL);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(["All Categories", ...json.data.map((c) => c.name)]);
        }
      } catch (err) {
        console.error("Failed to load categories in ArtManage:", err);
      }
    };
    fetchCategories();
  }, []);

  const artworks = artworksProp ?? localArtworks;

  const updateLocalArtwork = (id, updater) => {
    setLocalArtworks((current) =>
      current.map((art) =>
        art.id === id || art._id === id ? updater(art) : art
      )
    );
    setSelectedArt((current) =>
      current && (current.id === id || current._id === id)
        ? updater(current)
        : current
    );
  };

  const filteredArtworks = useMemo(() => {
    const term = search.trim().toLowerCase();

    return artworks.filter((art) => {
      const matchesSearch =
        !term ||
        [
          art.title,
          art.artNo,
          art.artist,
          art.category,
          art.artType,
          ...(art.tags || []),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(term)
          );

      const matchesCategory =
        category === "All Categories" ||
        art.category === category;

      const matchesType =
        typeFilter === "All Types" ||
        (typeFilter === "Streaming Collection"
          ? Boolean(art.isStreamingCollection)
          : typeFilter === "General Artwork"
          ? art.isGeneralArtwork !== false
          : (art.artType || "General Artwork") === typeFilter);

      const matchesStatus =
        statusFilter === "All" ||
        art.status === statusFilter;

      return matchesSearch && matchesCategory && matchesType && matchesStatus;
    });
  }, [artworks, search, category, typeFilter, statusFilter]);

  const publishedCount = artworks.filter(
    (art) => art.status === "Published" || art.isPublished === true
  ).length;

  const streamingCount = artworks.filter(
    (art) => Boolean(art.isStreamingCollection)
  ).length;

  const generalCount = artworks.filter(
    (art) => art.isGeneralArtwork !== false
  ).length;

  const totalStock = artworks.reduce(
    (total, art) => total + Number(art.stock || 0),
    0
  );

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const handleEdit = (art) => {
    setOpenMenu(null);
    setSelectedArt(null);

    if (onEditArt) {
      onEditArt(art);
      return;
    }

    navigate(`/art-management/art-posting?edit=${art._id || art.id}`);
  };

  const handleView = (art) => {
    setOpenMenu(null);

    if (onViewArt) {
      onViewArt(art);
      return;
    }

    setSelectedArt(art);
  };

  const handleStatus = async (art) => {
    const nextStatus =
      art.status === "Published" ? "Unpublished" : "Published";
    const nextIsPublished = nextStatus === "Published";

    updateLocalArtwork(art.id, (item) => ({
      ...item,
      status: nextStatus,
      isPublished: nextIsPublished,
    }));

    if (onStatusChange) {
      onStatusChange(art, nextStatus);
    }

    try {
      const targetId = art._id || art.id;
      const res = await fetch(`${ARTS_API_URL}/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          isPublished: nextIsPublished,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showNotice(data.message || "Failed to update status on server.");
        fetchArtworks();
      } else {
        showNotice(
          `"${art.title}" marked as ${nextStatus}.`
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
      showNotice("Network error updating status.");
      fetchArtworks();
    }

    setOpenMenu(null);
  };

  const handleToggleStreaming = async (art) => {
    const nextVal = !Boolean(art.isStreamingCollection);

    updateLocalArtwork(art.id, (item) => ({
      ...item,
      isStreamingCollection: nextVal,
      artType:
        nextVal && item.isGeneralArtwork !== false
          ? "General & Streaming"
          : nextVal
          ? "Streaming Collection"
          : "General Artwork",
    }));

    try {
      const targetId = art._id || art.id;
      const res = await fetch(`${ARTS_API_URL}/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isStreamingCollection: nextVal,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showNotice(data.message || "Failed to update Streaming Collection.");
        fetchArtworks();
      } else {
        showNotice(
          `"${art.title}" Streaming Collection ${nextVal ? "enabled" : "disabled"}.`
        );
      }
    } catch (err) {
      console.error("Streaming update error:", err);
      showNotice("Network error updating Streaming Collection.");
      fetchArtworks();
    }

    setOpenMenu(null);
  };

  const handleToggleGeneral = async (art) => {
    const nextVal = art.isGeneralArtwork === false;

    updateLocalArtwork(art.id, (item) => ({
      ...item,
      isGeneralArtwork: nextVal,
      artType:
        item.isStreamingCollection && nextVal
          ? "General & Streaming"
          : item.isStreamingCollection
          ? "Streaming Collection"
          : "General Artwork",
    }));

    try {
      const targetId = art._id || art.id;
      const res = await fetch(`${ARTS_API_URL}/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isGeneralArtwork: nextVal,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showNotice(data.message || "Failed to update General Artwork.");
        fetchArtworks();
      } else {
        showNotice(
          `"${art.title}" General Artwork ${nextVal ? "enabled" : "disabled"}.`
        );
      }
    } catch (err) {
      console.error("General update error:", err);
      showNotice("Network error updating General Artwork.");
      fetchArtworks();
    }

    setOpenMenu(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    if (onDeleteArt) {
      onDeleteArt(deleteTarget);
    } else {
      const targetId = deleteTarget._id || deleteTarget.id;
      try {
        const res = await fetch(`${ARTS_API_URL}/${targetId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          showNotice(`${deleteTarget.title} deleted.`);
          fetchArtworks();
        } else {
          showNotice(data.message || "Failed to delete.");
        }
      } catch (err) {
        showNotice("Failed to delete artwork.");
      }
    }

    setDeleteTarget(null);
    setOpenMenu(null);
  };

  const handleAddArt = () => {
    if (onAddArt) {
      onAddArt();
      return;
    }
    navigate("/art-management/art-posting?mode=new");
  };

  const renderActions = (art) => (
    <div className="ArtManage-actions">
      <button
        type="button"
        className="ArtManage-actions__trigger"
        aria-label={`Actions for ${art.title}`}
        aria-expanded={openMenu === art.id}
        onClick={() =>
          setOpenMenu((current) =>
            current === art.id ? null : art.id
          )
        }
      >
        <MoreVertical size={19} />
      </button>

      {openMenu === art.id && (
        <>
          <button
            type="button"
            className="ArtManage-actions__backdrop"
            aria-label="Close actions menu"
            onClick={() => setOpenMenu(null)}
          />

          <div className="ArtManage-actions__menu">
            <button
              type="button"
              onClick={() => handleView(art)}
            >
              <Eye size={15} />
              View details
            </button>

            <button
              type="button"
              onClick={() => handleEdit(art)}
            >
              <Pencil size={15} />
              Edit artwork
            </button>

            <button
              type="button"
              onClick={() => handleStatus(art)}
            >
              {art.status === "Published" ? (
                <EyeOff size={15} />
              ) : (
                <Upload size={15} />
              )}
              {art.status === "Published"
                ? "Unpublish Artwork"
                : "Publish Artwork"}
            </button>

            <button
              type="button"
              onClick={() => handleToggleStreaming(art)}
            >
              <Sparkles size={15} />
              {art.isStreamingCollection
                ? "Remove from Streaming"
                : "Add to Streaming Collection"}
            </button>

            <button
              type="button"
              onClick={() => handleToggleGeneral(art)}
            >
              <Palette size={15} />
              {art.isGeneralArtwork !== false
                ? "Remove from General"
                : "Add to General Artwork"}
            </button>

            <div className="ArtManage-actions__divider" />

            <button
              type="button"
              className="ArtManage-actions__delete"
              onClick={() => {
                setDeleteTarget(art);
                setOpenMenu(null);
              }}
            >
              <Trash2 size={15} />
              Delete artwork
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderStatus = (status) => (
    <span
      className={`ArtManage-status ArtManage-status--${status.toLowerCase()}`}
    >
      <span className="ArtManage-status__dot" />
      {status}
    </span>
  );

  return (
    <main className="ArtManage">
      {/* PAGE HEADER */}
      <header className="ArtManage-header">
        <div className="ArtManage-header__content">
          <span className="ArtManage-header__eyebrow">
            ART & CULTURE / COLLECTIONS
          </span>

          <h1>Art Management</h1>

          <p>
            Organize your collection, manage artwork details and
            control what appears in your shop.
          </p>
        </div>

        <button
          type="button"
          className="ArtManage-header__add"
          onClick={handleAddArt}
        >
          <Plus size={18} />
          Add New Art
        </button>
      </header>

      {/* STATISTICS */}
      <section className="ArtManage-stats">
        <article className="ArtManage-stat">
          <div className="ArtManage-stat__icon ArtManage-stat__icon--gold">
            <Palette size={21} />
          </div>
          <div>
            <span>Total Artworks</span>
            <strong>{artworks.length}</strong>
            <small>Across your collection</small>
          </div>
        </article>

        <article className="ArtManage-stat">
          <div className="ArtManage-stat__icon ArtManage-stat__icon--green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Published</span>
            <strong>{publishedCount}</strong>
            <small>Visible in your collection</small>
          </div>
        </article>

        <article className="ArtManage-stat">
          <div className="ArtManage-stat__icon ArtManage-stat__icon--purple">
            <Sparkles size={21} />
          </div>
          <div>
            <span>Streaming</span>
            <strong>{streamingCount}</strong>
            <small>Streaming collections</small>
          </div>
        </article>

        <article className="ArtManage-stat">
          <div className="ArtManage-stat__icon ArtManage-stat__icon--brown">
            <Package size={21} />
          </div>
          <div>
            <span>Available Stock</span>
            <strong>{totalStock}</strong>
            <small>Total units in stock</small>
          </div>
        </article>
      </section>

      {/* COLLECTION PANEL */}
      <section className="ArtManage-panel">
        <div className="ArtManage-panel__heading">
          <div>
            <span className="ArtManage-panel__eyebrow">
              YOUR COLLECTION
            </span>
            <h2>All Artworks</h2>
            <p>
              Browse, update and organize your creative collection.
            </p>
          </div>

          <span className="ArtManage-panel__count">
            {filteredArtworks.length}{" "}
            {filteredArtworks.length === 1 ? "artwork" : "artworks"}
          </span>
        </div>

        {/* TOOLBAR */}
        <div className="ArtManage-toolbar">
          <div
            className="ArtManage-view-toggle"
            role="group"
            aria-label="Choose artwork view"
          >
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              title="Grid view"
              className={
                view === "grid"
                  ? "ArtManage-view-toggle__button ArtManage-view-toggle__button--active"
                  : "ArtManage-view-toggle__button"
              }
              onClick={() => setView("grid")}
            >
              <Grid2X2 size={18} />
            </button>

            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              title="List view"
              className={
                view === "list"
                  ? "ArtManage-view-toggle__button ArtManage-view-toggle__button--active"
                  : "ArtManage-view-toggle__button"
              }
              onClick={() => setView("list")}
            >
              <List size={19} />
            </button>
          </div>

          <label className="ArtManage-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search title, artist, art no..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="ArtManage-filter">
            <SlidersHorizontal size={15} />
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown size={14} />
          </label>

          <label className="ArtManage-filter ArtManage-filter--type">
            <Sparkles size={14} />
            <select
              aria-label="Filter by collection type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="All Types">All Types</option>
              <option value="General Artwork">General Artwork</option>
              <option value="Streaming Collection">Streaming Collection</option>
            </select>
            <ChevronDown size={14} />
          </label>

          <label className="ArtManage-filter ArtManage-filter--status">
            <select
              aria-label="Filter by publication status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Unpublished">Unpublished</option>
              <option value="Draft">Draft</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>

        {/* GRID VIEW */}
        {view === "grid" && (
          <div className="ArtManage-grid">
            {filteredArtworks.map((art) => (
              <article
                className="ArtManage-card"
                key={art.id}
              >
                <div className="ArtManage-card__image-wrap">
                  <img
                    className="ArtManage-card__image"
                    src={art.image}
                    alt={art.title}
                    loading="lazy"
                  />

                  <span className="ArtManage-card__number">
                    {art.artNo}
                  </span>

                  <div className="ArtManage-card__menu">
                    {renderActions(art)}
                  </div>
                </div>

                <div className="ArtManage-card__body">
                  <div className="ArtManage-card__meta-badges">
                    <span className="ArtManage-card__category">
                      {art.category}
                    </span>
                  </div>

                  <h3>{art.title}</h3>

                  <p className="ArtManage-card__artist">
                    <UserRound size={14} />
                    {art.artist}
                  </p>

                  <div className="ArtManage-card__price-row">
                    <div className="ArtManage-card__price">
                      <strong>
                        {formatPrice(
                          art.price * (1 - (art.discount || 0) / 100)
                        )}
                      </strong>

                      {art.discount > 0 && (
                        <del>{formatPrice(art.price)}</del>
                      )}
                    </div>

                    {art.discount > 0 && (
                      <span className="ArtManage-card__discount">
                        {art.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* 3 SEPARATE TOGGLES */}
                  <div className="ArtManage-card__toggles">
                    {/* Toggle 1: Publish & Unpublish */}
                    <div className="ArtManage-card__toggle-row">
                      <div className="ArtManage-card__toggle-label">
                        <span className="ArtManage-toggle-badge ArtManage-toggle-badge--1">1</span>
                        <span>Publish Status</span>
                      </div>
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          art.status === "Published"
                            ? "ArtManage-switch-btn--published"
                            : "ArtManage-switch-btn--unpublished"
                        }`}
                        onClick={() => handleStatus(art)}
                        title={`Click to ${
                          art.status === "Published" ? "Unpublish" : "Publish"
                        }`}
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {art.status === "Published" ? "Published" : "Unpublished"}
                        </span>
                      </button>
                    </div>

                    {/* Toggle 2: Streaming Collection */}
                    <div className="ArtManage-card__toggle-row">
                      <div className="ArtManage-card__toggle-label">
                        <span className="ArtManage-toggle-badge ArtManage-toggle-badge--2">2</span>
                        <span>Streaming Collection</span>
                      </div>
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          art.isStreamingCollection
                            ? "ArtManage-switch-btn--purple"
                            : "ArtManage-switch-btn--off"
                        }`}
                        onClick={() => handleToggleStreaming(art)}
                        title="Click to toggle Streaming Collection"
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {art.isStreamingCollection ? "Active" : "Off"}
                        </span>
                      </button>
                    </div>

                    {/* Toggle 3: General Artwork */}
                    <div className="ArtManage-card__toggle-row">
                      <div className="ArtManage-card__toggle-label">
                        <span className="ArtManage-toggle-badge ArtManage-toggle-badge--3">3</span>
                        <span>General Artwork</span>
                      </div>
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          art.isGeneralArtwork !== false
                            ? "ArtManage-switch-btn--gold"
                            : "ArtManage-switch-btn--off"
                        }`}
                        onClick={() => handleToggleGeneral(art)}
                        title="Click to toggle General Artwork"
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {art.isGeneralArtwork !== false ? "Active" : "Off"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="ArtManage-card__footer">
                    <span
                      className={
                        art.stock > 0
                          ? "ArtManage-card__stock"
                          : "ArtManage-card__stock ArtManage-card__stock--empty"
                      }
                    >
                      <Package size={14} />
                      {art.stock > 0
                        ? `${art.stock} in stock`
                        : "Out of stock"}
                    </span>

                    <button
                      type="button"
                      className="ArtManage-card__view"
                      onClick={() => handleView(art)}
                    >
                      View <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* LIST VIEW */}
        {view === "list" && (
          <div className="ArtManage-list-wrap">
            <table className="ArtManage-table">
              <thead>
                <tr>
                  <th>Artwork</th>
                  <th>Art Number</th>
                  <th>Category</th>
                  <th>Artist</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="ArtManage-table__th-toggle">1. Publish Status</th>
                  <th className="ArtManage-table__th-toggle">2. Streaming Collection</th>
                  <th className="ArtManage-table__th-toggle">3. General Artwork</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredArtworks.map((art) => (
                  <tr key={art.id}>
                    <td>
                      <div className="ArtManage-table__artwork">
                        <img src={art.image} alt={art.title} />
                        <div>
                          <strong>{art.title}</strong>
                          <span>
                            {art.discount > 0
                              ? `${art.discount}% discount`
                              : "No discount"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="ArtManage-table__number">
                        {art.artNo}
                      </span>
                    </td>

                    <td>
                      <span className="ArtManage-table__category">
                        {art.category}
                      </span>
                    </td>

                    <td>{art.artist}</td>

                    <td>
                      <div className="ArtManage-table__price">
                        <strong>
                          {formatPrice(
                            art.price * (1 - (art.discount || 0) / 100)
                          )}
                        </strong>
                        {art.discount > 0 && (
                          <del>{formatPrice(art.price)}</del>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          art.stock > 0
                            ? "ArtManage-table__stock"
                            : "ArtManage-table__stock ArtManage-table__stock--empty"
                        }
                      >
                        {art.stock}
                      </span>
                    </td>

                    {/* Toggle 1: Publish / Unpublish */}
                    <td className="ArtManage-table__td-toggle">
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          art.status === "Published"
                            ? "ArtManage-switch-btn--published"
                            : "ArtManage-switch-btn--unpublished"
                        }`}
                        onClick={() => handleStatus(art)}
                        title={`Click to ${
                          art.status === "Published" ? "Unpublish" : "Publish"
                        }`}
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {art.status === "Published" ? "Published" : "Unpublished"}
                        </span>
                      </button>
                    </td>

                    {/* Toggle 2: Streaming Collection */}
                    <td className="ArtManage-table__td-toggle">
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          art.isStreamingCollection
                            ? "ArtManage-switch-btn--purple"
                            : "ArtManage-switch-btn--off"
                        }`}
                        onClick={() => handleToggleStreaming(art)}
                        title="Click to toggle Streaming Collection"
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {art.isStreamingCollection ? "Active" : "Off"}
                        </span>
                      </button>
                    </td>

                    {/* Toggle 3: General Artwork */}
                    <td className="ArtManage-table__td-toggle">
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          art.isGeneralArtwork !== false
                            ? "ArtManage-switch-btn--gold"
                            : "ArtManage-switch-btn--off"
                        }`}
                        onClick={() => handleToggleGeneral(art)}
                        title="Click to toggle General Artwork"
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {art.isGeneralArtwork !== false ? "Active" : "Off"}
                        </span>
                      </button>
                    </td>

                    <td>
                      {renderActions(art)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {filteredArtworks.length === 0 && (
          <div className="ArtManage-empty">
            <div className="ArtManage-empty__icon">
              <ImageIcon size={27} />
            </div>

            <h3>No artworks found</h3>

            <p>
              Try changing your search or filters to find an artwork.
            </p>

            {artworks.length === 0 ? (
              <button
                type="button"
                className="ArtManage-empty__reset"
                style={{ background: "#7d5a36", color: "#fff", borderColor: "#7d5a36" }}
                onClick={handleAddArt}
              >
                <Plus size={16} />
                Add New Art
              </button>
            ) : (
              <button
                type="button"
                className="ArtManage-empty__reset"
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                  setTypeFilter("All Types");
                  setStatusFilter("All");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* ARTWORK PREVIEW */}
      {selectedArt && (
        <div
          className="ArtManage-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedArt(null);
            }
          }}
        >
          <section
            className="ArtManage-preview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ArtManage-preview-title"
          >
            <div className="ArtManage-preview__header">
              <div>
                <span>ARTWORK DETAILS</span>
                <h2 id="ArtManage-preview-title">
                  {selectedArt.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close preview"
                onClick={() => setSelectedArt(null)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="ArtManage-preview__body">
              <img
                className="ArtManage-preview__image"
                src={selectedArt.image}
                alt={selectedArt.title}
              />

              <div className="ArtManage-preview__details">
                <div className="ArtManage-preview__badges-row">
                  <span className="ArtManage-preview__number">
                    {selectedArt.artNo}
                  </span>
                  <span className="ArtManage-preview__category-pill">
                    {selectedArt.category}
                  </span>
                </div>

                {/* 3 SEPARATE TOGGLES IN PREVIEW */}
                <div className="ArtManage-preview__toggles-panel">
                  <span className="ArtManage-preview__toggles-title">
                    COLLECTION & PUBLICATION TOGGLES
                  </span>
                  <div className="ArtManage-preview__toggles-grid">
                    {/* Toggle 1: Publish */}
                    <div className="ArtManage-preview__toggle-item">
                      <span className="ArtManage-preview__toggle-label">1. Publish Status</span>
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          selectedArt.status === "Published"
                            ? "ArtManage-switch-btn--published"
                            : "ArtManage-switch-btn--unpublished"
                        }`}
                        onClick={() => handleStatus(selectedArt)}
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {selectedArt.status === "Published" ? "Published" : "Unpublished"}
                        </span>
                      </button>
                    </div>

                    {/* Toggle 2: Streaming Collection */}
                    <div className="ArtManage-preview__toggle-item">
                      <span className="ArtManage-preview__toggle-label">2. Streaming Collection</span>
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          selectedArt.isStreamingCollection
                            ? "ArtManage-switch-btn--purple"
                            : "ArtManage-switch-btn--off"
                        }`}
                        onClick={() => handleToggleStreaming(selectedArt)}
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {selectedArt.isStreamingCollection ? "Active" : "Off"}
                        </span>
                      </button>
                    </div>

                    {/* Toggle 3: General Artwork */}
                    <div className="ArtManage-preview__toggle-item">
                      <span className="ArtManage-preview__toggle-label">3. General Artwork</span>
                      <button
                        type="button"
                        className={`ArtManage-switch-btn ${
                          selectedArt.isGeneralArtwork !== false
                            ? "ArtManage-switch-btn--gold"
                            : "ArtManage-switch-btn--off"
                        }`}
                        onClick={() => handleToggleGeneral(selectedArt)}
                      >
                        <span className="ArtManage-switch-btn__knob" />
                        <span className="ArtManage-switch-btn__text">
                          {selectedArt.isGeneralArtwork !== false ? "Active" : "Off"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ArtManage-preview__field">
                  <span>Artist</span>
                  <strong>{selectedArt.artist}</strong>
                </div>

                <div className="ArtManage-preview__field">
                  <span>Category</span>
                  <strong>{selectedArt.category}</strong>
                </div>

                <div className="ArtManage-preview__field">
                  <span>Price</span>
                  <strong>
                    {formatPrice(
                      selectedArt.price *
                        (1 - (selectedArt.discount || 0) / 100)
                    )}
                  </strong>
                </div>

                <div className="ArtManage-preview__field">
                  <span>Stock quantity</span>
                  <strong>{selectedArt.stock}</strong>
                </div>

                <div className="ArtManage-preview__description">
                  <span>Description</span>
                  <div
                    className="ArtManage-preview__richtext"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedArt.description ||
                        "<p>No description available.</p>",
                    }}
                  />
                </div>

                <div className="ArtManage-preview__description">
                  <span>Tags</span>
                  <div className="ArtManage-preview__tags">
                    {(selectedArt.tags || []).map((tag) => (
                      <span key={tag}>
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="ArtManage-preview__footer">
              <button
                type="button"
                className="ArtManage-button ArtManage-button--secondary"
                onClick={() => setSelectedArt(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="ArtManage-button ArtManage-button--primary"
                onClick={() => {
                  const art = selectedArt;
                  setSelectedArt(null);
                  handleEdit(art);
                }}
              >
                <Pencil size={15} />
                Edit Artwork
              </button>
            </div>
          </section>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTarget && (
        <div
          className="ArtManage-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="ArtManage-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ArtManage-delete-title"
          >
            <div className="ArtManage-delete-modal__icon">
              <Trash2 size={23} />
            </div>

            <h2 id="ArtManage-delete-title">
              Delete this artwork?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>? This action
              cannot be undone.
            </p>

            <div className="ArtManage-delete-modal__actions">
              <button
                type="button"
                className="ArtManage-button ArtManage-button--secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ArtManage-button ArtManage-button--danger"
                onClick={handleDelete}
              >
                <Trash2 size={15} />
                Delete Artwork
              </button>
            </div>
          </section>
        </div>
      )}

      {/* FEEDBACK */}
      {notice && (
        <div className="ArtManage-toast" role="status">
          <CheckCircle2 size={19} />
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </main>
  );
};

export default ArtManage;
