import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiMoreVertical,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiPlus,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiX,
  FiImage,
} from "react-icons/fi";

import "./BlogManagement.css";

const initialBlogs = [
  {
    id: 1,
    code: "BLOG-0001",
    title: "The Golden Heritage",
    category: "Traditional Painting",
    author: "Ananya Mohanty",
    date: "2026-10-20",
    status: "Published",
    views: 1250,
    excerpt:
      "Discover the beauty of traditional art and the stories behind timeless paintings passed down through generations.",
    image:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85",
    tags: ["Art", "Heritage"],
  },
  {
    id: 2,
    code: "BLOG-0002",
    title: "Colors of the Coast",
    category: "Contemporary Art",
    author: "Ritika Das",
    date: "2026-10-18",
    status: "Published",
    views: 845,
    excerpt:
      "Explore expressive colors, modern textures, and the creative energy inspired by coastal landscapes.",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1000&q=85",
    tags: ["Modern", "Painting"],
  },
  {
    id: 3,
    code: "BLOG-0003",
    title: "Whispers of Nature",
    category: "Nature Art",
    author: "Sourav Behera",
    date: "2026-10-16",
    status: "Draft",
    views: 0,
    excerpt:
      "Find inspiration in nature's quiet details, from forest landscapes to the changing colors of the seasons.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85",
    tags: ["Nature", "Inspiration"],
  },
  {
    id: 4,
    code: "BLOG-0004",
    title: "The Art of Everyday Living",
    category: "Lifestyle",
    author: "Priya Mishra",
    date: "2026-10-14",
    status: "Published",
    views: 642,
    excerpt:
      "Bring creativity into everyday spaces with thoughtful objects, handmade ceramics, and artistic details.",
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=1000&q=85",
    tags: ["Lifestyle", "Design"],
  },
  {
    id: 5,
    code: "BLOG-0005",
    title: "Abstract Dreams",
    category: "Contemporary Art",
    author: "Meera Patnaik",
    date: "2026-10-12",
    status: "Published",
    views: 1890,
    excerpt:
      "A closer look at abstract expression, vivid colors, and the freedom of interpreting art in your own way.",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=85",
    tags: ["Abstract", "Creative"],
  },
  {
    id: 6,
    code: "BLOG-0006",
    title: "Stories in the Landscape",
    category: "Nature Art",
    author: "Arjun Sahu",
    date: "2026-10-10",
    status: "Scheduled",
    views: 0,
    excerpt:
      "Travel through remarkable landscapes and discover how artists capture the atmosphere of a place.",
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=85",
    tags: ["Landscape", "Travel"],
  },
  {
    id: 7,
    code: "BLOG-0007",
    title: "Inside the Artist's Studio",
    category: "Artist Stories",
    author: "Sneha Das",
    date: "2026-10-08",
    status: "Published",
    views: 578,
    excerpt:
      "Step inside a creative studio to discover the tools, techniques, and daily rituals behind original work.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85",
    tags: ["Artist", "Studio"],
  },
  {
    id: 8,
    code: "BLOG-0008",
    title: "The Beauty of Handmade Objects",
    category: "Traditional Painting",
    author: "Kaberi Rout",
    date: "2026-10-05",
    status: "Draft",
    views: 0,
    excerpt:
      "Celebrate the patience, skill, and cultural meaning that make handmade objects truly special.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85",
    tags: ["Handmade", "Craft"],
  },
  {
    id: 9,
    code: "BLOG-0009",
    title: "A Modern Art Collection",
    category: "Contemporary Art",
    author: "Rohan Jena",
    date: "2026-10-02",
    status: "Published",
    views: 970,
    excerpt:
      "Explore a curated collection of modern artworks that combine bold ideas, unique materials, and personal expression.",
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=85",
    tags: ["Collection", "Modern"],
  },
];

