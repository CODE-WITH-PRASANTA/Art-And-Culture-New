const jwt = require("jsonwebtoken");

const ACCESS_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  process.env.JWT_SECRET ||
  "art_and_culture_access_token_secret_key_2026_xyz";

const REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  "art_and_culture_refresh_token_secret_key_2026_xyz";

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

/**
 * Generate short-lived Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || "user",
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES }
  );
};

/**
 * Generate long-lived Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES }
  );
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  ACCESS_SECRET,
  REFRESH_SECRET,
};

