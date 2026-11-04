const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: String
      }
    ],

    subtotal: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null
    },

    couponCode: {
      type: String,
      default: null
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING"
    },

    orderStatus: {
      type: String,
      enum: [
        "PLACED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PLACED"
    },

    paymentMethod: {
      type: String,
      default: "NOT_SELECTED"
    },

    shippingAddress: {
      type: String,
      required: true
    },

    orderReference: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);