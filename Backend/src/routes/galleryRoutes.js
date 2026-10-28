const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middleware/multer");
const {
  getGalleryItems,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");

// /api/gallery
router
  .route("/")
  .get(getGalleryItems)
  .post(upload.single("photo"), convertToWebp, createGalleryItem);

// /api/gallery/:id
router
  .route("/:id")
  .get(getGalleryById)
  .put(upload.single("photo"), convertToWebp, updateGalleryItem)
  .delete(deleteGalleryItem);

module.exports = router;
