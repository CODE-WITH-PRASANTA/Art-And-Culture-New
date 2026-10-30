import React, { createContext, useContext, useEffect, useState } from "react";
import { formatImageUrl } from "../config/api";
import { useAuth } from "./AuthContext";

const getUserCartKey = (user) => {
  if (user && user.email) {
    return `art_culture_cart_${user.email.toLowerCase().trim()}`;
  }
  return "art_culture_cart_guest";
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, syncCartToBackend } = useAuth();
  const storageKey = getUserCartKey(user);

  const [cart, setCart] = useState(() => {
    try {
      const storedUser = localStorage.getItem("art_culture_user");
      let activeKey = "art_culture_cart_guest";
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u?.email) activeKey = `art_culture_cart_${u.email.toLowerCase().trim()}`;
      }
      const stored =
        localStorage.getItem(activeKey) ||
        localStorage.getItem("art_culture_cart_items");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track user login/logout & restore user cart
  useEffect(() => {
    try {
      if (user && user.email) {
        const userKey = `art_culture_cart_${user.email.toLowerCase().trim()}`;
        const stored = localStorage.getItem(userKey);
        let items = stored ? JSON.parse(stored) : null;

        // If no local items found for this user, check backend database user.cart
        if (
          (!items || items.length === 0) &&
          Array.isArray(user.cart) &&
          user.cart.length > 0
        ) {
          items = user.cart;
        }

        // If guest added items before logging in, merge them in
        const guestStored =
          localStorage.getItem("art_culture_cart_guest") ||
          localStorage.getItem("art_culture_cart_items");
        if (guestStored) {
          try {
            const guestItems = JSON.parse(guestStored);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              const merged = [...(items || [])];
              guestItems.forEach((g) => {
                const idx = merged.findIndex(
                  (m) => String(m.id || m._id) === String(g.id || g._id)
                );
                if (idx > -1) {
                  merged[idx].quantity += g.quantity;
                } else {
                  merged.unshift(g);
                }
              });
              items = merged;
              localStorage.removeItem("art_culture_cart_guest");
              localStorage.removeItem("art_culture_cart_items");
            }
          } catch {}
        }

        const finalItems = items || [];
        setCart(finalItems);
        localStorage.setItem(userKey, JSON.stringify(finalItems));
      } else {
        // Logged out: show empty/guest cart
        const guestStored = localStorage.getItem("art_culture_cart_guest");
        setCart(guestStored ? JSON.parse(guestStored) : []);
      }
    } catch (err) {
      console.warn("Cart auth hydration error:", err);
    }
  }, [user?.email]);

  // Persist to user storage and backend
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
      if (user && user.email && typeof syncCartToBackend === "function") {
        syncCartToBackend(cart);
      }
    } catch (e) {
      console.error("Failed to persist cart to localStorage:", e);
    }
  }, [cart, storageKey]);

  // Sync across tabs & handle logout
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageKey) {
        try {
          setCart(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          setCart([]);
        }
      }
    };

    const handleClearCart = () => {
      setCart([]);
      try {
        localStorage.removeItem("art_culture_cart_guest");
        localStorage.removeItem("art_culture_cart_items");
      } catch (e) {}
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("art_culture:cart_clear", handleClearCart);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("art_culture:cart_clear", handleClearCart);
    };
  }, [storageKey]);

  const normalizeItem = (item, quantity = 1) => {
    const itemId = String(item.id || item._id || "");
    const title = item.title || item.name || "Untitled Artwork";
    const artist = item.artist || item.artistName || "Art & Culture Collection";
    const price = Number(item.price) || 0;

    let image = item.image;
    if (!image && Array.isArray(item.photos) && item.photos.length > 0) {
      image = item.photos[0]?.url || item.photos[0]?.dataUrl || "";
    }
    if (!image && Array.isArray(item.images) && item.images.length > 0) {
      image = item.images[0] || "";
    }
    image = formatImageUrl(image) || "";

    const tags = Array.isArray(item.tags) && item.tags.length > 0
      ? item.tags
      : Array.isArray(item.category) && item.category.length > 0
      ? item.category
      : typeof item.category === "string"
      ? [item.category]
      : ["Artwork"];

    const inStock =
      item.stockQuantity !== undefined
        ? Number(item.stockQuantity) > 0
        : item.inStock !== undefined
        ? Boolean(item.inStock)
        : item.stock !== undefined
        ? Boolean(item.stock)
        : true;

    return {
      id: itemId,
      _id: item._id || itemId,
      name: title,
      title,
      artist,
      price,
      originalPrice: Number(item.originalPrice || price) || price,
      image,
      quantity: Math.max(1, Number(quantity) || 1),
      selected: item.selected !== undefined ? Boolean(item.selected) : true,
      inStock,
      tags,
      slug: item.slug || "",
      artNo: item.artNo || "",
    };
  };

  const isInCart = (id) => {
    if (!id) return false;
    const strId = String(id);
    return cart.some(
      (item) => String(item.id) === strId || (item._id && String(item._id) === strId)
    );
  };

  const getItemQuantity = (id) => {
    if (!id) return 0;
    const strId = String(id);
    const found = cart.find(
      (item) => String(item.id) === strId || (item._id && String(item._id) === strId)
    );
    return found ? found.quantity : 0;
  };

  const addToCart = (item, quantity = 1) => {
    if (!item) return;
    const normalized = normalizeItem(item, quantity);
    if (!normalized.id) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (p) =>
          String(p.id) === normalized.id ||
          (p._id && String(p._id) === normalized.id)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + normalized.quantity,
          selected: true,
        };
        return updated;
      }

      return [normalized, ...prev];
    });

    return normalized;
  };

  const removeFromCart = (id) => {
    if (!id) return;
    const strId = String(id);
    setCart((prev) =>
      prev.filter(
        (item) => String(item.id) !== strId && (!item._id || String(item._id) !== strId)
      )
    );
  };

  const updateQuantity = (id, newQuantity) => {
    if (!id) return;
    const strId = String(id);
    const qty = Math.max(1, Number(newQuantity) || 1);

    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === strId || (item._id && String(item._id) === strId)
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const changeQuantity = (id, delta) => {
    if (!id) return;
    const strId = String(id);

    setCart((prev) =>
      prev.map((item) => {
        if (String(item.id) === strId || (item._id && String(item._id) === strId)) {
          const nextQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const toggleSelection = (id) => {
    if (!id) return;
    const strId = String(id);

    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === strId || (item._id && String(item._id) === strId)
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const toggleSelectAll = (selectState) => {
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        selected: typeof selectState === "boolean" ? selectState : !prev.every((i) => i.selected),
      }))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(storageKey);
      if (user && user.email && typeof syncCartToBackend === "function") {
        syncCartToBackend([]);
      }
    } catch (e) {}
  };

  // Cart item count (total units in cart)
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Selected items
  const selectedItems = cart.filter((item) => item.selected);

  // Financial calculations
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  // Free shipping and inclusive tax policy
  const shipping = 0;
  const tax = 0;
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        selectedItems,
        subtotal,
        shipping,
        tax,
        total,
        isInCart,
        getItemQuantity,
        addToCart,
        removeFromCart,
        updateQuantity,
        changeQuantity,
        toggleSelection,
        toggleSelectAll,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;

