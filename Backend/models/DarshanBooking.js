const mongoose = require("mongoose");

const darshanBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true
    },
    darshanType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DarshanType",
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DarshanSlot",
      required: true
    },
    visitorCount: {
      type: Number,
      required: true,
      min: 1
    },
    visitorNames: [{
      type: String,
      trim: true
    }],
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING"
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DarshanBooking", darshanBookingSchema);