
const mongoose = require("mongoose");
const Category = require("../models/Category");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

class CategoryService {

    static validateId(id) {
        if (!mongoose.isValidObjectId(id)) {
            throw createError("Invalid category ID", 400);
        }
    }

    static async createCategory(data) {
        return await Category.create(data);
    }

    static async getAllCategories() {
        return await Category.find({
            isActive: true
        }).sort({ name: 1 });
    }

    static async updateCategory(id, data) {
        this.validateId(id);

        const allowedFields = [
            "name",
            "description",
            "image",
            "isActive"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        });

        const category = await Category.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            throw createError("Category not found", 404);
        }

        return category;
    }

    static async deleteCategory(id) {
        this.validateId(id);

        const category = await Category.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!category) {
            throw createError("Category not found", 404);
        }

        return category;
    }
}

module.exports = CategoryService;
