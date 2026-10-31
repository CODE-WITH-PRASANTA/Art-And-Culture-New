const express = require("express");
const router = express.Router();
const {
  getCourseEnquiries,
  createCourseEnquiry,
  updateCourseEnquiryStatus,
  deleteCourseEnquiry,
} = require("../controllers/courseEnquiryController");

// Public submit & Admin list
router.get("/", getCourseEnquiries);
router.post("/", createCourseEnquiry);

// Admin status update & delete
router.put("/:id/status", updateCourseEnquiryStatus);
router.patch("/:id/status", updateCourseEnquiryStatus);
router.delete("/:id", deleteCourseEnquiry);

module.exports = router;

