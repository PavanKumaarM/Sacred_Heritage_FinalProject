const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    paymentMethod: {
      type: String,
      enum: ["RAZORPAY", "UPI", "CARD", "CASH", "DEMO"],
      default: "DEMO"
    },

    gatewayOrderId: {
      type: String,
      default: null
    },

    gatewayPaymentId: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING"
    },

    verifiedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);