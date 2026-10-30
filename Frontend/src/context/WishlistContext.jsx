import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const getUserWishlistKey = (user) => {
  if (user && user.email) {
    return `art_culture_wishlist_${user.email.toLowerCase().trim()}`;
  }
  return "art_culture_wishlist_guest";
};

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, syncWishlistToBackend } = useAuth();
  const storageKey = getUserWishlistKey(user);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const storedUser = localStorage.getItem("art_culture_user");
      let activeKey = "art_culture_wishlist_guest";
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u?.email) activeKey = `art_culture_wishlist_${u.email.toLowerCase().trim()}`;
      }
      const stored =
        localStorage.getItem(activeKey) ||
        localStorage.getItem("art_culture_wishlist_items");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track user login/logout & restore user wishlist
  useEffect(() => {
    try {
      if (user && user.email) {
        const userKey = `art_culture_wishlist_${user.email.toLowerCase().trim()}`;
        const stored = localStorage.getItem(userKey);
        let items = stored ? JSON.parse(stored) : null;

        // If no local items found for this user, check backend database user.wishlist
        if (
          (!items || items.length === 0) &&
          Array.isArray(user.wishlist) &&
          user.wishlist.length > 0
        ) {
          items = user.wishlist;
        }

        // If guest added items before logging in, merge them in
        const guestStored =
          localStorage.getItem("art_culture_wishlist_guest") ||
          localStorage.getItem("art_culture_wishlist_items");
        if (guestStored) {
          try {
            const guestItems = JSON.parse(guestStored);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              const merged = [...(items || [])];
              guestItems.forEach((g) => {
                if (
                  !merged.some(
                    (m) => String(m.id || m._id) === String(g.id || g._id)
                  )
                ) {
                  merged.unshift(g);
                }
              });
              items = merged;
              localStorage.removeItem("art_culture_wishlist_guest");
              localStorage.removeItem("art_culture_wishlist_items");
            }
          } catch {}
        }

        const finalItems = items || [];
        setWishlist(finalItems);
        localStorage.setItem(userKey, JSON.stringify(finalItems));
      } else {
        // Logged out: show empty/guest wishlist
        const guestStored = localStorage.getItem("art_culture_wishlist_guest");
        setWishlist(guestStored ? JSON.parse(guestStored) : []);
      }
    } catch (err) {
      console.warn("Wishlist auth hydration error:", err);
    }
  }, [user?.email]);

  // Persist to user storage and backend
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
      if (user && user.email && typeof syncWishlistToBackend === "function") {
        syncWishlistToBackend(wishlist);
      }
    } catch (e) {
      console.error("Failed to persist wishlist to localStorage:", e);
    }
  }, [wishlist, storageKey]);

  // Sync across tabs & handle logout
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageKey) {
        try {
          setWishlist(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setWishlist([]);
        }
      }
    };

    const handleClearWishlist = () => {
      setWishlist([]);
      try {
        localStorage.removeItem("art_culture_wishlist_guest");
        localStorage.removeItem("art_culture_wishlist_items");
      } catch (e) {}
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("art_culture:wishlist_clear", handleClearWishlist);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("art_culture:wishlist_clear", handleClearWishlist);
    };
  }, [storageKey]);

  const isInWishlist = (id) => {
    if (!id) return false;
    const strId = String(id);
    return wishlist.some(
      (item) => String(item.id) === strId || (item._id && String(item._id) === strId)
    );
  };

  const addToWishlist = (item) => {
    if (!item) return;
    const itemId = String(item.id || item._id || "");
    if (!itemId) return;

    setWishlist((prev) => {
      if (prev.some((p) => String(p.id) === itemId || (p._id && String(p._id) === itemId))) {
        return prev;
      }
      const normalizedItem = {
        id: itemId,
        _id: item._id || itemId,
        title: item.title || "Untitled Artwork",
        artist: item.artist || item.artistName || "Unknown Artist",
        price: Number(item.price) || 0,
        originalPrice: Number(item.originalPrice || item.price) || 0,
        discount: Number(item.discount) || 0,
        category: Array.isArray(item.category)
          ? item.category
          : [item.category || "General Artwork"],
        image: item.image || "",
        stock:
          item.stockQuantity !== undefined
            ? Number(item.stockQuantity) > 0
            : item.stock !== undefined
            ? Boolean(item.stock)
            : true,
        description: item.description || "",
      };
      return [normalizedItem, ...prev];
    });
  };

  const removeFromWishlist = (id) => {
    if (!id) return;
    const strId = String(id);
    setWishlist((prev) =>
      prev.filter(
        (item) => String(item.id) !== strId && (!item._id || String(item._id) !== strId)
      )
    );
  };

  const toggleWishlist = (item) => {
    if (!item) return false;
    const itemId = String(item.id || item._id || (typeof item === "string" ? item : ""));
    if (isInWishlist(itemId)) {
      removeFromWishlist(itemId);
      return false;
    } else {
      addToWishlist(item);
      return true;
    }
  };

  const removeMultiple = (ids) => {
    if (!Array.isArray(ids) || !ids.length) return;
    const idSet = new Set(ids.map((id) => String(id)));
    setWishlist((prev) =>
      prev.filter(
        (item) =>
          !idSet.has(String(item.id)) && (!item._id || !idSet.has(String(item._id)))
      )
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
    try {
      localStorage.removeItem(storageKey);
      if (user && user.email && typeof syncWishlistToBackend === "function") {
        syncWishlistToBackend([]);
      }
    } catch (e) {}
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        removeMultiple,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistContext;