const BlogManagement = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState(initialBlogs);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [notice, setNotice] = useState("");

  const itemsPerPage = 6;

  // Navigate to the separate blog posting page.
  const handleCreate = () => {
    setOpenMenu(null);
    navigate("/blog/blog-posting");
  };

  // Pass the selected blog to the posting page for editing.
  const handleEdit = (blog) => {
    setOpenMenu(null);
    setSelectedBlog(null);

    navigate("/blog/blog-posting", {
      state: {
        blog,
        isEditing: true,
      },
    });
  };

  const categories = useMemo(
    () => [
      "All Categories",
      ...new Set(blogs.map((blog) => blog.category)),
    ],
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs
      .filter((blog) => {
        const matchesSearch =
          !query ||
          blog.title.toLowerCase().includes(query) ||
          blog.author.toLowerCase().includes(query) ||
          blog.category.toLowerCase().includes(query) ||
          blog.code.toLowerCase().includes(query) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(query));

        const matchesCategory =
          categoryFilter === "All Categories" ||
          blog.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All Status" || blog.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.date) - new Date(b.date);
        }

        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }

        if (sortBy === "mostViewed") {
          return b.views - a.views;
        }

        return new Date(b.date) - new Date(a.date);
      });
  }, [blogs, search, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;

  const visibleBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const publishedCount = blogs.filter(
    (blog) => blog.status === "Published"
  ).length;

  const draftCount = blogs.filter(
    (blog) => blog.status === "Draft"
  ).length;

  const scheduledCount = blogs.filter(
    (blog) => blog.status === "Scheduled"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const changeFilter = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const showNotice = (message) => {
    setNotice(message);
    setOpenMenu(null);
  };

  const handleDelete = () => {
    setBlogs((previous) =>
      previous.filter((blog) => blog.id !== deleteId)
    );

    if (selectedBlog?.id === deleteId) {
      setSelectedBlog(null);
    }

    setDeleteId(null);
    setOpenMenu(null);

    showNotice("Blog post deleted successfully.");
  };

  const handleStatusChange = (blog) => {
    const nextStatus =
      blog.status === "Published" ? "Draft" : "Published";

    setBlogs((previous) =>
      previous.map((item) =>
        item.id === blog.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    showNotice(`Blog status changed to ${nextStatus}.`);
  };

  const renderStatus = (status) => (
    <span
      className={`BlogManagement-status BlogManagement-status--${status.toLowerCase()}`}
    >
      <span className="BlogManagement-statusDot" />
      {status}
    </span>
  );

  const renderActions = (blog) => (
    <div className="BlogManagement-cardMenu">
      <button
        type="button"
        className="BlogManagement-menuTrigger"
        onClick={() =>
          setOpenMenu(openMenu === blog.id ? null : blog.id)
        }
        aria-label={`Actions for ${blog.title}`}
        aria-expanded={openMenu === blog.id}
      >
        <FiMoreVertical />
      </button>

      {openMenu === blog.id && (
        <div className="BlogManagement-menuDropdown">
          <button
            type="button"
            onClick={() => {
              setSelectedBlog(blog);
              setOpenMenu(null);
            }}
          >
            <FiEye />
            View details
          </button>

          <button type="button" onClick={() => handleEdit(blog)}>
            <FiEdit2 />
            Edit blog
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange(blog)}
          >
            {blog.status === "Published" ? (
              <FiClock />
            ) : (
              <FiCheckCircle />
            )}

            {blog.status === "Published"
              ? "Move to draft"
              : "Publish post"}
          </button>

          <button
            type="button"
            className="BlogManagement-menuDelete"
            onClick={() => {
              setDeleteId(blog.id);
              setOpenMenu(null);
            }}
          >
            <FiTrash2 />
            Delete blog
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="BlogManagement">
      {/* Header */}
      <div className="BlogManagement-header">
        <div className="BlogManagement-heading">
          <span className="BlogManagement-headingIcon">
            <FiFileText />
          </span>

          <div>
            <span className="BlogManagement-eyebrow">
              CONTENT STUDIO
            </span>

            <h1>Blog Management</h1>

            <p>
              Manage stories, share ideas, and inspire your audience.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="BlogManagement-createButton"
          onClick={handleCreate}
        >
          <FiPlus />
          Create New Blog
        </button>
      </div>

      {/* Notification */}
      {notice && (
        <div className="BlogManagement-notice" role="status">
          <FiCheckCircle />

          <span>{notice}</span>

          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="BlogManagement-stats">
        <div className="BlogManagement-statCard">
          <span className="BlogManagement-statIcon">
            <FiFileText />
          </span>

          <div>
            <span>Total Posts</span>
            <strong>{blogs.length}</strong>
            <small>All blog entries</small>
          </div>
        </div>

        <div className="BlogManagement-statCard">
          <span className="BlogManagement-statIcon BlogManagement-statIcon--green">
            <FiCheckCircle />
          </span>

          <div>
            <span>Published</span>
            <strong>{publishedCount}</strong>
            <small>Live blog posts</small>
          </div>
        </div>

        <div className="BlogManagement-statCard">
          <span className="BlogManagement-statIcon BlogManagement-statIcon--amber">
            <FiFileText />
          </span>

          <div>
            <span>Drafts</span>
            <strong>{draftCount}</strong>
            <small>Not published yet</small>
          </div>
        </div>

        <div className="BlogManagement-statCard">
          <span className="BlogManagement-statIcon BlogManagement-statIcon--blue">
            <FiCalendar />
          </span>

          <div>
            <span>Scheduled</span>
            <strong>{scheduledCount}</strong>
            <small>Upcoming posts</small>
          </div>
        </div>
      </div>

      {/* Blog collection */}
      <section className="BlogManagement-panel">
        <div className="BlogManagement-panelHeader">
          <div>
            <h2>Your Blog Collection</h2>
            <p>Browse and organize all your blog posts.</p>
          </div>

          <div
            className="BlogManagement-viewToggle"
            aria-label="View mode"
          >
            <button
              type="button"
              className={
                viewMode === "grid"
                  ? "BlogManagement-viewButton BlogManagement-viewButton--active"
                  : "BlogManagement-viewButton"
              }
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              title="Grid view"
            >
              <FiGrid />
            </button>

            <button
              type="button"
              className={
                viewMode === "list"
                  ? "BlogManagement-viewButton BlogManagement-viewButton--active"
                  : "BlogManagement-viewButton"
              }
              onClick={() => setViewMode("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              title="List view"
            >
              <FiList />
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="BlogManagement-toolbar">
          <label className="BlogManagement-search">
            <FiSearch />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                changeFilter(setSearch, event.target.value)
              }
              placeholder="Search title, author, category..."
              aria-label="Search blog posts"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => changeFilter(setSearch, "")}
              >
                <FiX />
              </button>
            )}
          </label>

          <label className="BlogManagement-selectWrap">
            <FiFilter />

            <select
              value={categoryFilter}
              onChange={(event) =>
                changeFilter(setCategoryFilter, event.target.value)
              }
              aria-label="Filter by category"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <FiChevronDown className="BlogManagement-selectArrow" />
          </label>

          <label className="BlogManagement-selectWrap">
            <select
              value={statusFilter}
              onChange={(event) =>
                changeFilter(setStatusFilter, event.target.value)
              }
              aria-label="Filter by status"
            >
              <option value="All Status">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
            </select>

            <FiChevronDown className="BlogManagement-selectArrow" />
          </label>

          <label className="BlogManagement-selectWrap BlogManagement-sortSelect">
            <select
              value={sortBy}
              onChange={(event) =>
                changeFilter(setSortBy, event.target.value)
              }
              aria-label="Sort blog posts"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A–Z</option>
              <option value="mostViewed">Most Viewed</option>
            </select>

            <FiChevronDown className="BlogManagement-selectArrow" />
          </label>
        </div>

        {/* Results count */}
        <div className="BlogManagement-resultsBar">
          <p>
            Showing <strong>{filteredBlogs.length}</strong> blog{" "}
            {filteredBlogs.length === 1 ? "post" : "posts"}
          </p>

          {(search ||
            categoryFilter !== "All Categories" ||
            statusFilter !== "All Status" ||
            sortBy !== "newest") && (
            <button type="button" onClick={clearFilters}>
              <FiX />
              Clear filters
            </button>
          )}
        </div>

        {/* Grid view */}
        {viewMode === "grid" && filteredBlogs.length > 0 && (
          <div className="BlogManagement-grid">
            {visibleBlogs.map((blog) => (
              <article
                className="BlogManagement-card"
                key={blog.id}
              >
                <div className="BlogManagement-cardImage">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <span className="BlogManagement-blogCode">
                    {blog.code}
                  </span>

                  {renderActions(blog)}

                  <div className="BlogManagement-imageStatus">
                    {renderStatus(blog.status)}
                  </div>
                </div>

                <div className="BlogManagement-cardBody">
                  <span className="BlogManagement-category">
                    {blog.category}
                  </span>

                  <h3>{blog.title}</h3>

                  <p className="BlogManagement-excerpt">
                    {blog.excerpt}
                  </p>

                  <div className="BlogManagement-author">
                    <FiUser />
                    <span>{blog.author}</span>
                  </div>

                  <div className="BlogManagement-cardFooter">
                    <div className="BlogManagement-cardMeta">
                      <span>
                        <FiCalendar />
                        {formatDate(blog.date)}
                      </span>

                      <span>
                        <FiEye />
                        {blog.views.toLocaleString("en-IN")} views
                      </span>
                    </div>

                    <button
                      type="button"
                      className="BlogManagement-viewLink"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      View <FiArrowUpRight />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* List view */}
        {viewMode === "list" && filteredBlogs.length > 0 && (
          <div className="BlogManagement-listWrap">
            <table className="BlogManagement-table">
              <thead>
                <tr>
                  <th>Blog Post</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Publish Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <div className="BlogManagement-listPost">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />

                        <div>
                          <strong>{blog.title}</strong>
                          <span>{blog.code}</span>
                          <small>{blog.excerpt}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="BlogManagement-category">
                        {blog.category}
                      </span>
                    </td>

                    <td>
                      <span className="BlogManagement-listAuthor">
                        <FiUser /> {blog.author}
                      </span>
                    </td>

                    <td>{renderStatus(blog.status)}</td>

                    <td>{blog.views.toLocaleString("en-IN")}</td>

                    <td>{formatDate(blog.date)}</td>

                    <td>
                      <div className="BlogManagement-listActions">
                        <button
                          type="button"
                          aria-label={`View ${blog.title}`}
                          title="View"
                          onClick={() => setSelectedBlog(blog)}
                        >
                          <FiEye />
                        </button>

                        <button
                          type="button"
                          aria-label={`Edit ${blog.title}`}
                          title="Edit"
                          onClick={() => handleEdit(blog)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          className="BlogManagement-listDelete"
                          aria-label={`Delete ${blog.title}`}
                          title="Delete"
                          onClick={() => setDeleteId(blog.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {filteredBlogs.length === 0 && (
          <div className="BlogManagement-empty">
            <span>
              <FiImage />
            </span>

            <h3>No blog posts found</h3>

            <p>
              Try changing your search or filters to find a blog.
            </p>

            <button type="button" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredBlogs.length > 0 && (
          <div className="BlogManagement-pagination">
            <span>
              Showing {startIndex + 1}–
              {Math.min(
                startIndex + itemsPerPage,
                filteredBlogs.length
              )}{" "}
              of {filteredBlogs.length} posts
            </span>

            <div className="BlogManagement-pageButtons">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(safePage - 1)}
                aria-label="Previous page"
              >
                ‹
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    page === safePage
                      ? "BlogManagement-pageButton--active"
                      : ""
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Blog preview modal */}
      {selectedBlog && (
        <div
          className="BlogManagement-modalBackdrop"
          onClick={() => setSelectedBlog(null)}
        >
          <section
            className="BlogManagement-detailModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="BlogManagement-detailTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="BlogManagement-modalHeader">
              <div>
                <span className="BlogManagement-eyebrow">
                  BLOG PREVIEW
                </span>

                <h2 id="BlogManagement-detailTitle">
                  Blog Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                aria-label="Close details"
              >
                <FiX />
              </button>
            </div>

            <img
              className="BlogManagement-detailImage"
              src={selectedBlog.image}
              alt={selectedBlog.title}
            />

            <div className="BlogManagement-detailBody">
              <div className="BlogManagement-detailMeta">
                {renderStatus(selectedBlog.status)}

                <span className="BlogManagement-category">
                  {selectedBlog.category}
                </span>

                <span>
                  <FiCalendar /> {formatDate(selectedBlog.date)}
                </span>
              </div>

              <h3>{selectedBlog.title}</h3>

              <p>{selectedBlog.excerpt}</p>

              <div className="BlogManagement-detailAuthor">
                <FiUser />
                Written by {selectedBlog.author}
              </div>

              <div className="BlogManagement-detailTags">
                {selectedBlog.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>

            <div className="BlogManagement-modalFooter">
              <button
                type="button"
                className="BlogManagement-modalSecondary"
                onClick={() => setSelectedBlog(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="BlogManagement-createButton"
                onClick={() => handleEdit(selectedBlog)}
              >
                <FiEdit2 />
                Edit Blog
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div
          className="BlogManagement-modalBackdrop"
          onClick={() => setDeleteId(null)}
        >
          <section
            className="BlogManagement-confirmModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="BlogManagement-deleteTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="BlogManagement-deleteIcon">
              <FiTrash2 />
            </span>

            <h2 id="BlogManagement-deleteTitle">
              Delete blog post?
            </h2>

            <p>
              This blog will be removed from the current list. This
              action cannot be undone.
            </p>

            <div className="BlogManagement-confirmActions">
              <button
                type="button"
                className="BlogManagement-modalSecondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="BlogManagement-confirmDelete"
                onClick={handleDelete}
              >
                <FiTrash2 />
                Delete Blog
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Close the action dropdown when clicking outside */}
      {openMenu !== null && (
        <button
          type="button"
          className="BlogManagement-dismissMenu"
          aria-label="Close actions menu"
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
};

export default BlogManagement;