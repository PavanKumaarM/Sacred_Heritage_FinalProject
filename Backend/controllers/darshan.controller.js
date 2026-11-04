const DarshanType = require("../models/DarshanType");
const DarshanSlot = require("../models/DarshanSlot");

const getDarshanTypes = async (req, res) => {
  try {
    const types = await DarshanType.find({
      templeId: req.params.templeId,
      isActive: true
    });

    res.status(200).json({
      success: true,
      types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { templeId, darshanTypeId, date } = req.query;

    if (!templeId || !darshanTypeId || !date) {
      return res.status(400).json({
        success: false,
        message: "templeId, darshanTypeId and date are required"
      });
    }

    const slots = await DarshanSlot.find({
      templeId,
      darshanType: darshanTypeId,
      date: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lt: new Date(`${date}T23:59:59.999Z`)
      },
      isActive: true,
      $expr: {
        $lt: ["$bookedCount", "$capacity"]
      }
    }).sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      slots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDarshanTypes,
  getAvailableSlots
};