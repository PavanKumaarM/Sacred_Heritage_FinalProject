const express = require("express");
const router = express.Router();

const {
    validateCoupon,
    createCoupon,
    getCoupons
} = require("../controllers/coupon.controller");

const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

// Get all coupons - Public
router.get(
    "/",
    asyncHandler(getCoupons)
);

// Validate coupon - Login required
router.post(
    "/validate",
    protect,
    asyncHandler(validateCoupon)
);

// Create coupon - Login required
router.post(
    "/",
    protect,
    asyncHandler(createCoupon)
);

module.exports = router;