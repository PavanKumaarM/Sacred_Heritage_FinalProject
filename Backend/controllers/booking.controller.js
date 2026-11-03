const mongoose = require("mongoose");
const DarshanType = require("../models/DarshanType");
const DarshanSlot = require("../models/DarshanSlot");
const DarshanBooking = require("../models/DarshanBooking");

const createBooking = async (req, res) => {
  try {
    const {
      templeId,
      darshanTypeId,
      slotId,
      visitorCount,
      visitorNames
    } = req.body;

    const userId = req.user.id || req.user._id;

    if (
      !mongoose.isValidObjectId(templeId) ||
      !mongoose.isValidObjectId(darshanTypeId) ||
      !mongoose.isValidObjectId(slotId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid temple, darshan type or slot ID"
      });
    }

    if (!Number.isInteger(visitorCount) || visitorCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Visitor count must be at least 1"
      });
    }

    const darshanType = await DarshanType.findOne({
      _id: darshanTypeId,
      templeId,
      isActive: true
    });

    if (!darshanType) {
      return res.status(404).json({
        success: false,
        message: "Darshan type not found for this temple"
      });
    }

    // Atomically reserve capacity only if enough slots remain.
    const slot = await DarshanSlot.findOneAndUpdate(
      {
        _id: slotId,
        templeId,
        darshanType: darshanTypeId,
        isActive: true,
        $expr: {
          $lte: [
            { $add: ["$bookedCount", visitorCount] },
            "$capacity"
          ]
        }
      },
      {
        $inc: { bookedCount: visitorCount }
      },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({
        success: false,
        message: "Slot unavailable or insufficient capacity"
      });
    }

    try {
      const booking = await DarshanBooking.create({
        user: userId,
        templeId,
        darshanType: darshanTypeId,
        slot: slotId,
        visitorCount,
        visitorNames: visitorNames || [],
        amount: darshanType.price * visitorCount,
        status: "CONFIRMED",
        bookingReference:
          `DAR-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      });

      return res.status(201).json({
        success: true,
        message: "Darshan booking created successfully",
        booking
      });
    } catch (error) {
      // Release reserved capacity if booking creation fails.
      await DarshanSlot.updateOne(
        {
          _id: slotId,
          bookedCount: { $gte: visitorCount }
        },
        { $inc: { bookedCount: -visitorCount } }
      );

      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Only transition a non-cancelled booking once.
    const booking = await DarshanBooking.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
        status: { $in: ["PENDING", "CONFIRMED"] }
      },
      {
        $set: { status: "CANCELLED" }
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or already cancelled"
      });
    }

    const slotUpdate = await DarshanSlot.updateOne(
      {
        _id: booking.slot,
        bookedCount: { $gte: booking.visitorCount }
      },
      {
        $inc: { bookedCount: -booking.visitorCount }
      }
    );

    if (slotUpdate.modifiedCount !== 1) {
      // Flag an inconsistency for administrative reconciliation.
      return res.status(409).json({
        success: false,
        message: "Booking cancelled, but slot capacity needs reconciliation",
        booking
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  cancelBooking
};