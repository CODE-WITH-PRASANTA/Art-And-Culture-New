const User = require("../models/User");
const Order = require("../models/Order");

/**
 * @desc    Get all users with order count and total spend
 * @route   GET /api/users
 * @access  Public / Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // Fetch all confirmed orders to calculate user stats
    const orders = await Order.find().select("user customer totalAmount status createdAt");

    const formattedUsers = users.map((u) => {
      // Find orders matching this user ID or email
      const userOrders = orders.filter((o) => {
        const matchesId = o.user && o.user.toString() === u._id.toString();
        const matchesEmail =
          o.customer?.email &&
          o.customer.email.toLowerCase() === (u.email || "").toLowerCase();
        return matchesId || matchesEmail;
      });

      const totalSpent = userOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

      const roleDisplay =
        u.role === "admin" || u.role === "Admin"
          ? "Admin"
          : u.role === "artist" || u.role === "Artist"
          ? "Artist"
          : "Customer";

      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || "Collector";

      return {
        id: u._id.toString(),
        _id: u._id.toString(),
        name: fullName,
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phone: u.phone || "—",
        role: roleDisplay,
        status: u.status || "Active",
        joined: u.createdAt
          ? new Date(u.createdAt).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        orders: userOrders.length,
        spent: totalSpent,
        avatar: u.avatar || "",
        addresses: u.addresses || [],
      };
    });

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new user (from Admin Panel)
 * @route   POST /api/users
 * @access  Admin
 */
exports.createUser = async (req, res) => {
  try {
    const { name, firstName, lastName, email, phone, role, status, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A user with this email address already exists",
      });
    }

    let fName = firstName;
    let lName = lastName;

    if (!fName && name) {
      const parts = name.trim().split(/\s+/);
      fName = parts[0] || "User";
      lName = parts.slice(1).join(" ") || "Collector";
    }

    if (!fName) fName = "User";
    if (!lName) lName = "Collector";

    let roleVal = "user";
    if (role) {
      const r = role.toLowerCase();
      if (r === "admin") roleVal = "admin";
      else if (r === "artist") roleVal = "artist";
      else roleVal = "user";
    }

    const newUser = await User.create({
      firstName: fName,
      lastName: lName,
      email: normalizedEmail,
      phone: phone ? phone.trim() : "",
      role: roleVal,
      status: status || "Active",
      password: password || "123456",
    });

    const roleDisplay =
      newUser.role === "admin"
        ? "Admin"
        : newUser.role === "artist"
        ? "Artist"
        : "Customer";

    const formatted = {
      id: newUser._id.toString(),
      _id: newUser._id.toString(),
      name: `${newUser.firstName} ${newUser.lastName}`.trim(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone || "—",
      role: roleDisplay,
      status: newUser.status || "Active",
      joined: new Date().toISOString().slice(0, 10),
      orders: 0,
      spent: 0,
      avatar: newUser.avatar || "",
      addresses: [],
    };

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: formatted,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create user",
    });
  }
};

/**
 * @desc    Update a user
 * @route   PUT /api/users/:id
 * @access  Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, firstName, lastName, email, phone, role, status, password } = req.body;

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== user.email) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Email is already taken by another user",
          });
        }
        user.email = normalizedEmail;
      }
    }

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();

    if (name && !firstName) {
      const parts = name.trim().split(/\s+/);
      user.firstName = parts[0] || user.firstName;
      user.lastName = parts.slice(1).join(" ") || user.lastName;
    }

    if (phone !== undefined) user.phone = phone ? phone.trim() : "";
    if (status) user.status = status;
    if (role) {
      const r = role.toLowerCase();
      user.role = r === "admin" ? "admin" : r === "artist" ? "artist" : "user";
    }

    if (password && password.trim().length >= 6) {
      user.password = password;
    }

    await user.save();

    const roleDisplay =
      user.role === "admin"
        ? "Admin"
        : user.role === "artist"
        ? "Artist"
        : "Customer";

    const formatted = {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "—",
      role: roleDisplay,
      status: user.status || "Active",
      joined: user.createdAt
        ? new Date(user.createdAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      avatar: user.avatar || "",
      addresses: user.addresses || [],
    };

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: formatted,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

