const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  getMe,
  updateProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  syncCart,
  syncWishlist,
  googleAuth,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

// Protected user routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/cart", protect, syncCart);
router.put("/wishlist", protect, syncWishlist);

// Protected address routes
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);
router.put("/addresses/:id/default", protect, setDefaultAddress);

module.exports = router;

