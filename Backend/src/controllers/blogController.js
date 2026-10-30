const Blog = require("../models/Blog");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Ensure blog uploads directory exists
const blogsUploadDir = path.resolve(__dirname, "../../uploads/blogs");
if (!fs.existsSync(blogsUploadDir)) {
  fs.mkdirSync(blogsUploadDir, { recursive: true });
}

/**
 * Helper: Save base64 or buffer image to /uploads/blogs/*.webp
 */
const saveBase64ImageToWebp = async (imageInput, prefix = "blog") => {
  if (!imageInput) return "";

  // If it's an object with { preview, dataUrl, url }
  let dataUrl = typeof imageInput === "string" ? imageInput : (imageInput.preview || imageInput.dataUrl || imageInput.url || "");

  if (!dataUrl || typeof dataUrl !== "string") return "";

  // If already a relative path or remote URL, return as is
  if (!dataUrl.startsWith("data:image/")) {
    return dataUrl;
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches || matches.length < 3) return dataUrl;

    const buffer = Buffer.from(matches[2], "base64");
    const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const filepath = path.join(blogsUploadDir, filename);

    await sharp(buffer)
      .webp({ quality: 85 })
      .toFile(filepath);

    return `/uploads/blogs/${filename}`;
  } catch (err) {
    console.error("Error converting image to WebP:", err);
    return dataUrl;
  }
};

/**
 * Helper: Clean and format slug
 */
const cleanSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/**
 * Helper: Ensure unique slug
 */
const getUniqueSlug = async (rawSlug, excludeId = null) => {
  let baseSlug = cleanSlug(rawSlug) || "blog";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Blog.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
};

/**
 * Helper: Generate next blog code (e.g. BLOG-0001)
 */
const generateNextBlogCode = async () => {
  const blogs = await Blog.find({}, { blogCode: 1 }).lean();
  let highest = 0;
  for (const b of blogs) {
    const match = String(b.blogCode || "").match(/BLOG-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > highest) highest = num;
    }
  }
  return `BLOG-${String(highest + 1).padStart(4, "0")}`;
};

/**
 * Helper: Extract plain text excerpt from HTML
 */
const extractExcerpt = (html, length = 160) => {
  if (!html) return "";
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= length) return plain;
  return plain.slice(0, length) + "...";
};

/**
 * Helper: Calculate read time
 */
const calculateReadTime = (htmlOrText) => {
  if (!htmlOrText) return "3 min read";
  const plain = htmlOrText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = plain.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

/**
 * @desc Get next Blog Code
 * @route GET /api/blogs/next-code
 */
exports.getNextBlogCode = async (req, res) => {
  try {
    const nextCode = await generateNextBlogCode();
    res.status(200).json({ success: true, nextCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Create new blog
 * @route POST /api/blogs
 */
exports.createBlog = async (req, res) => {
  try {
    const body = req.body;

    if (!body.title || !body.title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required",
      });
    }

    // Auto-generate code if missing
    const blogCode = body.blogCode || (await generateNextBlogCode());

    // Generate unique slug
    const slug = await getUniqueSlug(body.slug || body.title);

    // Convert main image to webp
    let mainImageUrl = "";
    if (body.mainImage) {
      mainImageUrl = await saveBase64ImageToWebp(body.mainImage, "blog-main");
    }

    // Convert body images to webp
    let bodyImageUrls = [];
    if (Array.isArray(body.bodyImages)) {
      for (let i = 0; i < body.bodyImages.length; i++) {
        const img = body.bodyImages[i];
        if (img) {
          const webpPath = await saveBase64ImageToWebp(img, `blog-body-${i + 1}`);
          bodyImageUrls.push(webpPath);
        } else {
          bodyImageUrls.push("");
        }
      }
    }

    // Format tags
    let tags = [];
    if (Array.isArray(body.tags)) {
      tags = body.tags;
    } else if (typeof body.tags === "string") {
      tags = body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Format characteristics
    let characteristics = [];
    if (Array.isArray(body.characteristics)) {
      characteristics = body.characteristics.map((c) => String(c).trim()).filter(Boolean);
    }

    const excerpt = body.excerpt || extractExcerpt(body.description || body.metaDescription || "");
    const readTime = calculateReadTime(body.description || "");

    const newBlog = new Blog({
      blogCode,
      title: body.title.trim(),
      slug,
      authorName: (body.authorName || "Admin").trim(),
      category: (body.category || "Art & Culture").trim(),
      characteristics,
      description: body.description || "",
      excerpt,
      tags,
      metaDescription: body.metaDescription || "",
      status: body.status || "Draft",
      publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
      mainImage: mainImageUrl,
      bodyImages: bodyImageUrls,
      views: Number(body.views) || 0,
      readTime,
      commentsCount: Number(body.commentsCount) || 0,
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: savedBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create blog",
    });
  }
};

/**
 * @desc Get all blogs with filters & pagination
 * @route GET /api/blogs
 */
exports.getBlogs = async (req, res) => {
  try {
    const { status, category, search, sort = "newest", page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by status (e.g. Published)
    if (status && status !== "All" && status !== "All Status" && status !== "All Statuses") {
      query.status = status;
    }

    // Filter by category
    if (category && category !== "All Categories" && category !== "All") {
      query.category = category;
    }

    // Search query
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: regex },
        { authorName: regex },
        { category: regex },
        { slug: regex },
        { tags: regex },
        { blogCode: regex },
      ];
    }

    // Sorting
    let sortObj = { publishDate: -1, createdAt: -1 };
    if (sort === "oldest") {
      sortObj = { publishDate: 1, createdAt: 1 };
    } else if (sort === "title") {
      sortObj = { title: 1 };
    } else if (sort === "views" || sort === "mostViewed") {
      sortObj = { views: -1 };
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort(sortObj).skip(skip).limit(Number(limit)).lean(),
      Blog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch blogs",
    });
  }
};

/**
 * @desc Get single blog by slug or ID
 * @route GET /api/blogs/:slugOrId
 */
exports.getBlogBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const { incrementViews } = req.query;

    let blog = null;

    // Check if valid ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(slugOrId);
    if (isObjectId) {
      blog = await Blog.findById(slugOrId);
    }

    if (!blog) {
      // Find by slug
      blog = await Blog.findOne({ slug: slugOrId.toLowerCase() });
    }

    if (!blog) {
      // Find by blogCode
      blog = await Blog.findOne({ blogCode: slugOrId.toUpperCase() });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment views if requested
    if (incrementViews === "true" || incrementViews === true) {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error fetching blog details:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch blog",
    });
  }
};

