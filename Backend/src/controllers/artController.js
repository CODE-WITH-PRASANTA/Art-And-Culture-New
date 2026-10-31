const Art = require("../models/Art");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const artsUploadDir = path.resolve(__dirname, "../../uploads/arts");
if (!fs.existsSync(artsUploadDir)) {
  fs.mkdirSync(artsUploadDir, { recursive: true });
}

/**
 * Helper: Save base64 dataUrl to /uploads/arts/*.webp
 */
const saveBase64Image = async (dataUrl, prefix = "art") => {
  if (!dataUrl || typeof dataUrl !== "string") return "";
  if (!dataUrl.startsWith("data:image/")) {
    return dataUrl; // Already a URL or path
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches || matches.length < 3) return dataUrl;

    const buffer = Buffer.from(matches[2], "base64");
    const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const filepath = path.join(artsUploadDir, filename);

    await sharp(buffer)
      .webp({ quality: 85 })
      .toFile(filepath);

    return `/uploads/arts/${filename}`;
  } catch (err) {
    console.error("Error saving base64 image:", err);
    return dataUrl;
  }
};

/**
 * Generate next Art No (e.g. ART-0001, ART-0002)
 */
const generateNextArtNumber = async () => {
  const arts = await Art.find({}, { artNo: 1 }).lean();
  let highest = 0;
  for (const art of arts) {
    const match = String(art.artNo || "").match(/ART-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > highest) highest = num;
    }
  }
  return `ART-${String(highest + 1).padStart(4, "0")}`;
};

/**
 * @desc Get next available Art Number
 * @route GET /api/arts/next-number
 */
exports.getNextArtNumber = async (req, res) => {
  try {
    const nextArtNo = await generateNextArtNumber();
    res.json({
      success: true,
      nextArtNo,
    });
  } catch (error) {
    console.error("Error calculating next art number:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate art number",
      error: error.message,
    });
  }
};

/**
 * @desc Get all artworks with optional query filters
 * @route GET /api/arts
 */
exports.getArts = async (req, res) => {
  try {
    const { category, search, status, sort = "-createdAt" } = req.query;
    const filter = {};

    if (category && category !== "All" && category !== "All Categories") {
      filter.category = category;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (req.query.isStreamingCollection !== undefined) {
      filter.isStreamingCollection =
        req.query.isStreamingCollection === "true" ||
        req.query.isStreamingCollection === true;
    }

    if (req.query.isGeneralArtwork !== undefined) {
      const isGen =
        req.query.isGeneralArtwork === "true" ||
        req.query.isGeneralArtwork === true;
      if (isGen) {
        filter.isGeneralArtwork = { $ne: false };
      } else {
        filter.isGeneralArtwork = false;
      }
    }

    if (req.query.isPublished !== undefined) {
      const isPub =
        req.query.isPublished === "true" || req.query.isPublished === true;
      if (isPub) {
        filter.isPublished = { $ne: false };
        filter.status = { $ne: "Unpublished" };
      } else {
        filter.$or = [{ isPublished: false }, { status: "Unpublished" }];
      }
    }

    if (search && search.trim()) {
      const s = search.trim();
      const regex = new RegExp(s, "i");
      filter.$or = [
        { artNo: regex },
        { title: regex },
        { artistName: regex },
        { category: regex },
        { tags: regex },
      ];
    }

    const arts = await Art.find(filter).sort(sort).lean();

    res.json({
      success: true,
      count: arts.length,
      data: arts,
    });
  } catch (error) {
    console.error("Error fetching arts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch artworks",
      error: error.message,
    });
  }
};

/**
 * @desc Get single artwork by ID or ArtNo
 * @route GET /api/arts/:id
 */
exports.getArtById = async (req, res) => {
  try {
    const { id } = req.params;
    let art;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      art = await Art.findById(id);
    }
    if (!art) {
      art = await Art.findOne({ artNo: id });
    }
    if (!art) {
      const decoded = decodeURIComponent(id).trim();
      const slugTitle = decoded.replace(/-/g, " ");
      // Try exact title (case-insensitive) or slug title match
      art = await Art.findOne({
        $or: [
          { title: new RegExp(`^${decoded}$`, "i") },
          { title: new RegExp(`^${slugTitle}$`, "i") },
          { title: new RegExp(decoded, "i") },
        ],
      });
    }

    if (!art) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    res.json({
      success: true,
      data: art,
    });
  } catch (error) {
    console.error("Error fetching art by id:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch artwork",
      error: error.message,
    });
  }
};

/**
 * @desc Create new Artwork
 * @route POST /api/arts
 */
