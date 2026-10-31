const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    artworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Art",
    },
    id: { type: String, default: "" },
    name: { type: String, required: true },
    title: { type: String },
    artist: { type: String, default: "Art Collector Series" },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    image: { type: String, default: "" },
    slug: { type: String, default: "" },
  },
  { _id: false }
);

const transitCheckpointSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    status: { type: String, default: "In Transit", trim: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const shipmentSchema = new mongoose.Schema(
  {
    carrier: { type: String, default: "India Post (Speed Post)", trim: true },
    trackingNumber: { type: String, default: "", trim: true },
    shippingAddress: { type: String, default: "", trim: true },
    currentLocation: { type: String, default: "", trim: true },
    currentHub: { type: String, default: "", trim: true },
    transitLocations: [transitCheckpointSchema],
    deliveryAgent: {
      name: { type: String, default: "", trim: true },
      phone: { type: String, default: "", trim: true },
      altPhone: { type: String, default: "", trim: true },
      vehicleNumber: { type: String, default: "", trim: true },
    },
    estimatedDelivery: { type: String, default: "", trim: true },
    deliveryDate: { type: String, default: "", trim: true },
    outForDeliveryAt: { type: Date },
    deliveredAt: { type: Date },
    notes: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customer: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      default: "",
      trim: true,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Payment Failed",
      ],
      default: "Pending",
    },
    shipment: {
      type: shipmentSchema,
      default: () => ({}),
    },
    payment: {
      gateway: {
        type: String,
        default: "Razorpay",
      },
      razorpayOrderId: {
        type: String,
        default: "",
      },
      razorpayPaymentId: {
        type: String,
        default: "",
      },
      razorpaySignature: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: ["created", "authorized", "captured", "failed", "refunded"],
        default: "created",
      },
      paidAt: {
        type: Date,
      },
      failureReason: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
