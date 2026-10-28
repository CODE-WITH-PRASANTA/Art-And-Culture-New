const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/").get(getAllOrders);
router.route("/:id").put(updateOrder).delete(deleteOrder);

module.exports = router;

