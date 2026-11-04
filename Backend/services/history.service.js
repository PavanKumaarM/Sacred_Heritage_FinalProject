
const Order = require("../models/Order");
const DarshanBooking = require("../models/DarshanBooking");

const getHistory = async (userId) => {
  const [orders, bookings] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 }),

    DarshanBooking.find({ user: userId })
      .populate("templeId", "name location")
      .populate("darshanType", "name price")
      .populate("slot", "date startTime endTime")
      .sort({ createdAt: -1 })
  ]);

  return {
    orders,
    bookings
  };
};

const getOrderHistory = async (userId) => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 });
};

const getBookingHistory = async (userId) => {
  return DarshanBooking.find({ user: userId })
    .populate("templeId", "name location")
    .populate("darshanType", "name price")
    .populate("slot", "date startTime endTime")
    .sort({ createdAt: -1 });
};

module.exports = {
  getHistory,
  getOrderHistory,
  getBookingHistory
};
