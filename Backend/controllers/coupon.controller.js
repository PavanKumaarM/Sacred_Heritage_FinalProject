const Coupon = require("../models/Coupon");
const {
  calculateCouponDiscount
} = require("../services/coupon.service");

const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || typeof subtotal !== "number" || subtotal < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid coupon code and subtotal are required"
      });
    }

    const result = await calculateCouponDiscount(code, subtotal);

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: {
        code: result.coupon.code,
        discountType: result.coupon.discountType,
        discountValue: result.coupon.discountValue
      },
      subtotal,
      discount: result.discount,
      totalAmount: subtotal - result.discount
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create({
      ...req.body,
      code: req.body.code.toUpperCase().trim()
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      coupons
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  validateCoupon,
  createCoupon,
  getCoupons
};