const AdminUser = require("../models/AdminUser");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.ACCESS_TOKEN_SECRET ||
  "art_and_culture_admin_secret_key_2026_xyz";

const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Helper: Generate Admin JWT
 */
const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      isAdmin: true,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

/**
 * Helper: Ensure default initial admin exists
 */
const ensureInitialAdmin = async () => {
  const existing = await AdminUser.findOne({ email: "art@culture.com" });
  if (!existing) {
    const count = await AdminUser.countDocuments();
    if (count === 0) {
      const defaultAdmin = new AdminUser({
        name: "Culture Administrator",
        email: "art@culture.com",
        username: "art",
        password: "art321",
        role: "Culture Administrator",
        status: "Active",
      });
      await defaultAdmin.save();
      console.log("[AdminAuth] Default admin initialized: art@culture.com / art321");
      return defaultAdmin;
    }
  }
  return null;
};

/**
 * @desc    Admin Login
 * @route   POST /api/admin/auth/login
 * @access  Public
 */
const adminLogin = async (req, res) => {
  try {
    const { email, username, identifier, password } = req.body;

    const loginId = (email || username || identifier || "").trim().toLowerCase();
    const loginPassword = (password || "").trim();

    if (!loginId || !loginPassword) {
      return res.status(400).json({
        success: false,
        message: "Please enter your admin email or username and password.",
      });
    }

    // Auto-seed default admin if table is empty
    await ensureInitialAdmin();

    // Query by email OR username
    const admin = await AdminUser.findOne({
      $or: [{ email: loginId }, { username: loginId }],
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials. Account not found.",
      });
    }

    // Check account status
    if (admin.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "This admin account has been deactivated. Please contact the administrator.",
      });
    }

    // Compare password
    const isMatch = await admin.comparePassword(loginPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials. Incorrect password.",
      });
    }

    // Record login timestamp
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    // Generate token
    const token = generateAdminToken(admin);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${admin.name}!`,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        avatar: admin.avatar,
        status: admin.status,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing admin login.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get Current Logged-in Admin Profile
 * @route   GET /api/admin/auth/me
 * @access  Private (Admin)
 */
const getAdminMe = async (req, res) => {
  try {
    const adminId = req.admin?.id || req.admin?._id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin session not found.",
      });
    }

    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        avatar: admin.avatar,
        phone: admin.phone || "",
        status: admin.status,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve admin profile.",
      error: error.message,
    });
  }
};

/**
 * @desc    Update Admin Profile
 * @route   PUT /api/admin/auth/profile
 * @access  Private (Admin)
 */
const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin?.id || req.admin?._id;
    const { name, email, phone, avatar, username } = req.body;

    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    if (email && email.toLowerCase() !== admin.email) {
      const emailExists = await AdminUser.findOne({
        email: email.toLowerCase(),
        _id: { $ne: adminId },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email address is already in use by another admin.",
        });
      }
      admin.email = email.toLowerCase().trim();
    }

    if (name) admin.name = name.trim();
    if (phone !== undefined) admin.phone = phone.trim();
    if (avatar !== undefined) admin.avatar = avatar;
    if (username) admin.username = username.toLowerCase().trim();

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        avatar: admin.avatar,
        phone: admin.phone,
        status: admin.status,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Update Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

/**
 * @desc    Change Admin Password
 * @route   PUT /api/admin/auth/change-password
 * @access  Private (Admin)
 */
const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.admin?.id || req.admin?._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current password and new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const admin = await AdminUser.findById(adminId).select("+password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
      error: error.message,
    });
  }
};

/**
 * @desc    Admin Logout
 * @route   POST /api/admin/auth/logout
 * @access  Public / Private
 */
const adminLogout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to log out.",
    });
  }
};

module.exports = {
  adminLogin,
  getAdminMe,
  updateAdminProfile,
  changeAdminPassword,
  adminLogout,
  ensureInitialAdmin,
};