exports.createArt = async (req, res) => {
  try {
    const {
      artNo,
      title,
      description,
      category,
      artistName,
      price,
      discount,
      stockQuantity,
      tags,
      artistAbout,
      sizeOverview,
      framing,
      themeDetails,
      photos = [],
      signature,
      certificate,
      artType,
      isPublished,
      status,
    } = req.body;

    // Basic validation
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!category || !String(category).trim()) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }
    if (!artistName || !String(artistName).trim()) {
      return res.status(400).json({ success: false, message: "Artist name is required" });
    }
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Valid price is required" });
    }

    // Determine artNo
    let assignedArtNo = artNo && String(artNo).trim();
    if (!assignedArtNo) {
      assignedArtNo = await generateNextArtNumber();
    } else {
      const existing = await Art.findOne({ artNo: assignedArtNo });
      if (existing) {
        assignedArtNo = await generateNextArtNumber();
      }
    }

    // Process photos (convert base64 to files in /uploads/arts/)
    const processedPhotos = [];
    if (Array.isArray(photos)) {
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        if (!p) continue;
        const dataUrl = typeof p === "string" ? p : p.dataUrl || p.url || "";
        const savedUrl = await saveBase64Image(dataUrl, `art-${assignedArtNo}-${i + 1}`);

        processedPhotos.push({
          id: p.id || `photo-${Date.now()}-${i}`,
          name: p.name || `photo-${i + 1}.webp`,
          dataUrl: dataUrl.startsWith("data:") ? dataUrl : "", // keep or clear if large
          url: savedUrl,
        });
      }
    }

    // Process signature
    let processedSignature = null;
    if (signature && (signature.dataUrl || signature.url || typeof signature === "string")) {
      const sigData = typeof signature === "string" ? signature : signature.dataUrl || signature.url;
      const savedSigUrl = await saveBase64Image(sigData, `sig-${assignedArtNo}`);
      processedSignature = {
        name: signature.name || "signature.webp",
        dataUrl: typeof sigData === "string" && sigData.startsWith("data:") ? sigData : "",
        url: savedSigUrl,
      };
    }

    // Clean tags
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === "string") {
      processedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    const finalStatus =
      status !== undefined
        ? status
        : isPublished === false
        ? "Unpublished"
        : "Published";

    const finalPublished =
      isPublished !== undefined
        ? Boolean(isPublished)
        : finalStatus !== "Unpublished" && finalStatus !== "Draft";

    let finalGeneral = req.body.isGeneralArtwork;
    let finalStreaming = req.body.isStreamingCollection;

    if (finalGeneral === undefined && finalStreaming === undefined) {
      if (artType === "Streaming Collection") {
        finalGeneral = false;
        finalStreaming = true;
      } else {
        finalGeneral = true;
        finalStreaming = false;
      }
    } else {
      finalGeneral = finalGeneral !== undefined ? Boolean(finalGeneral) : true;
      finalStreaming = finalStreaming !== undefined ? Boolean(finalStreaming) : false;
    }

    const calculatedArtType =
      finalStreaming && finalGeneral
        ? "General & Streaming"
        : finalStreaming
        ? "Streaming Collection"
        : "General Artwork";

    const newArt = new Art({
      artNo: assignedArtNo,
      title: String(title).trim(),
      description: String(description || "").trim(),
      category: String(category).trim(),
      artistName: String(artistName).trim(),
      price: Number(price),
      discount: Number(discount || 0),
      stockQuantity: Number(stockQuantity !== undefined ? stockQuantity : 1),
      tags: processedTags,
      artistAbout: String(artistAbout || "").trim(),
      sizeOverview: String(sizeOverview || "").trim(),
      framing: framing === "Yes" ? "Yes" : "No",
      themeDetails: String(themeDetails || "").trim(),
      photos: processedPhotos,
      signature: processedSignature,
      certificate: certificate === "Yes" ? "Yes" : "No",
      isGeneralArtwork: finalGeneral,
      isStreamingCollection: finalStreaming,
      artType: calculatedArtType,
      isPublished: finalPublished,
      status: finalStatus,
    });

    const saved = await newArt.save();

    res.status(201).json({
      success: true,
      message: `${saved.artNo} created successfully`,
      data: saved,
    });
  } catch (error) {
    console.error("Error creating artwork:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create artwork",
      error: error.message,
    });
  }
};

/**
 * @desc Update existing Artwork
 * @route PUT /api/arts/:id
 */
