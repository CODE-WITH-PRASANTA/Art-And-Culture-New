const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Follow Up", "Resolved"],
      default: "New",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    source: {
      type: String,
      default: "Website",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    followUpDate: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: String,
      default: "Admin",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual id for frontend compatibility
enquirySchema.virtual("id").get(function () {
  return this._id ? this._id.toHexString() : undefined;
});

enquirySchema.set("toJSON", { virtuals: true });
enquirySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Enquiry", enquirySchema);

