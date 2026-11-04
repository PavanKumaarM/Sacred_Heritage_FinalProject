
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");

const couponService = require("./coupon.service");

const createOrder = async (userId, data) => {
  const { shippingAddress, couponCode, paymentMethod } = data;

  if (
    typeof shippingAddress !== "string" ||
    !shippingAddress.trim()
  ) {
    throw new Error("Shipping address is required");
  }

  const session = await mongoose.startSession();

  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      let subtotal = 0;
      const orderItems = [];

      // Read current product prices and details.
      for (const item of cart.items) {
        const product = await Product.findOne({
          _id: item.productId,
          isActive: true
        }).session(session);

        if (!product) {
          throw new Error(`Product unavailable: ${item.name}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        subtotal += product.price * item.quantity;

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.image
        });
      }

      subtotal = Math.round(subtotal * 100) / 100;

      let discount = 0;
      let coupon = null;

      // Validate and reserve coupon usage.
      if (couponCode) {
        const result = await couponService.validateCoupon(
          couponCode,
          subtotal,
          session
        );

        coupon = result.coupon;
        discount = result.discount;

        const couponQuery = {
          _id: coupon._id,
          isActive: true,
          expiryDate: { $gt: new Date() },
          $or: [
            { usageLimit: null },
            { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
          ]
        };

        const reservedCoupon = await Coupon.findOneAndUpdate(
          couponQuery,
          { $inc: { usedCount: 1 } },
          { new: true, session }
        );

        if (!reservedCoupon) {
          throw new Error("Coupon is no longer available");
        }
      }

      // Reserve product stock atomically.
      for (const item of orderItems) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            isActive: true,
            stock: { $gte: item.quantity }
          },
          {
            $inc: { stock: -item.quantity }
          },
          {
            new: true,
            session
          }
        );

        if (!updatedProduct) {
          throw new Error(`Stock unavailable for ${item.name}`);
        }
      }

      const totalAmount = Math.round(
        (subtotal - discount) * 100
      ) / 100;

      const orderReference =
        `ORD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

      const [order] = await Order.create(
        [{
          user: userId,
          items: orderItems,
          subtotal,
          discount,
          totalAmount,
          coupon: coupon ? coupon._id : null,
          couponCode: coupon ? coupon.code : null,
          paymentStatus: "PENDING",
          orderStatus: "PLACED",
          paymentMethod: paymentMethod || "NOT_SELECTED",
          shippingAddress: shippingAddress.trim(),
          orderReference
        }],
        { session }
      );

      // Clear cart inside the same transaction.
      cart.items = [];
      await cart.save({ session });

      createdOrder = order;
    });
  } finally {
    await session.endSession();
  }

  return createdOrder;
};

const getMyOrders = async (userId) => {
  return Order.find({ user: userId })
    .populate("items.productId", "name image price")
    .sort({ createdAt: -1 });
};

const getOrderById = async (userId, orderId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  }).populate("items.productId", "name image price");

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
