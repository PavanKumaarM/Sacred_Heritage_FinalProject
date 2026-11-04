const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const {
  calculateCouponDiscount
} = require("../services/coupon.service");

const createOrder = async (req, res) => {
  let reservedCouponId = null;

  try {
    const userId = req.user.id || req.user._id;

    const { shippingAddress, couponCode, paymentMethod } = req.body;

    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart || !cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty"
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findOne({
        _id: item.productId,
        isActive: true
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product unavailable: ${item.name}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const price = product.price;

      subtotal += price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        image: product.image
      });
    }

    let discount = 0;
    let coupon = null;

    if (couponCode) {
      const result = await calculateCouponDiscount(
        couponCode,
        subtotal
      );

      coupon = result.coupon;
      discount = result.discount;

      // Reserve one coupon use atomically.
      const reservedCoupon = await Coupon.findOneAndUpdate(
        {
          _id: coupon._id,
          isActive: true,
          expiryDate: { $gte: new Date() },
          $or: [
            { usageLimit: null },
            { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
          ]
        },
        { $inc: { usedCount: 1 } },
        { new: true }
      );

      if (!reservedCoupon) {
        return res.status(409).json({
          success: false,
          message: "Coupon usage limit reached or coupon expired"
        });
      }

      reservedCouponId = reservedCoupon._id;
    }

    const totalAmount = Math.max(0, subtotal - discount);

    const order = await Order.create({
      user: userId,
      items: orderItems,
      subtotal,
      discount,
      totalAmount,
      coupon: coupon?._id || null,
      couponCode: coupon?.code || null,
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
      paymentMethod: paymentMethod || "NOT_SELECTED",
      shippingAddress: shippingAddress.trim(),
      orderReference:
        `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    });

    // Clear the cart only after order creation succeeds.
    await Cart.updateOne(
      { user: userId },
      { $set: { items: [] } }
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully. Payment is pending.",
      order
    });
  } catch (error) {
    // Release coupon reservation if order creation failed.
    if (reservedCouponId) {
      await Coupon.updateOne(
        { _id: reservedCouponId, usedCount: { $gt: 0 } },
        { $inc: { usedCount: -1 } }
      );
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};