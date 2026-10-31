const Enquiry = require("../models/Enquiry");

// @desc    Get all enquiries with optional filter and search
// @route   GET /api/enquiries
// @access  Public / Admin
const getEnquiries = async (req, res) => {
  try {
    const { search, status, category, priority } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (priority && priority !== "All") {
      filter.priority = priority;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error in getEnquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Public / Admin
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error("Error in getEnquiryById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry",
      error: error.message,
    });
  }
};

// @desc    Create new contact enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      category,
      message,
      priority,
      source,
      assignedTo,
      followUpDate,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email.",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a subject.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your message.",
      });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      subject: subject.trim(),
      category: category ? category.trim() : "General Inquiry",
      message: message.trim(),
      status: "New",
      priority: priority || "Medium",
      source: source || "Website",
      date: new Date().toISOString().slice(0, 10),
      followUpDate: followUpDate || "",
      assignedTo: assignedTo || "Admin",
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully!",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error in createEnquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry.",
      error: error.message,
    });
  }
};

// @desc    Update enquiry details (status, notes, follow-up, etc.)
// @route   PUT /api/enquiries/:id
// @access  Admin
const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "subject",
      "category",
      "message",
      "status",
      "priority",
      "source",
      "date",
      "followUpDate",
      "assignedTo",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        enquiry[field] = req.body[field];
      }
    });

    const updated = await enquiry.save();

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully!",
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateEnquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
      error: error.message,
    });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await Enquiry.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleteEnquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: error.message,
    });
  }
};

module.exports = {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
};

