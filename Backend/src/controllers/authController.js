const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");
const { sendOtpEmail } = require("../utils/sendEmail");

/**
 * Format user payload for client
 */
const formatUser = (user) => ({
  id: user._id,
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  location: user.location || "",
  phone: user.phone || "",
  role: user.role || "user",
  avatar: user.avatar || "",
  addresses: user.addresses || [],
  cart: user.cart || [],
  wishlist: user.wishlist || [],
  createdAt: user.createdAt,
});

/**
 * @desc Register user
 * @route POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, location, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide first name, last name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please sign in.",
      });
    }

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password,
      location: (location || "").trim(),
      phone: (phone || "").trim(),
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Send cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: formatUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register account",
    });
  }
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email with password
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password +refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please create an account.",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again or reset it.",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: formatUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to sign in",
    });
  }
};

/**
 * @desc Refresh access token
 * @route POST /api/auth/refresh-token
 */
exports.refreshToken = async (req, res) => {
  try {
    const token =
      req.body.refreshToken || (req.cookies && req.cookies.refreshToken);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided. Please sign in again.",
      });
    }

    // Verify token signature
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired. Please sign in again.",
      });
    }

    // Find user
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify stored refresh token matches
    if (user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token has been revoked. Please sign in again.",
      });
    }

    // Issue new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("RefreshToken Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to refresh token",
    });
  }
};

/**
 * @desc Get current authenticated user
 * @route GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch profile",
    });
  }
};

/**
 * @desc Update user profile
 * @route PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { firstName, lastName, location, phone, email } = req.body;
    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (location !== undefined) user.location = location.trim();
    if (phone !== undefined) user.phone = phone.trim();

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "An account with this email address already exists.",
          });
        }
        user.email = normalizedEmail;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

/**
 * @desc Forgot password - generate 6-digit code
 * @route POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "We could not find an account with this email. Check the address or create an account.",
      });
    }

    // Generate 6 digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    user.resetPasswordCode = code;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send real email via Gmail SMTP
    try {
      await sendOtpEmail({
        to: user.email,
        code,
        name: user.firstName,
      });
      console.log(`[SMTP] Verification email sent successfully to ${user.email}`);
    } catch (mailErr) {
      console.error("[SMTP] Failed to send email:", mailErr.message);
    }

    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}. Please check your email inbox.`,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process forgot password request",
    });
  }
};

/**
 * @desc Verify 6-digit OTP code
 * @route POST /api/auth/verify-otp
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and the 6-digit verification code",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+resetPasswordCode +resetPasswordExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    if (!user.resetPasswordCode || user.resetPasswordCode !== String(code).trim()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code. Please check and try again.",
      });
    }

    if (user.resetPasswordExpire && Date.now() > new Date(user.resetPasswordExpire).getTime()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code verified successfully!",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify code",
    });
  }
};

/**
 * @desc Reset password with code
 * @route POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, verification code, and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+resetPasswordCode +resetPasswordExpire +password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (!user.resetPasswordCode || user.resetPasswordCode !== String(code).trim()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code. Please check and try again.",
      });
    }

    if (user.resetPasswordExpire && Date.now() > new Date(user.resetPasswordExpire).getTime()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    const token =
      req.body.refreshToken || (req.cookies && req.cookies.refreshToken);

    if (token) {
      try {
        const decoded = verifyRefreshToken(token);
        await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
      } catch {
        // Continue even if token is already expired
      }
    }

    res.clearCookie("refreshToken");
    res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to sign out",
    });
  }
};

/**
 * @desc Get all addresses for logged in user
 * @route GET /api/auth/addresses
 */
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch addresses",
    });
  }
};

/**
 * @desc Add a new address
 * @route POST /api/auth/addresses
 */
exports.addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, city, state, pinCode, country, addressType, isDefault } = req.body;

    if (!fullName || !phone || !street || !city || !state || !pinCode) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required address fields",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If this is the first address or marked default, set isDefault true
    const shouldBeDefault = Boolean(isDefault) || (user.addresses && user.addresses.length === 0);

    if (shouldBeDefault && user.addresses) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const newAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      country: country ? country.trim() : "India",
      addressType: addressType || "Home",
      isDefault: shouldBeDefault,
    };

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add address",
    });
  }
};

/**
 * @desc Update an existing address
 * @route PUT /api/auth/addresses/:id
 */
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, street, city, state, pinCode, country, addressType, isDefault } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (fullName) address.fullName = fullName.trim();
    if (phone) address.phone = phone.trim();
    if (street) address.street = street.trim();
    if (city) address.city = city.trim();
    if (state) address.state = state.trim();
    if (pinCode) address.pinCode = pinCode.trim();
    if (country) address.country = country.trim();
    if (addressType) address.addressType = addressType;

    if (typeof isDefault === "boolean") {
      if (isDefault) {
        user.addresses.forEach((addr) => {
          addr.isDefault = false;
        });
        address.isDefault = true;
      } else {
        address.isDefault = false;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update address",
    });
  }
};

