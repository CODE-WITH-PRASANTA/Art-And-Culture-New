export const toArtSlug = (title, id) => {
  if (!title) return id ? String(id) : "";
  return encodeURIComponent(
    String(title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  );
};

export default toArtSlug;

