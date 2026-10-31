const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
  markPaymentFailed,
  retryOrder,
} = require("../controllers/paymentController");
const { protect, optionalAuth } = require("../middleware/auth");

router.post("/create-order", optionalAuth, createOrder);
router.post("/verify", optionalAuth, verifyPayment);
router.post("/mark-failed", optionalAuth, markPaymentFailed);
router.post("/retry-order", optionalAuth, retryOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/order/:id", optionalAuth, getOrderById);

module.exports = router;

