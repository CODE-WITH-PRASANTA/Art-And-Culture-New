/**
 * Admin Authentication Utilities
 * Manages admin JWT session token and profile in localStorage
 */
import { ADMIN_AUTH_API_URL } from "../config/api";

const TOKEN_KEY = "adminToken";
const USER_KEY = "adminUser";

export const getAdminToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch (e) {
    return "";
  }
};

export const getAdminUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAdminSession = (token, adminUser) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (adminUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
      // Notify Topbar and other components of profile update
      window.dispatchEvent(
        new CustomEvent("profileUpdated", { detail: adminUser })
      );
    }
  } catch (e) {
    console.error("Failed to store admin session:", e);
  }
};

export const clearAdminSession = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Failed to clear admin session:", e);
  }
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  return Boolean(token && token.trim().length > 15);
};

export const getAdminAuthHeaders = () => {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Verify JWT Token validity with backend
 */
export const verifyAdminSession = async () => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${ADMIN_AUTH_API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.admin) {
        setAdminSession(token, data.admin);
        return true;
      }
    }

    // Token expired or invalid on server
    clearAdminSession();
    return false;
  } catch (err) {
    console.warn("Could not verify admin session with server:", err);
    // Return true if network glitch so offline or slow connection doesn't instantly kick admin
    return isAdminAuthenticated();
  }
};
