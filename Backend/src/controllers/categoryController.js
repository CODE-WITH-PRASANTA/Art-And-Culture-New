const Category = require("../models/Category");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};

    if (search) {
      filter.name = new RegExp(search.trim(), "i");
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error in getCategories:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const trimmedName = (name || "").trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Please enter a category name.",
      });
    }

    // Check case-insensitive duplicate
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category '${trimmedName}' already exists. Please choose a different name.`,
      });
    }

    const newCategory = await Category.create({
      name: trimmedName,
      description: (description || "").trim(),
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Category created and saved to database successfully.",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updates = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty.",
        });
      }

      // Check if duplicate belongs to another category
      const duplicate = await Category.findOne({
        name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Category '${trimmedName}' already exists.`,
        });
      }

      updates.name = trimmedName;
    }

    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;

    const updated = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully from database.",
      id,
    });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
