const TrainingCourse = require("../models/TrainingCourse");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const coursesUploadDir = path.resolve(__dirname, "../../uploads/courses");
if (!fs.existsSync(coursesUploadDir)) {
  fs.mkdirSync(coursesUploadDir, { recursive: true });
}

/**
 * Helper: Save base64 dataUrl to /uploads/courses/*.webp
 */
const saveCourseImage = async (dataUrl, prefix = "course") => {
  if (!dataUrl || typeof dataUrl !== "string") return "";
  if (!dataUrl.startsWith("data:image/")) {
    return dataUrl; // Already a URL or path
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches || matches.length < 3) return dataUrl;

    const buffer = Buffer.from(matches[2], "base64");
    const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const filepath = path.join(coursesUploadDir, filename);

    await sharp(buffer)
      .webp({ quality: 85 })
      .toFile(filepath);

    return `/uploads/courses/${filename}`;
  } catch (err) {
    console.error("Error saving course image:", err);
    return dataUrl;
  }
};

// @desc    Get all training courses
// @route   GET /api/training-courses
// @access  Public / Admin
const getTrainingCourses = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const { status, mode, category, featured, search } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (mode && mode !== "All") {
      filter.mode = mode;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (featured !== undefined && featured !== "All") {
      filter.featured = featured === "true" || featured === true;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { category: regex },
        { instructor: regex },
      ];
    }

    const courses = await TrainingCourse.find(filter).sort({ createdAt: -1 });

    const [totalCount, activeCount, draftCount, onlineCount, offlineCount] =
      await Promise.all([
        TrainingCourse.countDocuments({}),
        TrainingCourse.countDocuments({ status: "Active" }),
        TrainingCourse.countDocuments({ status: "Draft" }),
        TrainingCourse.countDocuments({ mode: "Online" }),
        TrainingCourse.countDocuments({ mode: "Offline" }),
      ]);

    return res.status(200).json({
      success: true,
      count: courses.length,
      stats: {
        total: totalCount,
        active: activeCount,
        draft: draftCount,
        online: onlineCount,
        offline: offlineCount,
      },
      data: courses,
    });
  } catch (error) {
    console.error("Error in getTrainingCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch training courses",
      error: error.message,
    });
  }
};

// @desc    Get single training course by ID
// @route   GET /api/training-courses/:id
// @access  Public / Admin
const getTrainingCourseById = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error in getTrainingCourseById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
      error: error.message,
    });
  }
};

// @desc    Create a new training course
// @route   POST /api/training-courses
// @access  Admin
const createTrainingCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      mode,
      courseFee,
      discountFee,
      image,
      category,
      level,
      duration,
      instructor,
      batchSize,
      featured,
      status,
      highlights,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Course title is required" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: "Course description is required" });
    }

    if (courseFee === undefined || courseFee === null || isNaN(Number(courseFee))) {
      return res.status(400).json({ success: false, message: "Valid course fee is required" });
    }

    const savedImg = await saveCourseImage(image, "course");

    const newCourse = new TrainingCourse({
      title: title.trim(),
      description: description.trim(),
      location: location && location.trim() ? location.trim() : (mode === "Online" ? "Online" : "India"),
      mode: mode || "Offline",
      courseFee: Number(courseFee),
      discountFee: discountFee !== undefined && !isNaN(Number(discountFee)) ? Number(discountFee) : Number(courseFee),
      image: savedImg || "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      category: category && category.trim() ? category.trim() : "Painting",
      level: level && level.trim() ? level.trim() : "All Levels",
      duration: duration && duration.trim() ? duration.trim() : "4 Weeks",
      instructor: instructor && instructor.trim() ? instructor.trim() : "Master Artisan",
      batchSize: batchSize && batchSize.trim() ? batchSize.trim() : "15 Students",
      featured: featured !== undefined ? Boolean(featured) : true,
      status: status || "Active",
      highlights: Array.isArray(highlights) && highlights.length > 0 ? highlights : ["All skill levels", "Practical learning", "Certification"],
    });

    const savedCourse = await newCourse.save();

    return res.status(201).json({
      success: true,
      message: "Training course posted successfully!",
      data: savedCourse,
    });
  } catch (error) {
    console.error("Error in createTrainingCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create training course",
      error: error.message,
    });
  }
};

// @desc    Update a training course
// @route   PUT /api/training-courses/:id
// @access  Admin
const updateTrainingCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (updateData.image && updateData.image.startsWith("data:image/")) {
      updateData.image = await saveCourseImage(updateData.image, "course");
    }

    if (updateData.courseFee !== undefined) {
      updateData.courseFee = Number(updateData.courseFee);
    }
    if (updateData.discountFee !== undefined) {
      updateData.discountFee = Number(updateData.discountFee);
    }

    const updated = await TrainingCourse.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully!",
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateTrainingCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// @desc    Toggle course status (Active / Draft / Inactive)
// @route   PATCH /api/training-courses/:id/status
// @access  Admin
const toggleCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive", "Draft"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updated = await TrainingCourse.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Course status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("Error in toggleCourseStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course status",
      error: error.message,
    });
  }
};

// @desc    Delete a training course
// @route   DELETE /api/training-courses/:id
// @access  Admin
const deleteTrainingCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TrainingCourse.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: { id: deleted._id },
    });
  } catch (error) {
    console.error("Error in deleteTrainingCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

module.exports = {
  getTrainingCourses,
  getTrainingCourseById,
  createTrainingCourse,
  updateTrainingCourse,
  toggleCourseStatus,
  deleteTrainingCourse,
};

