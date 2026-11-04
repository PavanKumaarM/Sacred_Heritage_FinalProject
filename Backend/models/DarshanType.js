const mongoose = require("mongoose");

const darshanTypeSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    durationMinutes: {
      type: Number,
      default: 30
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

darshanTypeSchema.index({ templeId: 1, name: 1 });

module.exports = mongoose.model("DarshanType", darshanTypeSchema);