const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    blogCode: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Blog slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    authorName: {
      type: String,
      default: "Admin",
      trim: true,
    },
    category: {
      type: String,
      default: "Art & Culture",
      trim: true,
    },
    characteristics: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      default: "",
    },
    excerpt: {
      type: String,
      default: "",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    metaDescription: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Scheduled"],
      default: "Draft",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    mainImage: {
      type: String,
      default: "",
    },
    bodyImages: [
      {
        type: String,
        default: "",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search performance
blogSchema.index({ title: "text", authorName: "text", category: "text" });

module.exports = mongoose.model("Blog", blogSchema);