/**
 * @desc Delete an address
 * @route DELETE /api/auth/addresses/:id
 */
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const wasDefault = address.isDefault;
    user.addresses.pull(id);

    // If the deleted address was default and there are remaining addresses, make the first one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address removed successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete address",
    });
  }
};

/**
 * @desc Set an address as default
 * @route PUT /api/auth/addresses/:id/default
 */
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const address = user.addresses.id(id);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === id.toString();
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Default address updated",
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to set default address",
    });
  }
};

/**
 * @desc Sync / update user cart
 * @route PUT /api/auth/cart
 */
exports.syncCart = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ success: false, message: "Cart must be an array" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { cart },
      { new: true }
    );
    res.status(200).json({
      success: true,
      cart: user ? user.cart : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Sync / update user wishlist
 * @route PUT /api/auth/wishlist
 */
exports.syncWishlist = async (req, res) => {
  try {
    const { wishlist } = req.body;
    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ success: false, message: "Wishlist must be an array" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { wishlist },
      { new: true }
    );
    res.status(200).json({
      success: true,
      wishlist: user ? user.wishlist : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Google OAuth Login / Register via Access Token, ID Token (Credential), or Code
 * @route POST /api/auth/google
 */
exports.googleAuth = async (req, res) => {
  try {
    const { credential, code, access_token, redirect_uri } = req.body;
    let googleUser = null;

    // 1. If Access Token is passed directly (or if token starts with Google access token prefix "ya29.")
    const tokenToUse = access_token || (typeof credential === "string" && credential.startsWith("ya29.") ? credential : null);
    if (tokenToUse) {
      const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      if (userRes.ok) {
        googleUser = await userRes.json();
      } else {
        const errTxt = await userRes.text();
        console.warn("Google userinfo via access token failed:", errTxt);
      }
    }

    // 2. If ID Token (JWT Credential) is passed
    if (!googleUser && credential && !tokenToUse) {
      const verifyRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
      );
      if (verifyRes.ok) {
        googleUser = await verifyRes.json();
      } else {
        // Fallback: try as bearer token against userinfo
        const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${credential}` },
        });
        if (userRes.ok) {
          googleUser = await userRes.json();
        } else {
          console.error("Google token verification failed for credential");
        }
      }
    }

    // 3. If Authorization Code is passed
    if (!googleUser && code) {
      // Test candidate redirect URIs in order of likelihood
      const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
      const candidateUris = Array.from(
        new Set(
          [
            redirect_uri,
            "postmessage",
            `${clientBase}/my-account`,
            clientBase,
            "http://localhost:5173",
            "http://localhost:5173/my-account",
          ].filter(Boolean)
        )
      );

      let lastError = null;
      for (const uri of candidateUris) {
        try {
          const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              code,
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
              redirect_uri: uri,
              grant_type: "authorization_code",
            }),
          });
          const tokenData = await tokenRes.json();

          if (tokenRes.ok && (tokenData.access_token || tokenData.id_token)) {
            // Fetch user profile using access_token or id_token
            if (tokenData.access_token) {
              const uRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
              });
              if (uRes.ok) {
                googleUser = await uRes.json();
                break;
              }
            }
            if (tokenData.id_token) {
              const idRes = await fetch(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenData.id_token)}`
              );
              if (idRes.ok) {
                googleUser = await idRes.json();
                break;
              }
            }
          } else {
            lastError = tokenData;
          }
        } catch (fetchErr) {
          lastError = { error: fetchErr.message };
        }
      }

      if (!googleUser && lastError) {
        console.error("All Google code exchange attempts failed:", lastError);
      }
    }

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({
        success: false,
        message: "Failed to authenticate with Google. Please try again.",
      });
    }

    const email = googleUser.email.trim().toLowerCase();
    const googleId = googleUser.sub;
    const name = googleUser.name || "";
    const givenName = googleUser.given_name || (name ? name.split(" ")[0] : "Art");
    const familyName = googleUser.family_name || (name ? name.split(" ").slice(1).join(" ") : "Collector");
    const picture = googleUser.picture || "";

    // Find user by email or googleId
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (user) {
      if (user.status === "Blocked") {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended. Please contact support.",
        });
      }
      // Update googleId and avatar if not set
      let changed = false;
      if (!user.googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    } else {
      // Create new user via Google
      user = await User.create({
        firstName: givenName,
        lastName: familyName || "Collector",
        email,
        googleId,
        avatar: picture,
        authProvider: "google",
        role: "user",
        status: "Active",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Signed in with Google successfully",
      user: formatUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to authenticate with Google",
    });
  }
};

