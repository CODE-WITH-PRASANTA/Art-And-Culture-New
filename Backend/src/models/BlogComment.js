const mongoose = require("mongoose");

const blogCommentSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: false,
    },
    blogSlug: {
      type: String,
      required: [true, "Blog slug is required"],
      trim: true,
      lowercase: true,
    },
    blogTitle: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Your name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Your email is required"],
      trim: true,
      lowercase: true,
    },
    comment: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      enum: ["Draft", "Approved", "Pending", "Rejected"],
      default: "Draft",
    },
    avatar: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  {
    timestamps: true,
  }
);

// Virtual id
blogCommentSchema.virtual("id").get(function () {
  return this._id ? this._id.toHexString() : undefined;
});

blogCommentSchema.set("toJSON", { virtuals: true });
blogCommentSchema.set("toObject", { virtuals: true });

// Compound index to help query comments per blog quickly
blogCommentSchema.index({ blogSlug: 1, createdAt: -1 });
blogCommentSchema.index({ blogId: 1, createdAt: -1 });

module.exports = mongoose.model("BlogComment", blogCommentSchema);

