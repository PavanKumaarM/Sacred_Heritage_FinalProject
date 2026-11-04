const CategoryService = require("../services/categoryService");

exports.createCategory = async (req, res, next) => {
    try {
        const category = await CategoryService.createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await CategoryService.getAllCategories();

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await CategoryService.updateCategory(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const category = await CategoryService.deleteCategory(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category
        });
    } catch (error) {
        next(error);
    }
};