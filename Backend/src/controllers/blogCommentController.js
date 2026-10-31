const BlogComment = require("../models/BlogComment");
const Blog = require("../models/Blog");

// @desc    Get all blog comments / reviews (with optional filters)
// @route   GET /api/blog-comments
// @access  Public / Admin
const getComments = async (req, res) => {
  try {
    const { blogSlug, blogId, status, search } = req.query;
    const filter = {};

    if (blogSlug && blogSlug.trim()) {
      filter.blogSlug = blogSlug.trim().toLowerCase();
    }

    if (blogId && blogId.trim()) {
      filter.blogId = blogId.trim();
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { author: regex },
        { email: regex },
        { comment: regex },
        { blogTitle: regex },
      ];
    }

    const comments = await BlogComment.find(filter)
      .populate("blogId", "title slug mainImage category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Error in getComments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

// @desc    Get each blog and its comments grouped
// @route   GET /api/blog-comments/by-blog
// @access  Admin
const getCommentsGroupedByBlog = async (req, res) => {
  try {
    // 1. Fetch all published blogs
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

    // 2. Fetch all comments
    const allComments = await BlogComment.find().sort({ createdAt: -1 }).lean();

    // 3. Map comments to each blog
    const blogsWithComments = blogs.map((blog) => {
      const blogIdStr = blog._id.toString();
      const blogSlug = (blog.slug || "").toLowerCase();

      const commentsForBlog = allComments.filter((c) => {
        const cBlogId = c.blogId ? c.blogId.toString() : "";
        const cSlug = (c.blogSlug || "").toLowerCase();
        return cBlogId === blogIdStr || (cSlug && cSlug === blogSlug);
      });

      return {
        ...blog,
        id: blog._id.toString(),
        comments: commentsForBlog,
        commentsCount: commentsForBlog.length,
      };
    });

    // 4. Also check for comments on default / fallback blogs not yet in MongoDB
    const mappedCommentIds = new Set();
    blogsWithComments.forEach((b) => {
      b.comments.forEach((c) => mappedCommentIds.add(c._id.toString()));
    });

    const unmappedComments = allComments.filter(
      (c) => !mappedCommentIds.has(c._id.toString())
    );

    // Group unmapped by slug
    const unmappedGroups = {};
    unmappedComments.forEach((c) => {
      const key = c.blogSlug || "general";
      if (!unmappedGroups[key]) {
        unmappedGroups[key] = {
          _id: `custom-${key}`,
          id: `custom-${key}`,
          title: c.blogTitle || `Article (${key})`,
          slug: key,
          category: "Art & Culture",
          comments: [],
          commentsCount: 0,
        };
      }
      unmappedGroups[key].comments.push(c);
      unmappedGroups[key].commentsCount += 1;
    });

    const combined = [...blogsWithComments, ...Object.values(unmappedGroups)];

    return res.status(200).json({
      success: true,
      count: combined.length,
      totalComments: allComments.length,
      data: combined,
    });
  } catch (error) {
    console.error("Error in getCommentsGroupedByBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch grouped blog comments",
      error: error.message,
    });
  }
};

// @desc    Create a new blog comment with DUPLICACY PREVENTION
// @route   POST /api/blog-comments
// @access  Public
const createComment = async (req, res) => {
  try {
    const {
      blogId,
      blogSlug,
      blogTitle,
      author,
      email,
      comment,
      rating,
    } = req.body;

    // Validate required fields
    if (!author || !author.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write a comment message.",
      });
    }

    const cleanAuthor = author.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanComment = comment.trim();
    const cleanSlug = (blogSlug || "general").trim().toLowerCase();

    // Determine target blog and title
    let targetBlogId = null;
    let targetTitle = (blogTitle || "").trim();

    if (blogId) {
      const foundBlog = await Blog.findById(blogId);
      if (foundBlog) {
        targetBlogId = foundBlog._id;
        if (!targetTitle) targetTitle = foundBlog.title;
      }
    } else if (blogSlug) {
      const foundBlog = await Blog.findOne({ slug: cleanSlug });
      if (foundBlog) {
        targetBlogId = foundBlog._id;
        if (!targetTitle) targetTitle = foundBlog.title;
      }
    }

    if (!targetTitle) {
      targetTitle = cleanSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }

    // ========================================================
    // 🛡️ PREVENT DUPLICACY: Exact Content Duplicate Check
    // ========================================================
    const duplicateComment = await BlogComment.findOne({
      blogSlug: cleanSlug,
      email: cleanEmail,
      comment: cleanComment,
    });

    if (duplicateComment) {
      return res.status(409).json({
        success: false,
        message:
          "Duplicate comment detected. You have already submitted this identical comment on this article.",
      });
    }

    // ========================================================
    // 🛡️ PREVENT DUPLICACY: Rate-limiting / Rapid Spam Check
    // Prevent submitting multiple comments within 30 seconds
    // ========================================================
    const recentComment = await BlogComment.findOne({
      blogSlug: cleanSlug,
      email: cleanEmail,
      createdAt: { $gte: new Date(Date.now() - 30 * 1000) },
    });

    if (recentComment) {
      return res.status(429).json({
        success: false,
        message:
          "You are submitting too fast. Please wait a moment before posting another comment.",
      });
    }

    // Avatar initials
    const initials = cleanAuthor
      .split(/\s+/)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");

    // Create comment document
    const newComment = await BlogComment.create({
      blogId: targetBlogId,
      blogSlug: cleanSlug,
      blogTitle: targetTitle,
      author: cleanAuthor,
      email: cleanEmail,
      comment: cleanComment,
      rating: rating ? Math.min(5, Math.max(1, Number(rating))) : 5,
      status: "Draft", // Always created as Draft awaiting admin approval
      avatar: initials,
      date: new Date().toISOString().slice(0, 10),
    });

    // Increment commentsCount on the Blog model if blog exists
    if (targetBlogId) {
      await Blog.findByIdAndUpdate(targetBlogId, {
        $inc: { commentsCount: 1 },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Comment submitted successfully as draft and awaiting review!",
      data: newComment,
    });
  } catch (error) {
    console.error("Error in createComment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post comment",
      error: error.message,
    });
  }
};

// @desc    Update comment status (Approved, Pending, Rejected)
// @route   PUT /api/blog-comments/:id/status
// @access  Admin
const updateCommentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Draft", "Approved", "Pending", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Draft, Approved, Pending, or Rejected",
      });
    }

    const comment = await BlogComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.status = status;
    await comment.save();

    return res.status(200).json({
      success: true,
      message: `Comment status updated to "${status}" successfully`,
      data: comment,
    });
  } catch (error) {
    console.error("Error in updateCommentStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update comment status",
      error: error.message,
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/blog-comments/:id
// @access  Admin
const deleteComment = async (req, res) => {
  try {
    const comment = await BlogComment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const blogId = comment.blogId;
    await BlogComment.findByIdAndDelete(req.params.id);

    // Decrement commentsCount on Blog if blogId exists
    if (blogId) {
      await Blog.findByIdAndUpdate(blogId, {
        $inc: { commentsCount: -1 },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

module.exports = {
  getComments,
  getCommentsGroupedByBlog,
  createComment,
  updateCommentStatus,
  deleteComment,
};

