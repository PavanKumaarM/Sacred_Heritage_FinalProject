const Order = require("../models/Order");
const DarshanBooking = require("../models/DarshanBooking");

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const [orders, bookings] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 }),

      DarshanBooking.find({ user: userId })
        .populate("templeId", "name location")
        .populate("darshanType", "name price")
        .populate("slot", "date startTime endTime")
        .sort({ createdAt: -1 })
    ]);

    return res.status(200).json({
      success: true,
      history: {
        orders,
        bookings
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getHistory };