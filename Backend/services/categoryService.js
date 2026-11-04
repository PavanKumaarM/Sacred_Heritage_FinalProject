const Category = require("../models/Category");

class CategoryService {

    static async createCategory(data) {
        return await Category.create(data);
    }

    static async getAllCategories() {
        return await Category.find({
            isActive: true
        }).sort({ name: 1 });
    }

    static async updateCategory(id, data) {

        const allowedFields = ["name", "description", "image", "isActive"];

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
            throw new Error("Category not found");
        }

        return category;
    }

    static async deleteCategory(id) {

        const category = await Category.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!category) {
            throw new Error("Category not found");
        }

        return category;
    }
}

module.exports = CategoryService;