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
export const ENQUIRIES_API_URL = `${API_BASE_URL}/api/enquiries`;
export const BLOG_COMMENTS_API_URL = `${API_BASE_URL}/api/blog-comments`;
export const REVIEWS_API_URL = `${API_BASE_URL}/api/blog-comments`;

export const formatImageUrl = (img) => {
  if (!img) return "";
  if (typeof img === "object") {
    img = img.url || img.preview || img.dataUrl || "";
  }
  if (!img || typeof img !== "string") return "";
  if (
    img.startsWith("http://") ||
    img.startsWith("https://") ||
    img.startsWith("data:") ||
    img.startsWith("blob:")
  ) {
    return img;
  }
  const cleanPath = img.replace(/\\/g, "/");
  return `${API_BASE_URL}${cleanPath.startsWith("/") ? "" : "/"}${cleanPath}`;
};

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER ||
  "8117048317";

export const getWhatsAppUrl = (phone = WHATSAPP_NUMBER, message = "") => {
  const digits = String(phone).replace(/\D/g, "");
  const fullNumber = digits.length === 10 ? `91${digits}` : digits;
  const encodedMsg = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${fullNumber}${encodedMsg ? `?text=${encodedMsg}` : ""}`;
};

export default API_BASE_URL;

