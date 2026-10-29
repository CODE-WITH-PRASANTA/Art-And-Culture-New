
import React, { useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  FiFileText,
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUploadCloud,
  FiImage,
  FiGrid,
  FiCheckCircle,
  FiCalendar,
  FiTag,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiRotateCcw,
  FiLayers,
  FiUser,
  FiBookOpen,
  FiHash,
} from "react-icons/fi";
import "./BlogPosting.css";

const categories = [
  "Art & Culture",
  "Home Decor",
  "Artist Stories",
  "Events",
  "Traditional Art",
  "Guides",
  "News",
  "Other",
];

const statusOptions = ["Draft", "Published", "Scheduled"];

const createEmptyForm = () => ({
  title: "",
  slug: "",
  authorName: "",
  category: "",
  characteristics: [],
  characteristicInput: "",
  description: "",
  tags: "",
  metaDescription: "",
  status: "Draft",
  publishDate: "",
  mainImage: null,
  bodyImages: [null, null],
});

const initialBlogs = [
  {
    id: 1,
    title: "The Rich Heritage of Odisha Art",
    slug: "rich-heritage-odisha-art",
    authorName: "Ananya Mohanty",
    category: "Art & Culture",
    characteristics: ["Traditional", "Cultural", "Historical"],
    description:
      "<p>Explore the timeless beauty and cultural significance of Odisha's traditional art forms.</p>",
    tags: "Odisha, Art, Culture",
    metaDescription: "Discover the rich heritage of traditional Odisha art.",
    status: "Published",
    publishDate: "2026-10-18",
    mainImage: null,
    bodyImages: [null, null],
    views: 320,
  },
  {
    id: 2,
    title: "How to Choose Art for Your Home",
    slug: "choose-art-for-your-home",
    authorName: "Ritika Das",
    category: "Home Decor",
    characteristics: ["Informative", "Interior Design", "Beginner Friendly"],
    description:
      "<p>Learn how to choose artwork that complements your home and personal style.</p>",
    tags: "Home, Interior, Art",
    metaDescription: "A practical guide to choosing artwork for your home.",
    status: "Published",
    publishDate: "2026-10-16",
    mainImage: null,
    bodyImages: [null, null],
    views: 245,
  },
  {
    id: 3,
    title: "Meet Our Talented Artists",
    slug: "meet-our-talented-artists",
    authorName: "Sourav Behera",
    category: "Artist Stories",
    characteristics: ["Creative", "Artist Interview", "Inspirational"],
    description:
      "<p>Get to know the talented artists behind our exclusive collections.</p>",
    tags: "Artists, Stories",
    metaDescription: "Meet the creative people behind our art collections.",
    status: "Draft",
    publishDate: "",
    mainImage: null,
    bodyImages: [null, null],
    views: 0,
  },
  {
    id: 4,
    title: "Upcoming Creative Workshops",
    slug: "upcoming-creative-workshops",
    authorName: "Priya Mishra",
    category: "Events",
    characteristics: ["Workshop", "Educational", "Hands-on Learning"],
    description:
      "<p>Join our workshops and explore new creative techniques.</p>",
    tags: "Events, Workshop",
    metaDescription: "Explore upcoming creative workshops and events.",
    status: "Scheduled",
    publishDate: "2026-11-05",
    mainImage: null,
    bodyImages: [null, null],
    views: 0,
  },
];

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const normalizeImage = (image) => {
  if (!image) return null;

  if (typeof image === "string") {
    return { name: "Saved image", preview: image, url: image };
  }

  return image;
};

