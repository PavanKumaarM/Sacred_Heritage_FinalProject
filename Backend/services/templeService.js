
const mongoose = require("mongoose");
const Temple = require("../models/Temple");
const Product = require("../models/Product");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

class TempleService {

    static validateId(id) {
        if (!mongoose.isValidObjectId(id)) {
            throw createError("Invalid temple ID", 400);
        }
    }

    static async createTemple(data) {
        return await Temple.create(data);
    }

    static async getAllTemples() {
        return await Temple.find({ isActive: true })
            .sort({ createdAt: -1 });
    }

    static async getTempleById(id) {
        this.validateId(id);

        const temple = await Temple.findOne({
            _id: id,
            isActive: true
        });

        if (!temple) {
            throw createError("Temple not found", 404);
        }

        return temple;
    }

    // Get temple information along with its products
    static async getTempleDetails(id) {
        const temple = await this.getTempleById(id);

        const products = await Product.find({
            temple: temple._id,
            isActive: true
        })
        .populate("category", "name description image")
        .sort({ createdAt: -1 });

        return {
            temple,
            products,
            productCount: products.length
        };
    }

    static async updateTemple(id, data) {
        this.validateId(id);

        const allowedFields = [
            "name",
            "location",
            "description",
            "history",
            "deity",
            "openingTime",
            "closingTime",
            "image",
            "isActive"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        });

        const temple = await Temple.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!temple) {
            throw createError("Temple not found", 404);
        }

        return temple;
    }

    static async deleteTemple(id) {
        this.validateId(id);

        const temple = await Temple.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!temple) {
            throw createError("Temple not found", 404);
        }

        return temple;
    }
}

module.exports = TempleService;
