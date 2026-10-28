const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Upload directories
const baseUploadDir = path.resolve(__dirname, "../../uploads");
const galleryUploadDir = path.join(baseUploadDir, "gallery");

// Ensure directories exist
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}
if (!fs.existsSync(galleryUploadDir)) {
  fs.mkdirSync(galleryUploadDir, { recursive: true });
}

// Memory storage so sharp can process the image before saving
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMime = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ];
  if (allowedMime.includes(file.mimetype) || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format. Only image files (JPG, PNG, WEBP, etc.) are allowed."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter,
});

/**
 * Middleware: Convert uploaded image (req.file) into WebP format and save to /uploads/gallery
 */
const convertToWebp = async (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next();
  }

  try {
    const ext = path.extname(req.file.originalname);
    const cleanBase = path
      .basename(req.file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();

    const uniqueName = `${cleanBase || "gallery"}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const outputPath = path.join(galleryUploadDir, uniqueName);

    // Convert to webp with high quality and compression
    await sharp(req.file.buffer)
      .webp({ quality: 82 })
      .toFile(outputPath);

    // Update req.file properties with the gallery subfolder info
    req.file.filename = uniqueName;
    req.file.path = outputPath;
    req.file.destination = galleryUploadDir;
    req.file.subfolder = "gallery";
    req.file.mimetype = "image/webp";

    next();
  } catch (error) {
    console.error("Error converting image to WebP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process and convert image to WebP",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  convertToWebp,
  galleryUploadDir,
};
