const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema({

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

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Temple", templeSchema);