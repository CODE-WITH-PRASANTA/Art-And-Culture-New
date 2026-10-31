const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const { getRazorpayInstance } = require("../config/razorpay");
const { sendOrderConfirmationEmail } = require("../utils/sendEmail");

/**
 * @desc Create Razorpay Order and initialize MongoDB Order
 * @route POST /api/payment/create-order
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      shipping = 0,
      tax = 0,
      totalAmount,
      discount = 0,
      couponCode = "",
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty. Please add artworks to continue.",
      });
    }

    if (!customer || !customer.fullName || !customer.email || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete delivery details (name, email, phone, address).",
      });
    }

    const finalAmount = Number(totalAmount) || Number(subtotal) || 0;
    if (finalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    // Convert amount to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(finalAmount * 100);
    const orderNumber = `AC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const razorpay = getRazorpayInstance();
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        customerName: customer.fullName.slice(0, 30),
        customerEmail: customer.email.slice(0, 30),
        customerPhone: customer.phone.slice(0, 15),
      },
    });

    const formattedItems = items.map((item) => ({
      artworkId: item._id || item.id || null,
      id: String(item.id || item._id || ""),
      name: item.name || item.title || "Artwork",
      title: item.title || item.name || "Artwork",
      artist: item.artist || item.artistName || "Art & Culture Artist",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      image: item.image || "",
      slug: item.slug || "",
    }));

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user.id : null,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
      },
      items: formattedItems,
      subtotal: Number(subtotal) || finalAmount,
      discount: Number(discount) || 0,
      couponCode: (couponCode || "").trim().toUpperCase(),
      shipping: Number(shipping) || 0,
      tax: Number(tax) || 0,
      totalAmount: finalAmount,
      currency: "INR",
      status: "Pending",
      payment: {
        gateway: "Razorpay",
        razorpayOrderId: rzpOrder.id,
        status: "created",
      },
    });

    res.status(200).json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_TppGgVggUkbJv4",
      customer: order.customer,
    });
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate payment gateway",
    });
  }
};

/**
 * @desc Verify Razorpay Payment Signature & Confirm Order
 * @route POST /api/payment/verify
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment verification payload",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "PMTMnawtXe2ZEHUUPT2JMzoN";
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpaySignature;

    if (!isSignatureValid) {
      // Mark order payment as failed
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          "payment.status": "failed",
          "payment.failureReason": "Signature verification mismatch",
          status: "Payment Failed",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Signature mismatch.",
      });
    }

    // Find and update order
    let order;
    if (orderId) {
      order = await Order.findById(orderId);
    } else {
      order = await Order.findOne({ "payment.razorpayOrderId": razorpayOrderId });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = "Confirmed";
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    order.payment.status = "captured";
    order.payment.paidAt = new Date();

    await order.save();

    // Send order confirmation email with brand logo
    if (order.customer && order.customer.email) {
      sendOrderConfirmationEmail({
        to: order.customer.email,
        order,
      }).catch((err) =>
        console.error("[SMTP] Failed to send order confirmation email:", err.message)
      );
    }

    // Increment coupon usage count if coupon was applied
    if (order.couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: order.couponCode },
          { $inc: { used: 1 } }
        );
      } catch (couponErr) {
        console.error("Failed to update coupon usage count:", couponErr);
      }
    }

    // Clear cart in user document if user exists
    if (order.user) {
      await User.findByIdAndUpdate(order.user, { cart: [] });
    }

    res.status(200).json({
      success: true,
      message: "Payment successfully verified! Your artwork order has been confirmed.",
      order,
    });
  } catch (error) {
    console.error("Razorpay Verify Payment Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

/**
 * @desc Get all orders for the current logged-in user
 * @route GET /api/payment/my-orders
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

/**
 * @desc Get order details by ID
 * @route GET /api/payment/order/:id
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;
    const mongoose = require("mongoose");

    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

/**
 * @desc Mark order payment as failed/cancelled
 * @route POST /api/payment/mark-failed
 */
exports.markPaymentFailed = async (req, res) => {
  try {
    const { orderId, orderNumber, razorpayOrderId, reason } = req.body;
    let order = null;
    const mongoose = require("mongoose");

    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findById(orderId);
    }
    if (!order && orderNumber) {
      order = await Order.findOne({ orderNumber });
    }
    if (!order && razorpayOrderId) {
      order = await Order.findOne({ "payment.razorpayOrderId": razorpayOrderId });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only update if not already captured
    if (order.payment?.status !== "captured") {
      order.payment.status = "failed";
      order.payment.failureReason = reason || "Payment cancelled or declined by gateway";
      order.status = "Payment Failed";
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Order payment status marked as failed",
      order,
    });
  } catch (error) {
    console.error("Mark Payment Failed Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark payment status",
    });
  }
};

/**
 * @desc Retry payment for an existing unpaid/failed order
 * @route POST /api/payment/retry-order
 */
exports.retryOrder = async (req, res) => {
  try {
    const { orderId, orderNumber } = req.body;
    let order = null;
    const mongoose = require("mongoose");

    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      order = await Order.findById(orderId);
    }
    if (!order && orderNumber) {
      order = await Order.findOne({ orderNumber });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.payment?.status === "captured") {
      return res.status(400).json({
        success: false,
        message: "This order is already paid and confirmed.",
      });
    }

    const finalAmount = Number(order.totalAmount) || Number(order.subtotal) || 0;
    const amountInPaise = Math.round(finalAmount * 100);

    const razorpay = getRazorpayInstance();
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        customerName: (order.customer?.fullName || "Art Collector").slice(0, 30),
        customerEmail: (order.customer?.email || "").slice(0, 30),
        customerPhone: (order.customer?.phone || "").slice(0, 15),
      },
    });

    order.payment.razorpayOrderId = rzpOrder.id;
    order.payment.status = "created";
    order.status = "Pending";
    await order.save();

    res.status(200).json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_TppGgVggUkbJv4",
      customer: order.customer,
    });
  } catch (error) {
    console.error("Retry Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retry order payment",
    });
  }
};


