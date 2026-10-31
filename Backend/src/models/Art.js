const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, default: "" },
    dataUrl: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
);

const signatureSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    dataUrl: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  { _id: false }
);

const artSchema = new mongoose.Schema(
  {
    artNo: {
      type: String,
      required: [true, "Artwork number is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Artwork title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Artwork description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    artistName: {
      type: String,
      required: [true, "Artist name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    stockQuantity: {
      type: Number,
      default: 1,
      min: [0, "Stock cannot be negative"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    artistAbout: {
      type: String,
      trim: true,
      default: "",
    },
    sizeOverview: {
      type: String,
      trim: true,
      default: "",
    },
    framing: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    themeDetails: {
      type: String,
      trim: true,
      default: "",
    },
    photos: [photoSchema],
    signature: {
      type: signatureSchema,
      default: null,
    },
    certificate: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    isGeneralArtwork: {
      type: Boolean,
      default: true,
    },
    isStreamingCollection: {
      type: Boolean,
      default: false,
    },
    artType: {
      type: String,
      default: "General Artwork",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual discounted price
artSchema.virtual("discountedPrice").get(function () {
  const p = Number(this.price) || 0;
  const d = Number(this.discount) || 0;
  return Math.max(0, p - (p * d) / 100);
});

// Configure toJSON
artSchema.set("toJSON", { virtuals: true });
artSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Art", artSchema);
