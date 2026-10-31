const mongoose = require("mongoose");

const courseEnquirySchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingCourse",
    },
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    courseFee: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: [true, "Student/Parent name is required"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 3,
      max: 100,
    },
    experience: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Enrolled", "Closed"],
      default: "New",
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

module.exports = mongoose.model("CourseEnquiry", courseEnquirySchema);

