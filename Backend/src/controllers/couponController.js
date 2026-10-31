const Coupon = require("../models/Coupon");

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Public
const getCoupons = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { code: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    if (status === "active") {
      filter.disabled = { $ne: true };
    }

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    console.error("Error in getCoupons:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error.message,
    });
  }
};

// @desc    Get single coupon by ID
// @route   GET /api/coupons/:id
// @access  Public
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("Error in getCouponById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupon",
      error: error.message,
    });
  }
};

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      start,
      end,
      minimum,
      limit,
      description,
      disabled,
      used,
    } = req.body;

    const trimmedCode = (code || "").trim().toUpperCase();

    if (!trimmedCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (value === undefined || value === null || Number(value) <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid positive discount value is required",
      });
    }

    // Check if code already exists
    const existing = await Coupon.findOne({ code: trimmedCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon code '${trimmedCode}' already exists. Please use a different code.`,
      });
    }

    if (start && end && end < start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after the start date",
      });
    }

    const newCoupon = await Coupon.create({
      code: trimmedCode,
      type: type || "Percentage (%)",
      value: Number(value),
      start: start || new Date().toISOString().slice(0, 10),
      end: end || "",
      minimum: Number(minimum) || 0,
      limit: Number(limit) || 0,
      used: Number(used) || 0,
      description: (description || "").trim(),
      disabled: Boolean(disabled),
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created and saved into database successfully",
      data: newCoupon,
    });
  } catch (error) {
    console.error("Error in createCoupon:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      type,
      value,
      start,
      end,
      minimum,
      limit,
      description,
      disabled,
      used,
    } = req.body;

    const existingCoupon = await Coupon.findById(id);
    if (!existingCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const updates = {};

    if (code !== undefined) {
      const trimmedCode = code.trim().toUpperCase();
      if (!trimmedCode) {
        return res.status(400).json({
          success: false,
          message: "Coupon code cannot be empty",
        });
      }

      // Check if duplicate code belongs to another coupon
      const duplicate = await Coupon.findOne({
        code: trimmedCode,
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Coupon code '${trimmedCode}' already exists on another coupon.`,
        });
      }
      updates.code = trimmedCode;
    }

    if (type !== undefined) updates.type = type;
    if (value !== undefined) {
      if (Number(value) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Discount value must be greater than zero",
        });
      }
      updates.value = Number(value);
    }
    if (start !== undefined) updates.start = start;
    if (end !== undefined) updates.end = end;
    if (minimum !== undefined) updates.minimum = Number(minimum) || 0;
    if (limit !== undefined) updates.limit = Number(limit) || 0;
    if (used !== undefined) updates.used = Number(used) || 0;
    if (description !== undefined) updates.description = description.trim();
    if (disabled !== undefined) updates.disabled = Boolean(disabled);

    const updated = await Coupon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully in database",
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateCoupon:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

// @desc    Toggle coupon active/disabled status
// @route   PATCH /api/coupons/:id/toggle
// @access  Admin
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.disabled = !coupon.disabled;
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.disabled ? "disabled" : "enabled"} successfully`,
      data: coupon,
    });
  } catch (error) {
    console.error("Error in toggleCouponStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle coupon status",
      error: error.message,
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully from database",
      id,
    });
  } catch (error) {
    console.error("Error in deleteCoupon:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
      error: error.message,
    });
  }
};

// @desc    Validate and apply coupon to cart
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    const cleanCode = (code || "").trim().toUpperCase();

    if (!cleanCode) {
      return res.status(400).json({
        success: false,
        message: "Please enter a coupon code.",
      });
    }

    const coupon = await Coupon.findOne({ code: cleanCode });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: `Coupon code '${cleanCode}' is invalid or does not exist.`,
      });
    }

    if (coupon.disabled) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' is currently deactivated.`,
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (coupon.start && coupon.start > today) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' will be active starting ${coupon.start}.`,
      });
    }

    if (coupon.end && coupon.end < today) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' expired on ${coupon.end}.`,
      });
    }

    if (Number(coupon.limit) > 0 && Number(coupon.used) >= Number(coupon.limit)) {
      return res.status(400).json({
        success: false,
        message: `Coupon '${cleanCode}' maximum usage limit has been reached.`,
      });
    }

    const subtotal = Number(cartTotal) || 0;
    if (Number(coupon.minimum) > 0 && subtotal < Number(coupon.minimum)) {
      const shortfall = Number(coupon.minimum) - subtotal;
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minimum.toLocaleString("en-IN")} required. Add ₹${shortfall.toLocaleString("en-IN")} more to use this coupon.`,
        minimum: coupon.minimum,
        shortfall,
      });
    }

    let discount = 0;
    if (coupon.type === "Percentage (%)") {
      discount = Math.round((subtotal * Number(coupon.value)) / 100);
    } else {
      discount = Math.min(Number(coupon.value), subtotal);
    }

    discount = Math.max(0, Math.min(discount, subtotal));
    const finalTotal = Math.max(0, subtotal - discount);

    return res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully! You saved ₹${discount.toLocaleString("en-IN")}.`,
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
        minimum: coupon.minimum,
      },
      discount,
      finalTotal,
    });
  } catch (error) {
    console.error("Error in validateCoupon:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to validate coupon.",
      error: error.message,
    });
  }
};

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
};
