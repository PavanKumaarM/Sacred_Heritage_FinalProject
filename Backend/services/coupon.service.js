const Coupon = require("../models/Coupon");

const calculateCouponDiscount = async (code, subtotal) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase().trim(),
    isActive: true
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (new Date() > coupon.expiryDate) {
    throw new Error("Coupon has expired");
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

  return {
    coupon,
    discount: Math.round(discount * 100) / 100
  };
};

module.exports = {
  calculateCouponDiscount
};