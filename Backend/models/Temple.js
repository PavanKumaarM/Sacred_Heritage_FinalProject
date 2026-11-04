const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    history: {
      type: String,
      default: ""
    },

    deity: {
      type: String,
      required: true
    },

    openingTime: {
      type: String,
      default: "06:00"
    },

    closingTime: {
      type: String,
      default: "21:00"
    },

    image: {
      type: String,
      default: ""
    },

    imageSource: {
      type: String,
      default: ""
    },

    imagePhotographer: {
      type: String,
      default: ""
    },

    imageLicense: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Temple", templeSchema);