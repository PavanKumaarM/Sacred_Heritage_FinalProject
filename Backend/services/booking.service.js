
const mongoose = require("mongoose");
const crypto = require("crypto");

const DarshanType = require("../models/DarshanType");
const DarshanSlot = require("../models/DarshanSlot");
const DarshanBooking = require("../models/DarshanBooking");

const createBooking = async (userId, data) => {
  const {
    templeId,
    darshanTypeId,
    slotId,
    visitorCount,
    visitorNames = []
  } = data;

  if (
    !mongoose.isValidObjectId(templeId) ||
    !mongoose.isValidObjectId(darshanTypeId) ||
    !mongoose.isValidObjectId(slotId)
  ) {
    throw new Error("Invalid temple, darshan type or slot ID");
  }

  if (!Number.isInteger(visitorCount) || visitorCount < 1) {
    throw new Error("Visitor count must be a positive integer");
  }

  if (!Array.isArray(visitorNames)) {
    throw new Error("Visitor names must be an array");
  }

  if (
    visitorNames.length > 0 &&
    visitorNames.length !== visitorCount
  ) {
    throw new Error("Provide a name for every visitor");
  }

  if (
    visitorNames.some(
      name => typeof name !== "string" || !name.trim()
    )
  ) {
    throw new Error("Invalid visitor name");
  }

  const session = await mongoose.startSession();

  let createdBooking;

  try {
    await session.withTransaction(async () => {
      const darshanType = await DarshanType.findOne({
        _id: darshanTypeId,
        templeId,
        isActive: true
      }).session(session);

      if (!darshanType) {
        throw new Error("Invalid darshan type for this temple");
      }

      // Atomically reserve slot capacity.
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
        {
          new: true,
          session
        }
      );

      if (!slot) {
        throw new Error("Slot unavailable or capacity exceeded");
      }

      const bookingReference =
        `DAR-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

      const [booking] = await DarshanBooking.create(
        [{
          user: userId,
          templeId,
          darshanType: darshanTypeId,
          slot: slotId,
          visitorCount,
          visitorNames: visitorNames.map(name => name.trim()),
          amount: darshanType.price * visitorCount,
          status: darshanType.price === 0 ? "CONFIRMED" : "PENDING",
          bookingReference
        }],
        { session }
      );

      createdBooking = booking;
    });
  } finally {
    await session.endSession();
  }

  return createdBooking;
};

const cancelBooking = async (userId, bookingId) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new Error("Invalid booking ID");
  }

  const session = await mongoose.startSession();

  let cancelledBooking;

  try {
    await session.withTransaction(async () => {
      const booking = await DarshanBooking.findOneAndUpdate(
        {
          _id: bookingId,
          user: userId,
          status: { $in: ["PENDING", "CONFIRMED"] }
        },
        {
          $set: { status: "CANCELLED" }
        },
        {
          new: true,
          session
        }
      );

      if (!booking) {
        throw new Error("Booking not found or already cancelled");
      }

      const result = await DarshanSlot.updateOne(
        {
          _id: booking.slot,
          bookedCount: { $gte: booking.visitorCount }
        },
        {
          $inc: { bookedCount: -booking.visitorCount }
        },
        { session }
      );

      if (result.modifiedCount !== 1) {
        throw new Error("Unable to release slot capacity");
      }

      cancelledBooking = booking;
    });
  } finally {
    await session.endSession();
  }

  return cancelledBooking;
};

module.exports = {
  createBooking,
  cancelBooking
};
