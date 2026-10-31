const express = require("express");
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogBySlugOrId,
  updateBlog,
  deleteBlog,
  getNextBlogCode,
} = require("../controllers/blogController");

// /api/blogs/next-code
router.get("/next-code", getNextBlogCode);

// /api/blogs
router.route("/").get(getBlogs).post(createBlog);

// /api/blogs/:slugOrId
router
  .route("/:slugOrId")
  .get(getBlogBySlugOrId)
  .put(updateBlog)
  .delete(deleteBlog);

module.exports = router;

