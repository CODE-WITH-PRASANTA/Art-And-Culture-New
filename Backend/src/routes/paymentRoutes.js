const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} = require("../controllers/paymentController");
const { protect, optionalAuth } = require("../middleware/auth");

router.post("/create-order", optionalAuth, createOrder);
router.post("/verify", optionalAuth, verifyPayment);
router.get("/my-orders", protect, getMyOrders);
router.get("/order/:id", optionalAuth, getOrderById);

module.exports = router;

