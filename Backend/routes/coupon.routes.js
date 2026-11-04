const express = require("express");
const router = express.Router();

const {
  validateCoupon,
  createCoupon,
  getCoupons
} = require("../controllers/coupon.controller");

const {
  protect,
  adminOnly
} = require("../middleware/auth.middleware");

router.get("/", getCoupons);
router.post("/validate", protect, validateCoupon);
router.post("/", protect, adminOnly, createCoupon);

module.exports = router;