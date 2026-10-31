const mongoose = require("mongoose");

const trainingCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      default: "Online",
    },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline",
      required: true,
    },
    courseFee: {
      type: Number,
      required: [true, "Original course fee is required"],
      min: [0, "Fee cannot be negative"],
    },
    discountFee: {
      type: Number,
      default: function () {
        return this.courseFee;
      },
      min: [0, "Discount fee cannot be negative"],
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
    },
    category: {
      type: String,
      default: "Painting",
      trim: true,
    },
    level: {
      type: String,
      default: "All Levels",
      trim: true,
    },
    duration: {
      type: String,
      default: "4 Weeks",
      trim: true,
    },
    instructor: {
      type: String,
      default: "Master Artisan",
      trim: true,
    },
    batchSize: {
      type: String,
      default: "15 Students",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Draft"],
      default: "Active",
    },
    highlights: {
      type: [String],
      default: ["All skill levels", "Practical hands-on training", "Artisan certification"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TrainingCourse", trainingCourseSchema);

