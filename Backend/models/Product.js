const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
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

    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
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

productSchema.index({ temple: 1, category: 1 });

module.exports = mongoose.model("Product", productSchema);