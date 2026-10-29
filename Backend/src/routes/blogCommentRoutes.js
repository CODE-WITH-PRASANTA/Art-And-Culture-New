const express = require("express");
const router = express.Router();
const {
  getComments,
  getCommentsGroupedByBlog,
  createComment,
  updateCommentStatus,
  deleteComment,
} = require("../controllers/blogCommentController");

// Grouped view for admin: "show each blog and its comment"
router.get("/by-blog", getCommentsGroupedByBlog);

// Standard endpoints
router.route("/")
  .get(getComments)
  .post(createComment);

router.route("/:id")
  .delete(deleteComment);

router.put("/:id/status", updateCommentStatus);

module.exports = router;

