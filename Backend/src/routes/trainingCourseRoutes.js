const express = require("express");
const router = express.Router();
const {
  getTrainingCourses,
  getTrainingCourseById,
  createTrainingCourse,
  updateTrainingCourse,
  toggleCourseStatus,
  deleteTrainingCourse,
} = require("../controllers/trainingCourseController");

// Public / Admin endpoints
router.get("/", getTrainingCourses);
router.get("/:id", getTrainingCourseById);

// Admin mutations
router.post("/", createTrainingCourse);
router.put("/:id", updateTrainingCourse);
router.patch("/:id/status", toggleCourseStatus);
router.delete("/:id", deleteTrainingCourse);

module.exports = router;

