import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_API_URL } from "../config/api";

const ACCESS_TOKEN_KEY = "art_culture_access_token";
const REFRESH_TOKEN_KEY = "art_culture_refresh_token";
const USER_KEY = "art_culture_user";

// In-flight refresh promise singleton to prevent race conditions & duplicate refreshes
let inFlightRefreshPromise = null;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY) || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY) || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const stored =
        localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed && (parsed._id || parsed.id) && parsed.email) {
        return parsed;
      }
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
      return null;
    } catch {
      return null;
    }
  });

  // If user already exists in storage, loading is false so the UI renders instantly without flashing/logout
  const [loading, setLoading] = useState(() => {
    const hasExistingSession = Boolean(
      (localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
       localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY)) &&
      (localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY))
    );
    return !hasExistingSession;
  });

  // Helper to store tokens and user
  const storeAuthData = (token, refresh, userData, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;
    const alternate = remember ? sessionStorage : localStorage;

    // Clear opposite storage
    alternate.removeItem(ACCESS_TOKEN_KEY);
    alternate.removeItem(REFRESH_TOKEN_KEY);
    alternate.removeItem(USER_KEY);

    if (token) {
      storage.setItem(ACCESS_TOKEN_KEY, token);
      setAccessToken(token);
    }
    if (refresh) {
      storage.setItem(REFRESH_TOKEN_KEY, refresh);
      setRefreshToken(refresh);
    }
    if (userData && (userData._id || userData.id) && userData.email) {
      storage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } else if (userData === null) {
      // ONLY clear user if explicitly null, NEVER if undefined
      storage.removeItem(USER_KEY);
      alternate.removeItem(USER_KEY);
      setUser(null);
    }
  };

  // Helper to clear tokens and user
  const clearAuthData = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    try {
      window.dispatchEvent(new CustomEvent("art_culture:cart_clear"));
      window.dispatchEvent(new CustomEvent("art_culture:wishlist_clear"));
    } catch (e) {
      console.warn("Storage cleanup error:", e);
    }
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  // Silently refresh the access token using refreshToken with singleton promise deduplication
  const refreshSession = async () => {
    if (inFlightRefreshPromise) {
      return inFlightRefreshPromise;
    }

    const currentRefresh =
      refreshToken ||
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(REFRESH_TOKEN_KEY);

    if (!currentRefresh) {
      return null;
    }

    inFlightRefreshPromise = (async () => {
      try {
        const res = await fetch(`${AUTH_API_URL}/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: currentRefresh }),
        });
        const data = await res.json();

        if (res.ok && data.success && data.accessToken) {
          const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
          const refreshedUser = data.user || user;
          storeAuthData(
            data.accessToken,
            data.refreshToken || currentRefresh,
            refreshedUser,
            isPersistent
          );
          return data.accessToken;
        } else if (res.status === 401 || res.status === 403) {
          // Token is genuinely invalid or expired on server
          clearAuthData();
          return null;
        } else {
          // Temporary server error (500/502/503) - keep local session!
          console.warn("Refresh token request returned server error status:", res.status);
          return null;
        }
      } catch (err) {
        console.error("Failed to refresh session due to network glitch:", err);
        // Network error - keep local session!
        return null;
      }
    })().finally(() => {
      inFlightRefreshPromise = null;
    });

    return inFlightRefreshPromise;
  };

  // Verify and hydrate current user on initial load
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const currentAccess =
        accessToken ||
        localStorage.getItem(ACCESS_TOKEN_KEY) ||
        sessionStorage.getItem(ACCESS_TOKEN_KEY);
      const currentRefresh =
        refreshToken ||
        localStorage.getItem(REFRESH_TOKEN_KEY) ||
        sessionStorage.getItem(REFRESH_TOKEN_KEY);

      if (!currentAccess && !currentRefresh) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        let tokenToUse = currentAccess;
        let res = null;

        if (tokenToUse) {
          res = await fetch(`${AUTH_API_URL}/me`, {
            headers: { Authorization: `Bearer ${tokenToUse}` },
          });
        }

        // If access token is expired (401) or missing, attempt silent refresh
        if ((!res || res.status === 401) && currentRefresh) {
          tokenToUse = await refreshSession();
          if (tokenToUse) {
            res = await fetch(`${AUTH_API_URL}/me`, {
              headers: { Authorization: `Bearer ${tokenToUse}` },
            });
          }
        }

        // If component unmounted during StrictMode / navigation, DO NOT touch auth storage
        if (!isMounted) return;

        if (res && res.ok) {
          const data = await res.json();
          if (data.success && data.user && data.user.email) {
            setUser(data.user);
            const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
            const storage = isPersistent ? localStorage : sessionStorage;
            storage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        } else if (res && (res.status === 401 || res.status === 403)) {
          // Only clear if server explicitly denied access and refresh was exhausted
          clearAuthData();
        }
      } catch (err) {
        console.error("Auth init network error (preserving stored session):", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = async (email, password, rememberMe = true) => {
    const res = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to sign in");
    }

    storeAuthData(data.accessToken, data.refreshToken, data.user, rememberMe);
    return data;
  };

  // Google OAuth Login / Register handler
  const googleLogin = async ({ credential, code, access_token }, rememberMe = true) => {
    const res = await fetch(`${AUTH_API_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential, code, access_token }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to sign in with Google");
    }

    storeAuthData(data.accessToken, data.refreshToken, data.user, rememberMe);
    return data;
  };

  // Register handler
  const register = async (userData) => {
    const res = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to create account");
    }

    return data;
  };

  // Logout handler
  const logout = async () => {
    const currentRefresh =
      refreshToken ||
      localStorage.getItem(REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(REFRESH_TOKEN_KEY);

    // 1. Immediately wipe all local auth state and storage synchronously
    clearAuthData();

    // 2. Notify backend to clear server session & refresh cookie
    try {
      if (currentRefresh) {
        await fetch(`${AUTH_API_URL}/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ refreshToken: currentRefresh }),
        });
      }
    } catch (e) {
      console.warn("Logout request failed:", e);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    const res = await fetch(`${AUTH_API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Could not send verification code");
    }
    return data;
  };

  // Verify OTP
  const verifyOtp = async ({ email, code }) => {
    const res = await fetch(`${AUTH_API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Invalid or expired verification code");
    }
    return data;
  };

  // Reset password
  const resetPassword = async ({ email, code, newPassword }) => {
    const res = await fetch(`${AUTH_API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Could not reset password");
    }
    return data;
  };

  // Update profile
  const updateProfile = async (profileData) => {
    let token = accessToken;
    let res = await fetch(`${AUTH_API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (res.status === 401) {
      token = await refreshSession();
      if (token) {
        res = await fetch(`${AUTH_API_URL}/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });
      }
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update profile");
    }

    const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
    storeAuthData(token, refreshToken, data.user, isPersistent);
    return data.user;
  };

  // Upload user profile photo
  const uploadAvatar = async (file) => {
    const token =
      accessToken ||
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) throw new Error("Not authenticated");

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(`${AUTH_API_URL}/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to upload profile photo");
    }

    if (data.user) {
      const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
      storeAuthData(token, refreshToken, data.user, isPersistent);
    }
    return data;
  };

  // Helper for authenticated requests with token auto-refresh
  const authFetch = async (url, options = {}) => {
    let token =
      accessToken ||
      localStorage.getItem(ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const makeRequest = (t) => {
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${t}`,
      };
      return fetch(url, { ...options, headers });
    };

    let res = await makeRequest(token);
    if (res.status === 401) {
      token = await refreshSession();
      if (token) {
        res = await makeRequest(token);
      }
    }
    return res;
  };

  // Address operations
  const getAddresses = async () => {
    if (!accessToken && !localStorage.getItem(ACCESS_TOKEN_KEY)) {
      return [];
    }
    const res = await authFetch(`${AUTH_API_URL}/addresses`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch addresses");
    }
    setUser((prev) => {
      if (!prev || (!prev._id && !prev.id) || !prev.email) return null;
      const updated = { ...prev, addresses: data.addresses };
      const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
      storeAuthData(accessToken, refreshToken, updated, isPersistent);
      return updated;
    });
    return data.addresses;
  };

  const addAddress = async (addressData) => {
    const res = await authFetch(`${AUTH_API_URL}/addresses`, {
      method: "POST",
      body: JSON.stringify(addressData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to add address");
    }
    setUser((prev) => {
      if (!prev || (!prev._id && !prev.id) || !prev.email) return null;
      const updated = { ...prev, addresses: data.addresses };
      const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
      storeAuthData(accessToken, refreshToken, updated, isPersistent);
      return updated;
    });
    return data.addresses;
  };

  const updateAddress = async (id, addressData) => {
    const res = await authFetch(`${AUTH_API_URL}/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update address");
    }
    setUser((prev) => {
      if (!prev || (!prev._id && !prev.id) || !prev.email) return null;
      const updated = { ...prev, addresses: data.addresses };
      const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
      storeAuthData(accessToken, refreshToken, updated, isPersistent);
      return updated;
    });
    return data.addresses;
  };

  const deleteAddress = async (id) => {
    const res = await authFetch(`${AUTH_API_URL}/addresses/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete address");
    }
    setUser((prev) => {
      if (!prev || (!prev._id && !prev.id) || !prev.email) return null;
      const updated = { ...prev, addresses: data.addresses };
      const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
      storeAuthData(accessToken, refreshToken, updated, isPersistent);
      return updated;
    });
    return data.addresses;
  };

  const setDefaultAddress = async (id) => {
    const res = await authFetch(`${AUTH_API_URL}/addresses/${id}/default`, {
      method: "PUT",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to set default address");
    }
    setUser((prev) => {
      if (!prev || (!prev._id && !prev.id) || !prev.email) return null;
      const updated = { ...prev, addresses: data.addresses };
      const isPersistent = Boolean(localStorage.getItem(REFRESH_TOKEN_KEY));
      storeAuthData(accessToken, refreshToken, updated, isPersistent);
      return updated;
    });
    return data.addresses;
  };

  // Sync user cart to server database
  const syncCartToBackend = async (cartItems) => {
    if (!accessToken && !localStorage.getItem(ACCESS_TOKEN_KEY)) return;
    try {
      await authFetch(`${AUTH_API_URL}/cart`, {
        method: "PUT",
        body: JSON.stringify({ cart: cartItems }),
      });
    } catch (err) {
      console.warn("Failed to sync cart to server:", err);
    }
  };

  // Sync user wishlist to server database
  const syncWishlistToBackend = async (wishlistItems) => {
    if (!accessToken && !localStorage.getItem(ACCESS_TOKEN_KEY)) return;
    try {
      await authFetch(`${AUTH_API_URL}/wishlist`, {
        method: "PUT",
        body: JSON.stringify({ wishlist: wishlistItems }),
      });
    } catch (err) {
      console.warn("Failed to sync wishlist to server:", err);
    }
  };

  const isUserAuthenticated = Boolean(
    (accessToken || refreshToken) && user && (user._id || user.id) && user.email
  );

  return (
    <AuthContext.Provider
      value={{
        user: isUserAuthenticated ? user : null,
        accessToken,
        refreshToken,
        isAuthenticated: isUserAuthenticated,
        loading,
        login,
        googleLogin,
        register,
        logout,
        forgotPassword,
        verifyOtp,
        resetPassword,
        updateProfile,
        uploadAvatar,
        refreshSession,
        getAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        syncCartToBackend,
        syncWishlistToBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

