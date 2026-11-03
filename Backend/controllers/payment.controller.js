const Order = require("../models/Order");
const Payment = require("../models/Payment");
const httpError = require("../utils/httpError");

// Make payment
exports.payForOrder = async (req, res) => {
    const { orderId, method } = req.body;

    if (!["UPI", "CARD", "NETBANKING", "CASH"].includes(method)) {
        throw httpError(400, "Invalid payment method");
    }

    const order = await Order.findOne({
        _id: orderId,
        user: req.user.id
    });

    if (!order) throw httpError(404, "Order not found");

    if (order.status === "CANCELLED") {
        throw httpError(400, "Order is cancelled");
    }

    if (order.paymentStatus === "PAID") {
        throw httpError(400, "Already paid");
    }

    // DEMO ONLY: Simulates successful payment.
    const payment = await Payment.create({
        user: req.user.id,
        order: order._id,
        amount: order.total,
        method,
        status: "SUCCESS",
        transactionReference:
            `DEMO-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    });

    order.paymentStatus = "PAID";
    order.status = "CONFIRMED";

    await order.save();

    res.status(201).json({
        success: true,
        message: "Demo payment successful",
        data: {
            payment,
            order
        }
    });
};

// Get payment details
exports.getPayment = async (req, res) => {
    const payment = await Payment.findOne({
        _id: req.params.paymentId,
        user: req.user.id
    });

    if (!payment) throw httpError(404, "Payment not found");

    res.json({
        success: true,
        data: payment
    });
};