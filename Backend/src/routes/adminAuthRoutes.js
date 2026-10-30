const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAdminMe,
  updateAdminProfile,
  changeAdminPassword,
  adminLogout,
} = require("../controllers/adminAuthController");
const { protectAdmin } = require("../middleware/adminAuth");

// Public admin authentication
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// Protected admin details and profile updates
router.get("/me", protectAdmin, getAdminMe);
router.put("/profile", protectAdmin, updateAdminProfile);
router.put("/change-password", protectAdmin, changeAdminPassword);

module.exports = router;
