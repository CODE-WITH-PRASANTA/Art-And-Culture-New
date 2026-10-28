export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:5000";

export const ARTS_API_URL = `${API_BASE_URL}/api/arts`;
export const CATEGORIES_API_URL = `${API_BASE_URL}/api/categories`;
export const COUPONS_API_URL = `${API_BASE_URL}/api/coupons`;
export const GALLERY_API_URL = `${API_BASE_URL}/api/gallery`;
export const BLOGS_API_URL = `${API_BASE_URL}/api/blogs`;
export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
export const USERS_API_URL = `${API_BASE_URL}/api/users`;
export const PAYMENT_API_URL = `${API_BASE_URL}/api/payment`;

export const formatImageUrl = (img) => {
  if (!img) return "";
  if (typeof img === "object") {
    img = img.url || img.preview || img.dataUrl || "";
  }
  if (!img || typeof img !== "string") return "";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
    return img;
  }
  return `${API_BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
};

export default API_BASE_URL;