/**
 * @desc Update blog
 * @route PUT /api/blogs/:id
 */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Unique slug check if slug changed
    if (body.slug && cleanSlug(body.slug) !== existingBlog.slug) {
      existingBlog.slug = await getUniqueSlug(body.slug, existingBlog._id);
    } else if (body.title && !existingBlog.slug) {
      existingBlog.slug = await getUniqueSlug(body.title, existingBlog._id);
    }

    if (body.title !== undefined) existingBlog.title = body.title.trim();
    if (body.authorName !== undefined) existingBlog.authorName = body.authorName.trim();
    if (body.category !== undefined) existingBlog.category = body.category.trim();
    if (body.description !== undefined) existingBlog.description = body.description;
    if (body.metaDescription !== undefined) existingBlog.metaDescription = body.metaDescription;
    if (body.status !== undefined) existingBlog.status = body.status;
    if (body.publishDate !== undefined) existingBlog.publishDate = new Date(body.publishDate);
    if (body.views !== undefined) existingBlog.views = Number(body.views);

    // Update tags
    if (body.tags !== undefined) {
      if (Array.isArray(body.tags)) {
        existingBlog.tags = body.tags;
      } else if (typeof body.tags === "string") {
        existingBlog.tags = body.tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    // Update characteristics
    if (body.characteristics !== undefined) {
      if (Array.isArray(body.characteristics)) {
        existingBlog.characteristics = body.characteristics.map((c) => String(c).trim()).filter(Boolean);
      }
    }

    // Main image conversion
    if (body.mainImage !== undefined) {
      if (body.mainImage === null || body.mainImage === "") {
        existingBlog.mainImage = "";
      } else {
        const webp = await saveBase64ImageToWebp(body.mainImage, "blog-main");
        existingBlog.mainImage = webp;
      }
    }

    // Body images conversion
    if (body.bodyImages !== undefined && Array.isArray(body.bodyImages)) {
      const updatedBodyImages = [];
      for (let i = 0; i < body.bodyImages.length; i++) {
        const img = body.bodyImages[i];
        if (img) {
          const webp = await saveBase64ImageToWebp(img, `blog-body-${i + 1}`);
          updatedBodyImages.push(webp);
        } else {
          updatedBodyImages.push("");
        }
      }
      existingBlog.bodyImages = updatedBodyImages;
    }

    // Recompute excerpt and readTime
    existingBlog.excerpt = body.excerpt || extractExcerpt(existingBlog.description || existingBlog.metaDescription || "");
    existingBlog.readTime = calculateReadTime(existingBlog.description || "");

    const updatedBlog = await existingBlog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update blog",
    });
  }
};

/**
 * @desc Delete blog
 * @route DELETE /api/blogs/:id
 */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Try deleting uploaded files if in /uploads/blogs/
    const removeLocalFile = (relPath) => {
      if (!relPath || typeof relPath !== "string" || !relPath.startsWith("/uploads/blogs/")) return;
      const fileName = path.basename(relPath);
      const fullPath = path.join(blogsUploadDir, fileName);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.warn("Could not delete file:", fullPath, e.message);
        }
      }
    };

    removeLocalFile(blog.mainImage);
    if (Array.isArray(blog.bodyImages)) {
      blog.bodyImages.forEach(removeLocalFile);
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete blog",
    });
  }
};

