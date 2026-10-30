const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Gallery title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    photo: {
      type: String,
      required: [true, "Gallery photo is required"],
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.image = ret.photo;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.image = ret.photo;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
