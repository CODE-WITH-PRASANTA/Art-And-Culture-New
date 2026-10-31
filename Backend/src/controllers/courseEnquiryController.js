const CourseEnquiry = require("../models/CourseEnquiry");

// @desc    Get all course enquiries with filters & stats
// @route   GET /api/course-enquiries
// @access  Admin
const getCourseEnquiries = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const { status, search, courseId } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (courseId) {
      filter.courseId = courseId;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { courseName: regex },
        { location: regex },
      ];
    }

    const enquiries = await CourseEnquiry.find(filter).sort({ createdAt: -1 });

    const [totalCount, newCount, contactedCount, enrolledCount, closedCount] =
      await Promise.all([
        CourseEnquiry.countDocuments({}),
        CourseEnquiry.countDocuments({ status: "New" }),
        CourseEnquiry.countDocuments({ status: "Contacted" }),
        CourseEnquiry.countDocuments({ status: "Enrolled" }),
        CourseEnquiry.countDocuments({ status: "Closed" }),
      ]);

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      stats: {
        total: totalCount,
        new: newCount,
        contacted: contactedCount,
        enrolled: enrolledCount,
        closed: closedCount,
      },
      data: enquiries,
    });
  } catch (error) {
    console.error("Error in getCourseEnquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course enquiries",
      error: error.message,
    });
  }
};

// @desc    Create a new course enquiry from frontend
// @route   POST /api/course-enquiries
// @access  Public
const createCourseEnquiry = async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      courseFee,
      name,
      age,
      experience,
      location,
      phone,
      email,
      message,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }

    if (!age || isNaN(Number(age))) {
      return res.status(400).json({ success: false, message: "Age is required" });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, message: "Current location is required" });
    }

    const newEnquiry = new CourseEnquiry({
      courseId: courseId || null,
      courseName: courseName && courseName.trim() ? courseName.trim() : "Art Course",
      courseFee: courseFee ? Number(courseFee) : 0,
      name: name.trim(),
      age: Number(age),
      experience: experience === "Yes" ? "Yes" : "No",
      location: location.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      message: message ? message.trim() : "",
      status: "New",
      date: new Date().toISOString().slice(0, 10),
    });

    const savedEnquiry = await newEnquiry.save();

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully! Our admissions team will contact you shortly.",
      data: savedEnquiry,
    });
  } catch (error) {
    console.error("Error in createCourseEnquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit course enquiry",
      error: error.message,
    });
  }
};

// @desc    Update course enquiry status
// @route   PUT /api/course-enquiries/:id/status
// @access  Admin
const updateCourseEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["New", "Contacted", "Enrolled", "Closed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid enquiry status" });
    }

    const updated = await CourseEnquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateCourseEnquiryStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update enquiry status",
      error: error.message,
    });
  }
};

// @desc    Delete a course enquiry
// @route   DELETE /api/course-enquiries/:id
// @access  Admin
const deleteCourseEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CourseEnquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
      data: { id: deleted._id },
    });
  } catch (error) {
    console.error("Error in deleteCourseEnquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: error.message,
    });
  }
};

module.exports = {
  getCourseEnquiries,
  createCourseEnquiry,
  updateCourseEnquiryStatus,
  deleteCourseEnquiry,
};

