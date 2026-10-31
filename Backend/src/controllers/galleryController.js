const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = new RegExp(category, "i");
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "oldest") sortOptions = { createdAt: 1 };
    if (sort === "az") sortOptions = { title: 1 };
    if (sort === "za") sortOptions = { title: -1 };

    const items = await Gallery.find(filter).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Error in getGalleryItems:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery items",
      error: error.message,
    });
  }
};

// @desc    Get single gallery item by ID
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Error in getGalleryById:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch gallery item",
      error: error.message,
    });
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Public / Admin
const createGalleryItem = async (req, res) => {
  try {
    const { title, description, category, photo } = req.body;

    const trimmedTitle = (title || "").trim();
    if (!trimmedTitle) {
      return res.status(400).json({
        success: false,
        message: "Gallery title is required",
      });
    }

    let photoUrl = "";
    if (req.file) {
      photoUrl = `/uploads/gallery/${req.file.filename}`;
    } else if (photo) {
      photoUrl = photo.trim();
    }

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file or provide a photo URL",
      });
    }

    const newItem = await Gallery.create({
      title: trimmedTitle,
      description: (description || "").trim(),
      category: (category || "General").trim(),
      photo: photoUrl,
      date: new Date().toISOString().split("T")[0],
    });

    return res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: newItem,
    });
  } catch (error) {
    console.error("Error in createGalleryItem:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create gallery item",
      error: error.message,
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Public / Admin
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, photo } = req.body;

    const existingItem = await Gallery.findById(id);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (category !== undefined) updates.category = category.trim();

    if (req.file) {
      // Remove previous local uploaded file if exists
      if (existingItem.photo && existingItem.photo.startsWith("/uploads/")) {
        const oldPath = path.resolve(__dirname, "../../", existingItem.photo.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.warn("Could not delete old upload file:", e.message);
          }
        }
      }
      updates.photo = `/uploads/gallery/${req.file.filename}`;
    } else if (photo) {
      updates.photo = photo.trim();
    }

    const updatedItem = await Gallery.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error in updateGalleryItem:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update gallery item",
      error: error.message,
    });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Public / Admin
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    // Delete local upload file if exists
    if (item.photo && item.photo.startsWith("/uploads/")) {
      const filePath = path.resolve(__dirname, "../../", item.photo.replace(/^\//, ""));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("Could not delete file from disk:", e.message);
        }
      }
    }

    await Gallery.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error in deleteGalleryItem:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
      error: error.message,
    });
  }
};

module.exports = {
  getGalleryItems,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
