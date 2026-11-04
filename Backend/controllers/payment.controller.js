
const paymentService = require("../services/payment.service");

exports.createPayment = async (req, res) => {
    const { orderId } = req.body;

    const result = await paymentService.createPayment(
        req.user.id,
        orderId
    );

    res.status(201).json({
        success: true,
        message: result.message,
        data: result
    });
};

exports.getPayment = async (req, res) => {
    const payment = await paymentService.getPayment(
        req.user.id,
        req.params.paymentId
    );

    res.status(200).json({
        success: true,
        data: payment
    });
};
