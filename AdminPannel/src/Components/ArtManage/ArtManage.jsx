
import React, { useMemo, useState } from "react";
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
} from "lucide-react";

import "./ArtManage.css";

const initialArtworks = [
  {
    id: "1",
    artNo: "ART-0001",
    title: "The Golden Heritage",
    artist: "Ananya Mohanty",
    category: "Traditional Painting",
    price: 12500,
    discount: 10,
    stock: 5,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
    description:
      "A timeless artwork celebrating the beauty of traditional Indian art and heritage.",
    tags: ["Heritage", "Traditional", "Indian Art"],
    createdAt: "26 Oct 2026",
  },
  {
    id: "2",
    artNo: "ART-0002",
    title: "Colors of the Coast",
    artist: "Ritika Das",
    category: "Contemporary Art",
    price: 8900,
    discount: 5,
    stock: 8,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",
    description:
      "A vibrant composition inspired by coastal landscapes and the rhythm of nature.",
    tags: ["Coastal", "Colorful", "Modern"],
    createdAt: "25 Oct 2026",
  },
  {
    id: "3",
    artNo: "ART-0003",
    title: "Whispers of Nature",
    artist: "Sourav Behera",
    category: "Nature Art",
    price: 15700,
    discount: 0,
    stock: 3,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
    description:
      "An expressive nature-inspired artwork capturing quiet moments in the natural world.",
    tags: ["Nature", "Landscape", "Original"],
    createdAt: "24 Oct 2026",
  },
  {
    id: "4",
    artNo: "ART-0004",
    title: "Stories in Clay",
    artist: "Meera Nayak",
    category: "Sculpture",
    price: 6800,
    discount: 15,
    stock: 0,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85",
    description:
      "A handcrafted sculptural piece inspired by everyday life and traditional craftsmanship.",
    tags: ["Clay", "Handcrafted", "Sculpture"],
    createdAt: "23 Oct 2026",
  },
  {
    id: "5",
    artNo: "ART-0005",
    title: "Quiet Reflections",
    artist: "Aarav Patnaik",
    category: "Abstract Art",
    price: 11200,
    discount: 8,
    stock: 6,
    status: "Unpublished",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85",
    description:
      "An abstract composition built around thoughtful shapes, texture and color.",
    tags: ["Abstract", "Contemporary", "Original"],
    createdAt: "22 Oct 2026",
  },
  {
    id: "6",
    artNo: "ART-0006",
    title: "The Art of Tradition",
    artist: "Priya Sahoo",
    category: "Traditional Painting",
    price: 18500,
    discount: 12,
    stock: 4,
    status: "Published",
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=900&q=85",
    description:
      "A carefully crafted painting celebrating cultural identity and artistic expression.",
    tags: ["Tradition", "Culture", "Painting"],
    createdAt: "21 Oct 2026",
  },
];

const categories = [
  "All Categories",
  "Traditional Painting",
  "Contemporary Art",
  "Nature Art",
  "Sculpture",
  "Abstract Art",
];

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
  const [localArtworks, setLocalArtworks] = useState(initialArtworks);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");

  const artworks = artworksProp ?? localArtworks;

  const updateLocalArtwork = (id, updater) => {
    setLocalArtworks((current) =>
      current.map((art) =>
        art.id === id ? updater(art) : art
      )
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
          ...(art.tags || []),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(term)
          );

      const matchesCategory =
        category === "All Categories" ||
        art.category === category;

      const matchesStatus =
        statusFilter === "All" ||
        art.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [artworks, search, category, statusFilter]);

  const publishedCount = artworks.filter(
    (art) => art.status === "Published"
  ).length;

  const draftCount = artworks.filter(
    (art) => art.status === "Draft"
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

    if (onEditArt) {
      onEditArt(art);
      return;
    }

    showNotice(`Connect the Art Posting form to edit ${art.artNo}.`);
  };

  const handleView = (art) => {
    setOpenMenu(null);

    if (onViewArt) {
      onViewArt(art);
      return;
    }

    setSelectedArt(art);
  };

  const handleStatus = (art) => {
    const nextStatus =
      art.status === "Published" ? "Unpublished" : "Published";

    if (onStatusChange) {
      onStatusChange(art, nextStatus);
    } else {
      updateLocalArtwork(art.id, (item) => ({
        ...item,
        status: nextStatus,
      }));
    }

    setOpenMenu(null);
    showNotice(
      `${art.title} ${nextStatus === "Published" ? "published" : "unpublished"}.`
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    if (onDeleteArt) {
      onDeleteArt(deleteTarget);
    } else {
      setLocalArtworks((current) =>
        current.filter((art) => art.id !== deleteTarget.id)
      );
    }

    showNotice(`${deleteTarget.title} deleted.`);
    setDeleteTarget(null);
    setOpenMenu(null);
  };

  const handleAddArt = () => {
    if (onAddArt) {
      onAddArt();
    } else {
      showNotice("Connect this button to your Art Posting page.");
    }
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
                ? "Unpublish"
                : "Publish"}
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
          <div className="ArtManage-stat__icon ArtManage-stat__icon--blue">
            <Clock3 size={21} />
          </div>
          <div>
            <span>Drafts</span>
            <strong>{draftCount}</strong>
            <small>Awaiting publication</small>
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

                  <div className="ArtManage-card__image-status">
                    {renderStatus(art.status)}
                  </div>
                </div>

                <div className="ArtManage-card__body">
                  <span className="ArtManage-card__category">
                    {art.category}
                  </span>

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
                  <th>Status</th>
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

                    <td>{renderStatus(art.status)}</td>

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

            <button
              type="button"
              className="ArtManage-empty__reset"
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setStatusFilter("All");
              }}
            >
              Clear filters
            </button>
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
                <span className="ArtManage-preview__number">
                  {selectedArt.artNo}
                </span>

                {renderStatus(selectedArt.status)}

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
                  <p>
                    {selectedArt.description ||
                      "No description available."}
                  </p>
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
