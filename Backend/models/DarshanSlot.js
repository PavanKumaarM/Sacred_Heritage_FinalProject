const mongoose = require("mongoose");

const darshanSlotSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
      index: true
    },
    darshanType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DarshanType",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

darshanSlotSchema.index({
  templeId: 1,
  darshanType: 1,
  date: 1
});

module.exports = mongoose.model("DarshanSlot", darshanSlotSchema);