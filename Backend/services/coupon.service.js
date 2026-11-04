
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");

const validateCoupon = async (code, subtotal, session = null) => {
  if (
    !code ||
    typeof subtotal !== "number" ||
    !Number.isFinite(subtotal) ||
    subtotal < 0
  ) {
    throw new Error("Valid coupon code and subtotal are required");
  }

  let query = Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true
  });

  if (session) query = query.session(session);

  const coupon = await query;

  if (!coupon) {
    throw new Error("Invalid coupon");
  }

  if (coupon.expiryDate <= new Date()) {
    throw new Error("Coupon expired");
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new Error("Coupon usage limit reached");
  }

  if (subtotal < coupon.minimumOrderAmount) {
    throw new Error(
      `Minimum order amount is ₹${coupon.minimumOrderAmount}`
    );
  }

  let discount = 0;

  if (coupon.discountType === "PERCENTAGE") {
    discount = (subtotal * coupon.discountValue) / 100;

    if (coupon.maximumDiscount !== null) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  discount = Math.min(discount, subtotal);
  discount = Math.round(discount * 100) / 100;

  return {
    coupon,
    discount,
    totalAmount: Math.round((subtotal - discount) * 100) / 100
  };
};

const createCoupon = async (data) => {
  const {
    code,
    discountType,
    discountValue,
    minimumOrderAmount = 0,
    maximumDiscount = null,
    usageLimit = null,
    expiryDate
  } = data;

  if (!code || !code.trim()) {
    throw new Error("Coupon code is required");
  }

  if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
    throw new Error("Invalid discount type");
  }

  if (
    typeof discountValue !== "number" ||
    !Number.isFinite(discountValue) ||
    discountValue <= 0
  ) {
    throw new Error("Discount value must be greater than zero");
  }

  if (discountType === "PERCENTAGE" && discountValue > 100) {
    throw new Error("Percentage discount cannot exceed 100");
  }

  if (
    typeof minimumOrderAmount !== "number" ||
    minimumOrderAmount < 0
  ) {
    throw new Error("Invalid minimum order amount");
  }

  if (
    maximumDiscount !== null &&
    (typeof maximumDiscount !== "number" || maximumDiscount < 0)
  ) {
    throw new Error("Invalid maximum discount");
  }

  if (
    usageLimit !== null &&
    (!Number.isInteger(usageLimit) || usageLimit < 1)
  ) {
    throw new Error("Usage limit must be a positive integer");
  }

  if (!expiryDate || isNaN(Date.parse(expiryDate))) {
    throw new Error("Valid expiry date is required");
  }

  if (new Date(expiryDate) <= new Date()) {
    throw new Error("Expiry date must be in the future");
  }

  return Coupon.create({
    code: code.trim().toUpperCase(),
    discountType,
    discountValue,
    minimumOrderAmount,
    maximumDiscount,
    usageLimit,
    expiryDate,
    isActive: true
  });
};

const getCoupons = async () => {
  return Coupon.find().sort({ createdAt: -1 });
};

module.exports = {
  validateCoupon,
  createCoupon,
  getCoupons
};
