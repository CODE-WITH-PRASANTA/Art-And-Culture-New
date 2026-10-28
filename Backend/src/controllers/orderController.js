const Order = require("../models/Order");

/**
 * @desc    Get all orders with successful payment only
 * @route   GET /api/orders
 * @access  Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    // Strictly fetch ONLY orders with successful payment (captured or confirmed)
    // DO NOT return failed, unpaid, or incomplete payments
    const orders = await Order.find({
      $and: [
        {
          $or: [
            { "payment.status": "captured" },
            { "payment.status": "success" },
            {
              status: {
                $in: [
                  "Pending",
                  "Confirmed",
                  "Processing",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                ],
              },
            },
          ],
        },
        { "payment.status": { $nin: ["failed", "unpaid"] } },
      ],
    }).sort({ createdAt: -1 });

    const formattedOrders = orders.map((o) => {
      const customerName = o.customer?.fullName || "Art Collector";
      const initials =
        customerName
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => (part[0] ? part[0].toUpperCase() : ""))
          .join("") || "AC";

      const products = (o.items || []).map((item) => ({
        name: item.title || item.name || "Original Artwork",
        image: item.image || "",
        price: item.price || 0,
        quantity: item.quantity || 1,
      }));

      const itemCount = (o.items || []).reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );

      const d = o.createdAt ? new Date(o.createdAt) : new Date();
      const dateStr = [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");

      const timeStr = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const effectiveAddress =
        o.shipment?.shippingAddress || o.customer?.address || "—";

      return {
        id: o.orderNumber || `ORD-${o._id.toString().slice(-6).toUpperCase()}`,
        _id: o._id.toString(),
        orderNumber: o.orderNumber,
        customer: customerName,
        email: o.customer?.email || "—",
        phone: o.customer?.phone || "—",
        address: effectiveAddress,
        initials,
        products,
        amount: o.totalAmount || o.subtotal || 0,
        subtotal: o.subtotal || 0,
        shipping: o.shipping || 0,
        tax: o.tax || 0,
        itemCount: itemCount || 1,
        payment: o.payment?.gateway || "Razorpay",
        paymentStatus: o.payment?.status || "captured",
        razorpayPaymentId: o.payment?.razorpayPaymentId || "—",
        razorpayOrderId: o.payment?.razorpayOrderId || "—",
        status: o.status || "Pending",
        shipment: {
          carrier: o.shipment?.carrier || "Blue Dart Express",
          trackingNumber: o.shipment?.trackingNumber || "",
          shippingAddress: effectiveAddress,
          currentLocation: o.shipment?.currentLocation || "",
          transitLocations: Array.isArray(o.shipment?.transitLocations)
            ? o.shipment.transitLocations
            : [],
          deliveryAgent: {
            name: o.shipment?.deliveryAgent?.name || "",
            phone: o.shipment?.deliveryAgent?.phone || "",
            altPhone: o.shipment?.deliveryAgent?.altPhone || "",
            vehicleNumber: o.shipment?.deliveryAgent?.vehicleNumber || "",
          },
          estimatedDelivery: o.shipment?.estimatedDelivery || "",
          outForDeliveryAt: o.shipment?.outForDeliveryAt || null,
          deliveredAt: o.shipment?.deliveredAt || null,
          notes: o.shipment?.notes || "",
        },
        date: dateStr,
        time: timeStr,
        createdAt: o.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/**
 * @desc    Update order status and shipment tracking details
 * @route   PUT /api/orders/:id
 * @access  Admin
 */
exports.updateOrder = async (req, res) => {
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

    const { status, payment, shipment } = req.body;

    if (status) {
      order.status = status;
    }

    if (payment) {
      if (!order.payment) order.payment = {};
      order.payment.gateway = payment;
    }

    if (shipment && typeof shipment === "object") {
      if (!order.shipment) {
        order.shipment = {};
      }

      if (shipment.carrier !== undefined) order.shipment.carrier = shipment.carrier;
      if (shipment.trackingNumber !== undefined) order.shipment.trackingNumber = shipment.trackingNumber;
      if (shipment.shippingAddress !== undefined) {
        order.shipment.shippingAddress = shipment.shippingAddress;
        if (order.customer) {
          order.customer.address = shipment.shippingAddress;
        }
      }
      if (shipment.currentLocation !== undefined) order.shipment.currentLocation = shipment.currentLocation;

      // Handle transitLocations (multiple shipped locations / hubs)
      if (Array.isArray(shipment.transitLocations)) {
        order.shipment.transitLocations = shipment.transitLocations.map((loc) => ({
          location: loc.location || "",
          city: loc.city || "",
          status: loc.status || "In Transit",
          timestamp: loc.timestamp ? new Date(loc.timestamp) : new Date(),
          notes: loc.notes || "",
        }));
      }

      // Handle Delivery Agent details
      if (shipment.deliveryAgent && typeof shipment.deliveryAgent === "object") {
        if (!order.shipment.deliveryAgent) order.shipment.deliveryAgent = {};
        if (shipment.deliveryAgent.name !== undefined) {
          order.shipment.deliveryAgent.name = shipment.deliveryAgent.name;
        }
        if (shipment.deliveryAgent.phone !== undefined) {
          order.shipment.deliveryAgent.phone = shipment.deliveryAgent.phone;
        }
        if (shipment.deliveryAgent.altPhone !== undefined) {
          order.shipment.deliveryAgent.altPhone = shipment.deliveryAgent.altPhone;
        }
        if (shipment.deliveryAgent.vehicleNumber !== undefined) {
          order.shipment.deliveryAgent.vehicleNumber = shipment.deliveryAgent.vehicleNumber;
        }
      }

      if (shipment.estimatedDelivery !== undefined) {
        order.shipment.estimatedDelivery = shipment.estimatedDelivery;
      }
      if (shipment.notes !== undefined) {
        order.shipment.notes = shipment.notes;
      }
    }

    // Auto-update timeline timestamps
    if (!order.shipment) order.shipment = {};
    if (order.status === "Out for Delivery" && !order.shipment.outForDeliveryAt) {
      order.shipment.outForDeliveryAt = new Date();
    }
    if (order.status === "Delivered" && !order.shipment.deliveredAt) {
      order.shipment.deliveredAt = new Date();
    }

    // Default shipping address if empty
    if (!order.shipment.shippingAddress && order.customer?.address) {
      order.shipment.shippingAddress = order.customer.address;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order & shipment updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order",
    });
  }
};

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:id
 * @access  Admin
 */
exports.deleteOrder = async (req, res) => {
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

    await Order.findByIdAndDelete(order._id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete order",
    });
  }
};
