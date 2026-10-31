const Feedback = require("../models/Feedback");

// @desc    Get all feedbacks with optional status & search filtering
// @route   GET /api/feedback
// @access  Public / Admin
const getFeedbacks = async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { title: regex },
        { comment: regex },
      ];
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });

    // Calculate count breakdown
    const [totalCount, draftCount, approvedCount, rejectedCount] = await Promise.all([
      Feedback.countDocuments({}),
      Feedback.countDocuments({ status: "Draft" }),
      Feedback.countDocuments({ status: "Approved" }),
      Feedback.countDocuments({ status: "Rejected" }),
    ]);

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      stats: {
        total: totalCount,
        draft: draftCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      data: feedbacks,
    });
  } catch (error) {
    console.error("Error in getFeedbacks:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    });
  }
};

// @desc    Get a single feedback by ID
// @route   GET /api/feedback/:id
// @access  Public / Admin
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error("Error in getFeedbackById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

// @desc    Create a new customer feedback (defaults to Draft)
// @route   POST /api/feedback
// @access  Public
const createFeedback = async (req, res) => {
  try {
    const { name, email, title, comment, rating, avatar } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback comment is required",
      });
    }

    const parsedRating = Number(rating);
    const validRating = !isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5 ? parsedRating : 5;

    const newFeedback = new Feedback({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      title: title && title.trim() ? title.trim() : "Beautiful Art Collection!",
      comment: comment.trim(),
      rating: validRating,
      status: "Draft", // Always saved as Draft for admin review
      avatar: avatar && typeof avatar === "string" ? avatar.trim() : "",
      date: new Date().toISOString().slice(0, 10),
    });

    const savedFeedback = await newFeedback.save();

    return res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been received.",
      data: savedFeedback,
    });
  } catch (error) {
    console.error("Error in createFeedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};

// @desc    Update feedback status (Draft, Approved, Rejected)
// @route   PUT /api/feedback/:id/status
// @access  Admin
const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Draft", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: Draft, Approved, Rejected",
      });
    }

    const updated = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Feedback marked as ${status} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateFeedbackStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update feedback status",
      error: error.message,
    });
  }
};

// @desc    Delete a feedback
// @route   DELETE /api/feedback/:id
// @access  Admin
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
      data: { id: deleted._id },
    });
  } catch (error) {
    console.error("Error in deleteFeedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};

module.exports = {
  getFeedbacks,
  getFeedbackById,
  createFeedback,
  updateFeedbackStatus,
  deleteFeedback,
};