exports.updateArt = async (req, res) => {
  try {
    const { id } = req.params;
    let art = await Art.findById(id);
    if (!art) {
      art = await Art.findOne({ artNo: id });
    }
    if (!art) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    const {
      title,
      description,
      category,
      artistName,
      price,
      discount,
      stockQuantity,
      tags,
      artistAbout,
      sizeOverview,
      framing,
      themeDetails,
      photos,
      signature,
      certificate,
      artType,
      isPublished,
      status,
    } = req.body;

    if (title !== undefined) art.title = String(title).trim();
    if (description !== undefined) art.description = String(description).trim();
    if (category !== undefined) art.category = String(category).trim();
    if (artistName !== undefined) art.artistName = String(artistName).trim();
    if (price !== undefined) art.price = Number(price);
    if (discount !== undefined) art.discount = Number(discount);
    if (stockQuantity !== undefined) art.stockQuantity = Number(stockQuantity);
    if (artistAbout !== undefined) art.artistAbout = String(artistAbout).trim();
    if (sizeOverview !== undefined) art.sizeOverview = String(sizeOverview).trim();
    if (framing !== undefined) art.framing = framing === "Yes" ? "Yes" : "No";
    if (themeDetails !== undefined) art.themeDetails = String(themeDetails).trim();
    if (req.body.isGeneralArtwork !== undefined) {
      art.isGeneralArtwork = Boolean(req.body.isGeneralArtwork);
    }
    if (req.body.isStreamingCollection !== undefined) {
      art.isStreamingCollection = Boolean(req.body.isStreamingCollection);
    }
    if (artType !== undefined) {
      art.artType = artType;
      if (req.body.isGeneralArtwork === undefined && req.body.isStreamingCollection === undefined) {
        if (artType === "Streaming Collection") {
          art.isGeneralArtwork = false;
          art.isStreamingCollection = true;
        } else if (artType === "General Artwork") {
          art.isGeneralArtwork = true;
          art.isStreamingCollection = false;
        } else if (artType === "General & Streaming") {
          art.isGeneralArtwork = true;
          art.isStreamingCollection = true;
        }
      }
    } else if (req.body.isGeneralArtwork !== undefined || req.body.isStreamingCollection !== undefined) {
      art.artType =
        art.isStreamingCollection && art.isGeneralArtwork
          ? "General & Streaming"
          : art.isStreamingCollection
          ? "Streaming Collection"
          : "General Artwork";
    }
    if (isPublished !== undefined) {
      art.isPublished = Boolean(isPublished);
      if (status === undefined) {
        art.status = art.isPublished ? "Published" : "Unpublished";
      }
    }
    if (status !== undefined) {
      art.status = status;
      if (isPublished === undefined) {
        art.isPublished = status === "Published" || status === "Available";
      }
    }

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        art.tags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        art.tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    // Process updated photos if provided
    if (Array.isArray(photos)) {
      const processedPhotos = [];
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        if (!p) continue;
        const dataUrl = typeof p === "string" ? p : p.dataUrl || p.url || "";
        const savedUrl = await saveBase64Image(dataUrl, `art-${art.artNo}-${i + 1}`);

        processedPhotos.push({
          id: p.id || `photo-${Date.now()}-${i}`,
          name: p.name || `photo-${i + 1}.webp`,
          dataUrl: dataUrl.startsWith("data:") ? dataUrl : "",
          url: savedUrl,
        });
      }
      art.photos = processedPhotos;
    }

    // Process updated signature if provided
    if (signature !== undefined) {
      if (!signature) {
        art.signature = null;
      } else {
        const sigData = typeof signature === "string" ? signature : signature.dataUrl || signature.url;
        const savedSigUrl = await saveBase64Image(sigData, `sig-${art.artNo}`);
        art.signature = {
          name: signature.name || "signature.webp",
          dataUrl: typeof sigData === "string" && sigData.startsWith("data:") ? sigData : "",
          url: savedSigUrl,
        };
      }
    }

    const updated = await art.save();

    res.json({
      success: true,
      message: "Artwork updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating artwork:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update artwork",
      error: error.message,
    });
  }
};

/**
 * @desc Delete Artwork
 * @route DELETE /api/arts/:id
 */
exports.deleteArt = async (req, res) => {
  try {
    const { id } = req.params;
    let art = await Art.findById(id);
    if (!art) {
      art = await Art.findOne({ artNo: id });
    }

    if (!art) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    // Optionally cleanup file uploads
    if (Array.isArray(art.photos)) {
      for (const p of art.photos) {
        if (p.url && p.url.startsWith("/uploads/arts/")) {
          const filePath = path.join(__dirname, "../..", p.url);
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (e) {}
          }
        }
      }
    }

    if (art.signature && art.signature.url && art.signature.url.startsWith("/uploads/arts/")) {
      const sigPath = path.join(__dirname, "../..", art.signature.url);
      if (fs.existsSync(sigPath)) {
        try {
          fs.unlinkSync(sigPath);
        } catch (e) {}
      }
    }

    await art.deleteOne();

    res.json({
      success: true,
      message: "Artwork deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete artwork",
      error: error.message,
    });
  }
};