const BlogPosting = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [blogs, setBlogs] = useState(initialBlogs);
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewBlog, setViewBlog] = useState(null);
  const [deleteBlogId, setDeleteBlogId] = useState(null);
  const [notice, setNotice] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const mainImageRef = useRef(null);
  const bodyImageOneRef = useRef(null);
  const bodyImageTwoRef = useRef(null);
  const characteristicInputRef = useRef(null);

  const itemsPerPage = 6;

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogs
      .filter((blog) => {
        const characteristics = (blog.characteristics || []).join(" ");

        const matchesSearch =
          !query ||
          (blog.title || "").toLowerCase().includes(query) ||
          (blog.authorName || "").toLowerCase().includes(query) ||
          (blog.category || "").toLowerCase().includes(query) ||
          (blog.slug || "").toLowerCase().includes(query) ||
          (blog.tags || "").toLowerCase().includes(query) ||
          characteristics.toLowerCase().includes(query);

        const matchesCategory =
          categoryFilter === "All Categories" ||
          blog.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All Statuses" || blog.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOrder === "oldest") {
          return (a.publishDate || "").localeCompare(b.publishDate || "");
        }

        if (sortOrder === "title") {
          return a.title.localeCompare(b.title);
        }

        return (b.publishDate || "").localeCompare(a.publishDate || "");
      });
  }, [blogs, search, categoryFilter, statusFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / itemsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedBlogs = filteredBlogs.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const publishedCount = blogs.filter(
    (blog) => blog.status === "Published"
  ).length;

  const draftCount = blogs.filter((blog) => blog.status === "Draft").length;

  const scheduledCount = blogs.filter(
    (blog) => blog.status === "Scheduled"
  ).length;

  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);

  const openNewForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setNotice("");
    setActiveTab("form");
  };

  const openEditForm = (blog) => {
    setForm({
      ...createEmptyForm(),
      ...blog,
      authorName: blog.authorName || "",
      characteristics: [...(blog.characteristics || [])],
      characteristicInput: "",
      mainImage: normalizeImage(blog.mainImage),
      bodyImages: [
        normalizeImage(blog.bodyImages?.[0]),
        normalizeImage(blog.bodyImages?.[1]),
      ],
    });

    setEditingId(blog.id);
    setNotice("");
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTitleChange = (value) => {
    setForm((previous) => ({
      ...previous,
      title: value,
      slug:
        !editingId ||
        !previous.slug ||
        previous.slug === makeSlug(previous.title)
          ? makeSlug(value)
          : previous.slug,
    }));
  };

  // Add one custom characteristic.
  const addCharacteristic = (value = form.characteristicInput) => {
    const characteristic = value.trim().replace(/\s+/g, " ");

    if (!characteristic) {
      setNotice("Please enter a characteristic first.");
      return;
    }

    const duplicate = form.characteristics.some(
      (item) => item.toLowerCase() === characteristic.toLowerCase()
    );

    if (duplicate) {
      setNotice("This characteristic has already been added.");
      return;
    }

    setForm((previous) => ({
      ...previous,
      characteristics: [...previous.characteristics, characteristic],
      characteristicInput: "",
    }));

    setNotice("");
  };

  const handleCharacteristicKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCharacteristic();
    }

    if (
      event.key === "Backspace" &&
      !form.characteristicInput &&
      form.characteristics.length
    ) {
      removeCharacteristic(
        form.characteristics[form.characteristics.length - 1]
      );
    }
  };

  const removeCharacteristic = (characteristic) => {
    setForm((previous) => ({
      ...previous,
      characteristics: previous.characteristics.filter(
        (item) => item !== characteristic
      ),
    }));
  };

  // Supports pasting several comma-separated characteristics.
  const handleCharacteristicPaste = (event) => {
    const pastedText = event.clipboardData.getData("text");

    if (!pastedText.includes(",")) return;

    event.preventDefault();

    const pastedItems = pastedText
      .split(",")
      .map((item) => item.trim().replace(/\s+/g, " "))
      .filter(Boolean);

    setForm((previous) => {
      const merged = [...previous.characteristics];

      pastedItems.forEach((item) => {
        if (
          !merged.some(
            (existing) => existing.toLowerCase() === item.toLowerCase()
          )
        ) {
          merged.push(item);
        }
      });

      return {
        ...previous,
        characteristics: merged,
        characteristicInput: "",
      };
    });

    setNotice("");
  };

  const handleImageUpload = (event, type, index = 0) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = {
        name: file.name,
        preview: reader.result,
        file,
      };

      setForm((previous) => {
        if (type === "mainImage") {
          return { ...previous, mainImage: imageData };
        }

        const updatedImages = [...previous.bodyImages];
        updatedImages[index] = imageData;

        return { ...previous, bodyImages: updatedImages };
      });

      setNotice("");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const removeImage = (type, index = 0) => {
    setForm((previous) => {
      if (type === "mainImage") {
        return { ...previous, mainImage: null };
      }

      const updatedImages = [...previous.bodyImages];
      updatedImages[index] = null;

      return { ...previous, bodyImages: updatedImages };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setNotice("Please enter a blog title.");
      return;
    }

    const slug = makeSlug(form.slug || form.title);

    const duplicateSlug = blogs.some(
      (blog) => blog.slug === slug && blog.id !== editingId
    );

    if (duplicateSlug) {
      setNotice("This slug already exists. Please use a different slug.");
      return;
    }

    // Include any text that the user typed but did not press Enter to add.
    let finalCharacteristics = [...form.characteristics];
    const pendingCharacteristic = form.characteristicInput.trim();

    if (pendingCharacteristic) {
      const duplicate = finalCharacteristics.some(
        (item) =>
          item.toLowerCase() === pendingCharacteristic.toLowerCase()
      );

      if (!duplicate) finalCharacteristics.push(pendingCharacteristic);
    }

    const existingBlog = blogs.find((blog) => blog.id === editingId);

    const blogData = {
      ...form,
      title: form.title.trim(),
      authorName: form.authorName.trim(),
      slug,
      characteristics: finalCharacteristics,
      id: editingId || Date.now(),
      views: existingBlog?.views || 0,
      bodyImages: [...form.bodyImages],
    };

    if (editingId) {
      setBlogs((previous) =>
        previous.map((blog) => (blog.id === editingId ? blogData : blog))
      );
      setNotice("Blog updated successfully.");
    } else {
      setBlogs((previous) => [blogData, ...previous]);
      setNotice("Blog created successfully.");
    }

    setEditingId(null);
    setForm(createEmptyForm());
    setCurrentPage(1);
    setSelectedIds([]);
    setActiveTab("table");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setNotice("");
  };

  const confirmDelete = () => {
    setBlogs((previous) =>
      previous.filter((blog) => blog.id !== deleteBlogId)
    );

    setSelectedIds((previous) =>
      previous.filter((id) => id !== deleteBlogId)
    );

    setDeleteBlogId(null);
    setNotice("Blog deleted successfully.");
  };

  const toggleSelect = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedBlogs.map((blog) => blog.id);
    const allSelected =
      pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    setSelectedIds((previous) =>
      allSelected
        ? previous.filter((id) => !pageIds.includes(id))
        : [...new Set([...previous, ...pageIds])]
    );
  };

  const deleteSelected = () => {
    if (!selectedIds.length) return;

    setBlogs((previous) =>
      previous.filter((blog) => !selectedIds.includes(blog.id))
    );

    setSelectedIds([]);
    setNotice("Selected blog posts deleted.");
  };

  const changeStatus = (blog, status) => {
    setBlogs((previous) =>
      previous.map((item) =>
        item.id === blog.id ? { ...item, status } : item
      )
    );
  };

  const renderStatus = (status) => (
    <span
      className={`BlogPosting-status BlogPosting-status--${status.toLowerCase()}`}
    >
      <span className="BlogPosting-statusDot" />
      {status}
    </span>
  );

  const renderImagePreview = (image) =>
    image?.preview || image?.url || null;

  return (
    <div className="BlogPosting">
      {notice && (
        <div className="BlogPosting-notice" role="status">
          <FiCheckCircle />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <FiX />
          </button>
        </div>
      )}

      <div className="BlogPosting-stats">
        <div className="BlogPosting-statCard">
          <div className="BlogPosting-statIcon">
            <FiLayers />
          </div>
          <div className="BlogPosting-statContent">
            <span>Total Posts</span>
            <strong>{blogs.length}</strong>
            <small>All blog entries</small>
          </div>
        </div>

        <div className="BlogPosting-statCard">
          <div className="BlogPosting-statIcon BlogPosting-statIcon--green">
            <FiCheckCircle />
          </div>
          <div className="BlogPosting-statContent">
            <span>Published</span>
            <strong>{publishedCount}</strong>
            <small>Live on your website</small>
          </div>
        </div>

        <div className="BlogPosting-statCard">
          <div className="BlogPosting-statIcon BlogPosting-statIcon--amber">
            <FiFileText />
          </div>
          <div className="BlogPosting-statContent">
            <span>Drafts</span>
            <strong>{draftCount}</strong>
            <small>Work in progress</small>
          </div>
        </div>

        <div className="BlogPosting-statCard">
          <div className="BlogPosting-statIcon BlogPosting-statIcon--blue">
            <FiEye />
          </div>
          <div className="BlogPosting-statContent">
            <span>Total Views</span>
            <strong>{totalViews.toLocaleString("en-IN")}</strong>
            <small>{scheduledCount} scheduled posts</small>
          </div>
        </div>
      </div>

      <div className="BlogPosting-workspace">
        <div className="BlogPosting-workspaceHeader">
          <div>
            <h2>Manage your content</h2>
            <p>Switch between your editor and all existing posts.</p>
          </div>

          <div className="BlogPosting-tabs">
            <button
              type="button"
              className={`BlogPosting-tab ${
                activeTab === "form" ? "BlogPosting-tab--active" : ""
              }`}
              onClick={() => {
                setNotice("");
                setActiveTab("form");
              }}
            >
              <FiPlus />
              Blog Form
            </button>

            <button
              type="button"
              className={`BlogPosting-tab ${
                activeTab === "table" ? "BlogPosting-tab--active" : ""
              }`}
              onClick={() => setActiveTab("table")}
            >
              <FiGrid />
              Blog Table
              <span className="BlogPosting-tabCount">{blogs.length}</span>
            </button>
          </div>
        </div>

        {activeTab === "form" && (
          <form
            className="BlogPosting-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="BlogPosting-formTop">
              <div>
                <span className="BlogPosting-sectionKicker">
                  {editingId ? "EDIT CONTENT" : "NEW CONTENT"}
                </span>
                <h3>{editingId ? "Update Blog Post" : "Create a Blog Post"}</h3>
                <p>
                  Add the author, characteristics, story, images, and
                  publishing details. Only the title is needed to save a post.
                </p>
              </div>

              {editingId && (
                <span className="BlogPosting-editBadge">Editing post</span>
              )}
            </div>

            <div className="BlogPosting-formGrid">
              <div className="BlogPosting-field BlogPosting-field--wide">
                <label htmlFor="BlogPosting-title">Blog Title</label>
                <input
                  id="BlogPosting-title"
                  type="text"
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="Give your blog a meaningful title"
                />
              </div>

              <div className="BlogPosting-field">
                <label htmlFor="BlogPosting-authorName">Author Name</label>
                <div className="BlogPosting-inputWithIcon">
                  <FiUser />
                  <input
                    id="BlogPosting-authorName"
                    type="text"
                    value={form.authorName}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        authorName: event.target.value,
                      }))
                    }
                    placeholder="Enter author name"
                  />
                </div>
              </div>

              <div className="BlogPosting-field">
                <label htmlFor="BlogPosting-slug">URL Slug</label>
                <div className="BlogPosting-inputWithIcon">
                  <span>/blog/</span>
                  <input
                    id="BlogPosting-slug"
                    type="text"
                    value={form.slug}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        slug: makeSlug(event.target.value),
                      }))
                    }
                    placeholder="your-blog-slug"
                  />
                </div>
              </div>

              <div className="BlogPosting-field">
                <label htmlFor="BlogPosting-category">Category</label>
                <select
                  id="BlogPosting-category"
                  value={form.category}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      category: event.target.value,
                    }))
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* CUSTOM MULTIPLE CHARACTERISTICS */}
              <div className="BlogPosting-field BlogPosting-field--wide">
                <div className="BlogPosting-characteristicsHeading">
                  <div>
                    <label htmlFor="BlogPosting-characteristicInput">
                      Characteristics
                    </label>
                    <p>
                      Write your own characteristics. Add as many as you need.
                    </p>
                  </div>

                  <span className="BlogPosting-characteristicCount">
                    {form.characteristics.length} added
                  </span>
                </div>

                <div className="BlogPosting-characteristicInputRow">
                  <div className="BlogPosting-inputWithIcon BlogPosting-characteristicInputBox">
                    <FiHash />
                    <input
                      ref={characteristicInputRef}
                      id="BlogPosting-characteristicInput"
                      type="text"
                      value={form.characteristicInput}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          characteristicInput: event.target.value,
                        }))
                      }
                      onKeyDown={handleCharacteristicKeyDown}
                      onPaste={handleCharacteristicPaste}
                      placeholder="e.g. Traditional Art, Beginner Guide"
                      aria-describedby="BlogPosting-characteristicHelp"
                    />
                  </div>

                  <button
                    type="button"
                    className="BlogPosting-addCharacteristicButton"
                    onClick={() => addCharacteristic()}
                  >
                    <FiPlus />
                    Add
                  </button>
                </div>

                <small
                  id="BlogPosting-characteristicHelp"
                  className="BlogPosting-fieldHint"
                >
                  Press Enter or click Add for each characteristic. You can
                  also paste comma-separated values.
                </small>

                <div className="BlogPosting-selectedCharacteristics">
                  {form.characteristics.length > 0 ? (
                    form.characteristics.map((characteristic) => (
                      <span
                        className="BlogPosting-characteristicChip"
                        key={characteristic}
                      >
                        <FiTag />
                        {characteristic}
                        <button
                          type="button"
                          aria-label={`Remove ${characteristic}`}
                          onClick={() =>
                            removeCharacteristic(characteristic)
                          }
                        >
                          <FiX />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="BlogPosting-noCharacteristics">
                      No characteristics added yet.
                    </span>
                  )}
                </div>
              </div>

              <div className="BlogPosting-field BlogPosting-field--wide">
                <label>Blog Description</label>
                <div className="BlogPosting-editor">
                  <Editor
                    apiKey="8hswbe7bfeeneui9eb9gjgsym8ku30nx5gwre9808ajdzniu"
                    value={form.description}
                    onEditorChange={(content) =>
                      setForm((previous) => ({
                        ...previous,
                        description: content,
                      }))
                    }
                    init={{
                      height: 380,
                      menubar: "file edit view insert format tools table",
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | bold italic underline | " +
                        "forecolor backcolor | alignleft aligncenter " +
                        "alignright | bullist numlist | link image media table | " +
                        "removeformat | code fullscreen",
                      branding: false,
                      promotion: false,
                      resize: true,
                      content_style:
                        "body { font-family: Arial, sans-serif; font-size: 15px; line-height: 1.7; color: #40382f; padding: 12px; }",
                    }}
                  />
                </div>
              </div>

              <div className="BlogPosting-field BlogPosting-field--wide">
                <div className="BlogPosting-fieldHeading">
                  <div className="BlogPosting-uploadHeadingIcon">
                    <FiImage />
                  </div>
                  <div>
                    <label>Main Featured Image</label>
                    <p>Upload the cover image displayed with your blog.</p>
                  </div>
                </div>

                <input
                  ref={mainImageRef}
                  className="BlogPosting-hiddenInput"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleImageUpload(event, "mainImage")
                  }
                />

                {form.mainImage ? (
                  <div className="BlogPosting-mainImagePreview">
                    <img
                      src={renderImagePreview(form.mainImage)}
                      alt="Main blog preview"
                    />
                    <div className="BlogPosting-imageOverlay">
                      <div>
                        <strong>
                          {form.mainImage.name || "Featured image"}
                        </strong>
                        <span>Main featured image</span>
                      </div>

                      <div className="BlogPosting-imageActions">
                        <button
                          type="button"
                          onClick={() => mainImageRef.current?.click()}
                          aria-label="Replace main image"
                        >
                          <FiRotateCcw />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage("mainImage")}
                          aria-label="Remove main image"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="BlogPosting-uploadBox BlogPosting-uploadBox--main"
                    onClick={() => mainImageRef.current?.click()}
                  >
                    <span className="BlogPosting-uploadIcon">
                      <FiUploadCloud />
                    </span>
                    <strong>Click to upload main image</strong>
                    <span>Choose an image from your device</span>
                    <small>JPG, PNG, WEBP · Up to 5 MB</small>
                  </button>
                )}
              </div>

              <div className="BlogPosting-field BlogPosting-field--wide">
                <div className="BlogPosting-fieldHeading">
                  <div className="BlogPosting-uploadHeadingIcon">
                    <FiLayers />
                  </div>
                  <div>
                    <label>Body Images</label>
                    <p>Add two images to use inside the body of your blog post.</p>
                  </div>
                  <span className="BlogPosting-imageCount">2 image slots</span>
                </div>

                <div className="BlogPosting-bodyImageGrid">
                  {[0, 1].map((index) => {
                    const image = form.bodyImages[index];
                    const inputRef =
                      index === 0 ? bodyImageOneRef : bodyImageTwoRef;

                    return (
                      <div
                        className="BlogPosting-bodyImageCard"
                        key={index}
                      >
                        <input
                          ref={inputRef}
                          className="BlogPosting-hiddenInput"
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleImageUpload(event, "bodyImages", index)
                          }
                        />

                        <div className="BlogPosting-bodyImageNumber">
                          Image 0{index + 1}
                        </div>

                        {image ? (
                          <div className="BlogPosting-bodyImagePreview">
                            <img
                              src={renderImagePreview(image)}
                              alt={`Body image ${index + 1}`}
                            />
                            <div className="BlogPosting-bodyImageActions">
                              <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                              >
                                <FiRotateCcw /> Replace
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  removeImage("bodyImages", index)
                                }
                              >
                                <FiTrash2 /> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="BlogPosting-uploadBox BlogPosting-uploadBox--body"
                            onClick={() => inputRef.current?.click()}
                          >
                            <span className="BlogPosting-uploadIcon">
                              <FiImage />
                            </span>
                            <strong>Upload body image {index + 1}</strong>
                            <span>Choose an image from your device</span>
                            <small>JPG, PNG, WEBP · Up to 5 MB</small>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="BlogPosting-field">
                <label htmlFor="BlogPosting-tags">Tags</label>
                <div className="BlogPosting-inputWithIcon">
                  <FiTag />
                  <input
                    id="BlogPosting-tags"
                    type="text"
                    value={form.tags}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        tags: event.target.value,
                      }))
                    }
                    placeholder="Art, Culture, Inspiration"
                  />
                </div>
                <small className="BlogPosting-fieldHint">
                  Separate tags with commas.
                </small>
              </div>

              <div className="BlogPosting-field">
                <label htmlFor="BlogPosting-status">Publishing Status</label>
                <select
                  id="BlogPosting-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      status: event.target.value,
                    }))
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="BlogPosting-field">
                <label htmlFor="BlogPosting-publishDate">Publish Date</label>
                <div className="BlogPosting-inputWithIcon">
                  <FiCalendar />
                  <input
                    id="BlogPosting-publishDate"
                    type="date"
                    value={form.publishDate}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        publishDate: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="BlogPosting-field BlogPosting-field--wide">
                <label htmlFor="BlogPosting-metaDescription">
                  SEO Meta Description
                </label>
                <textarea
                  id="BlogPosting-metaDescription"
                  rows="3"
                  maxLength={300}
                  value={form.metaDescription}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      metaDescription: event.target.value,
                    }))
                  }
                  placeholder="Write a short description for search engines..."
                />
                <small className="BlogPosting-fieldHint">
                  {form.metaDescription.length}/300 characters
                </small>
              </div>
            </div>

            <div className="BlogPosting-formFooter">
              <div className="BlogPosting-formFooterNote">
                <FiCheckCircle />
                <span>
                  Your content stays in this session until connected to a
                  backend.
                </span>
              </div>

              <div className="BlogPosting-formActions">
                <button
                  type="button"
                  className="BlogPosting-secondaryButton"
                  onClick={resetForm}
                >
                  <FiRotateCcw /> Reset
                </button>

                <button
                  type="button"
                  className="BlogPosting-outlineButton"
                  onClick={() => setActiveTab("table")}
                >
                  Cancel
                </button>

                <button type="submit" className="BlogPosting-primaryButton">
                  <FiSave />
                  {editingId ? "Update Blog" : "Save Blog"}
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === "table" && (
          <div className="BlogPosting-tableSection">
            <div className="BlogPosting-tableHeading">
              <div>
                <h3>All Blog Posts</h3>
                <p>Search, edit, and organize your published content.</p>
              </div>

              <button
                type="button"
                className="BlogPosting-primaryButton"
                onClick={openNewForm}
              >
                <FiPlus /> Add Blog
              </button>
            </div>

            <div className="BlogPosting-filters">
              <div className="BlogPosting-searchBox">
                <FiSearch />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search title, author, characteristics, or tags..."
                  aria-label="Search blog posts"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    aria-label="Clear search"
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <div className="BlogPosting-filterSelect">
                <FiFilter />
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by category"
                >
                  <option value="All Categories">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="BlogPosting-filterSelect">
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter by status"
                >
                  <option value="All Statuses">All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="BlogPosting-filterSelect">
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  aria-label="Sort blog posts"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="BlogPosting-bulkBar">
                <span>
                  {selectedIds.length} post
                  {selectedIds.length > 1 ? "s" : ""} selected
                </span>
                <button type="button" onClick={deleteSelected}>
                  <FiTrash2 /> Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                >
                  Clear selection
                </button>
              </div>
            )}

            <div className="BlogPosting-tableWrap">
              <table className="BlogPosting-table">
                <thead>
                  <tr>
                    <th className="BlogPosting-checkColumn">
                      <input
                        type="checkbox"
                        checked={
                          paginatedBlogs.length > 0 &&
                          paginatedBlogs.every((blog) =>
                            selectedIds.includes(blog.id)
                          )
                        }
                        onChange={toggleSelectAll}
                        aria-label="Select all posts on this page"
                      />
                    </th>
                    <th>Blog Post</th>
                    <th>Author Name</th>
                    <th>Category</th>
                    <th>Characteristics</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Publish Date</th>
                    <th className="BlogPosting-actionsColumn">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBlogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(blog.id)}
                          onChange={() => toggleSelect(blog.id)}
                          aria-label={`Select ${blog.title}`}
                        />
                      </td>

                      <td>
                        <div className="BlogPosting-postCell">
                          <div className="BlogPosting-postThumbnail">
                            {renderImagePreview(blog.mainImage) ? (
                              <img
                                src={renderImagePreview(blog.mainImage)}
                                alt=""
                              />
                            ) : (
                              <FiFileText />
                            )}
                          </div>
                          <div className="BlogPosting-postInfo">
                            <strong>{blog.title}</strong>
                            <span>{blog.slug}</span>
                            <small>
                              {blog.bodyImages?.filter(Boolean).length || 0}{" "}
                              body images
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="BlogPosting-authorCell">
                          <FiUser />
                          {blog.authorName || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="BlogPosting-categoryBadge">
                          {blog.category || "Uncategorized"}
                        </span>
                      </td>

                      <td>
                        <div className="BlogPosting-tableCharacteristics">
                          {blog.characteristics?.length ? (
                            <>
                              {blog.characteristics.slice(0, 2).map((item) => (
                                <span
                                  className="BlogPosting-characteristicBadge"
                                  key={item}
                                >
                                  {item}
                                </span>
                              ))}
                              {blog.characteristics.length > 2 && (
                                <span
                                  className="BlogPosting-characteristicMore"
                                  title={blog.characteristics
                                    .slice(2)
                                    .join(", ")}
                                >
                                  +{blog.characteristics.length - 2}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="BlogPosting-noCharacteristics">
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      <td>{renderStatus(blog.status)}</td>

                      <td>
                        <span className="BlogPosting-views">
                          <FiEye />
                          {blog.views.toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td>
                        <span className="BlogPosting-date">
                          {formatDate(blog.publishDate)}
                        </span>
                      </td>

                      <td>
                        <div className="BlogPosting-rowActions">
                          <button
                            type="button"
                            className="BlogPosting-actionButton"
                            title="View blog"
                            aria-label={`View ${blog.title}`}
                            onClick={() => setViewBlog(blog)}
                          >
                            <FiEye />
                          </button>

                          <button
                            type="button"
                            className="BlogPosting-actionButton"
                            title="Edit blog"
                            aria-label={`Edit ${blog.title}`}
                            onClick={() => openEditForm(blog)}
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            className="BlogPosting-actionButton BlogPosting-actionButton--delete"
                            title="Delete blog"
                            aria-label={`Delete ${blog.title}`}
                            onClick={() => setDeleteBlogId(blog.id)}
                          >
                            <FiTrash2 />
                          </button>

                          <select
                            className="BlogPosting-quickStatus"
                            value={blog.status}
                            onChange={(event) =>
                              changeStatus(blog, event.target.value)
                            }
                            aria-label={`Change status for ${blog.title}`}
                            title="Change status"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedBlogs.length === 0 && (
                    <tr>
                      <td colSpan="9">
                        <div className="BlogPosting-emptyState">
                          <div className="BlogPosting-emptyIcon">
                            <FiFileText />
                          </div>
                          <h4>No blog posts found</h4>
                          <p>
                            Try another search or create a new blog post.
                          </p>
                          <button
                            type="button"
                            className="BlogPosting-primaryButton"
                            onClick={openNewForm}
                          >
                            <FiPlus /> Create Blog
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="BlogPosting-tableFooter">
              <span>
                Showing{" "}
                {filteredBlogs.length === 0
                  ? 0
                  : (safePage - 1) * itemsPerPage + 1}{" "}
                to {Math.min(safePage * itemsPerPage, filteredBlogs.length)} of{" "}
                {filteredBlogs.length} posts
              </span>

              <div className="BlogPosting-pagination">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage(safePage - 1)}
                  aria-label="Previous page"
                >
                  <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - safePage) <= 1
                  )
                  .map((page, index, pages) => (
                    <React.Fragment key={page}>
                      {index > 0 && pages[index - 1] !== page - 1 && (
                        <span className="BlogPosting-paginationDots">…</span>
                      )}
                      <button
                        type="button"
                        className={
                          safePage === page
                            ? "BlogPosting-pageButton--active"
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
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage(safePage + 1)}
                  aria-label="Next page"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {viewBlog && (
        <div
          className="BlogPosting-modalBackdrop"
          onClick={() => setViewBlog(null)}
        >
          <div
            className="BlogPosting-viewModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="BlogPosting-viewTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="BlogPosting-modalHeader">
              <div>
                <span className="BlogPosting-sectionKicker">POST PREVIEW</span>
                <h3 id="BlogPosting-viewTitle">Blog Details</h3>
              </div>
              <button
                type="button"
                className="BlogPosting-modalClose"
                onClick={() => setViewBlog(null)}
                aria-label="Close preview"
              >
                <FiX />
              </button>
            </div>

            {renderImagePreview(viewBlog.mainImage) && (
              <img
                className="BlogPosting-viewMainImage"
                src={renderImagePreview(viewBlog.mainImage)}
                alt={viewBlog.title}
              />
            )}

            <div className="BlogPosting-viewContent">
              <div className="BlogPosting-viewMeta">
                {renderStatus(viewBlog.status)}
                <span>{viewBlog.category || "Uncategorized"}</span>
                <span>{formatDate(viewBlog.publishDate)}</span>
              </div>

              <h2>{viewBlog.title}</h2>
              <p className="BlogPosting-viewSlug">/blog/{viewBlog.slug}</p>

              <div className="BlogPosting-previewAuthor">
                <FiUser />
                <span>Author: {viewBlog.authorName || "Not specified"}</span>
              </div>

              {viewBlog.characteristics?.length > 0 && (
                <div className="BlogPosting-previewCharacteristics">
                  <strong>
                    <FiBookOpen /> Characteristics
                  </strong>
                  <div>
                    {viewBlog.characteristics.map((item) => (
                      <span
                        className="BlogPosting-characteristicBadge"
                        key={item}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="BlogPosting-viewDescription"
                dangerouslySetInnerHTML={{
                  __html: viewBlog.description || "<p>No description added.</p>",
                }}
              />

              {viewBlog.bodyImages?.some(Boolean) && (
                <div className="BlogPosting-viewImages">
                  {viewBlog.bodyImages.map(
                    (image, index) =>
                      image && (
                        <img
                          key={index}
                          src={renderImagePreview(image)}
                          alt={`Body image ${index + 1}`}
                        />
                      )
                  )}
                </div>
              )}

              {viewBlog.tags && (
                <p className="BlogPosting-viewTags">
                  <FiTag /> {viewBlog.tags}
                </p>
              )}

              {viewBlog.metaDescription && (
                <div className="BlogPosting-seoPreview">
                  <strong>SEO Meta Description</strong>
                  <p>{viewBlog.metaDescription}</p>
                </div>
              )}
            </div>

            <div className="BlogPosting-modalFooter">
              <button
                type="button"
                className="BlogPosting-outlineButton"
                onClick={() => setViewBlog(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="BlogPosting-primaryButton"
                onClick={() => {
                  const blog = viewBlog;
                  setViewBlog(null);
                  openEditForm(blog);
                }}
              >
                <FiEdit2 /> Edit Blog
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteBlogId !== null && (
        <div
          className="BlogPosting-modalBackdrop"
          onClick={() => setDeleteBlogId(null)}
        >
          <div
            className="BlogPosting-confirmModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="BlogPosting-deleteTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="BlogPosting-confirmIcon">
              <FiTrash2 />
            </div>
            <h3 id="BlogPosting-deleteTitle">Delete this blog post?</h3>
            <p>
              This post will be removed from the current list. This action
              cannot be undone.
            </p>
            <div className="BlogPosting-confirmActions">
              <button
                type="button"
                className="BlogPosting-outlineButton"
                onClick={() => setDeleteBlogId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="BlogPosting-deleteConfirmButton"
                onClick={confirmDelete}
              >
                <FiTrash2 /> Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPosting;
