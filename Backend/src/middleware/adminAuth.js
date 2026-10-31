const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.ACCESS_TOKEN_SECRET ||
  "art_and_culture_admin_secret_key_2026_xyz";

/**
 * Protect routes for Admin users only
 */
const protectAdmin = async (req, res, next) => {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Admin authorization token required.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await AdminUser.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account does not exist or has been removed.",
      });
    }

    if (admin.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive. Please contact the system administrator.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin session token.",
    });
  }
};

module.exports = { protectAdmin };

