const express = require("express");
const router = express.Router();
const {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} = require("../controllers/feedbackController");

// Public / Admin routes
router.get("/", getFeedbacks);
router.get("/:id", getFeedbackById);
router.post("/", createFeedback);

// Status update and deletion
router.put("/:id/status", updateFeedbackStatus);
router.patch("/:id/status", updateFeedbackStatus);
router.delete("/:id", deleteFeedback);

module.exports = router;

