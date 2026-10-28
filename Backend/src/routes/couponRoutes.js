const express = require("express");
const router = express.Router();
const {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  toggleCouponStatus,
  deleteCoupon,
} = require("../controllers/couponController");

// /api/coupons
router
  .route("/")
  .get(getCoupons)
  .post(createCoupon);

// /api/coupons/:id
router
  .route("/:id")
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

// /api/coupons/:id/toggle
router.route("/:id/toggle").patch(toggleCouponStatus);

module.exports = router;
