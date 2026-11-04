
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const createPayment = async (userId, orderId) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "PAID") {
    throw new Error("Order is already paid");
  }

  if (order.orderStatus === "CANCELLED") {
    throw new Error("Cannot pay for a cancelled order");
  }

  // Reuse an existing pending demo payment.
  const existingPayment = await Payment.findOne({
    user: userId,
    order: order._id,
    status: "PENDING"
  });

  if (existingPayment) {
    return {
      payment: existingPayment,
      mode: "DEMO",
      message: "A pending demo payment already exists. No real payment processed."
    };
  }

  const payment = await Payment.create({
    user: userId,
    order: order._id,
    amount: order.totalAmount,
    paymentMethod: "DEMO",
    status: "PENDING"
  });

  return {
    payment,
    mode: "DEMO",
    message: "Payment record created. No real payment processed."
  };
};

const getPayment = async (userId, paymentId) => {
  if (!mongoose.isValidObjectId(paymentId)) {
    throw new Error("Invalid payment ID");
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    user: userId
  }).populate("order", "orderReference totalAmount paymentStatus");

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

module.exports = {
  createPayment,
  getPayment
};
