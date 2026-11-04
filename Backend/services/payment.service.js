const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// Create payment
const createPayment = async (userId, orderId) => {

    if (!mongoose.isValidObjectId(orderId)) {
        throw createError("Invalid order ID", 400);
    }

    const order = await Order.findOne({
        _id: orderId,
        user: userId
    });

    if (!order) {
        throw createError("Order not found", 404);
    }

    if (order.paymentStatus === "PAID") {
        throw createError("Order is already paid", 400);
    }

    if (order.orderStatus === "CANCELLED") {
        throw createError(
            "Cannot pay for a cancelled order",
            400
        );
    }

    // Check existing pending payment
    const existingPayment = await Payment.findOne({
        user: userId,
        order: order._id,
        status: "PENDING"
    });

    if (existingPayment) {
        return {
            payment: existingPayment,
            mode: "DEMO",
            reused: true,
            message: "Existing pending payment found. No new payment created."
        };
    }

    // Create new demo payment
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
        reused: false,
        message: "Demo payment created. No real payment processed."
    };
};

// Get payment
const getPayment = async (userId, paymentId) => {

    if (!mongoose.isValidObjectId(paymentId)) {
        throw createError("Invalid payment ID", 400);
    }

    const payment = await Payment.findOne({
        _id: paymentId,
        user: userId
    }).populate(
        "order",
        "orderReference totalAmount paymentStatus"
    );

    if (!payment) {
        throw createError("Payment not found", 404);
    }

    return payment;
};

module.exports = {
    createPayment,
    getPayment
};