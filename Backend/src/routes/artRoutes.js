const express = require("express");
const router = express.Router();
const {
  getArts,
  getNextArtNumber,
  getArtById,
  createArt,
  updateArt,
  deleteArt,
} = require("../controllers/artController");

// /api/arts
router.route("/").get(getArts).post(createArt);

// /api/arts/next-number
router.route("/next-number").get(getNextArtNumber);

// /api/arts/:id
router.route("/:id").get(getArtById).put(updateArt).delete(deleteArt);

module.exports = router;
