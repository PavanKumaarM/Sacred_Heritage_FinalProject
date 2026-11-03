const ProductService = require("../services/productService");

exports.createProduct = async (req, res, next) => {

    try {

        const product = await ProductService.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: product
        });

    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {

    try {

        const result = await ProductService.getAllProducts(req.query);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {

    try {

        const product = await ProductService.getProductById(req.params.id);

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        next(error);
    }
};

exports.getProductsByTemple = async (req, res, next) => {

    try {

        const result = await ProductService.getProductsByTemple(
            req.params.templeId,
            req.query
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {

    try {

        const product = await ProductService.updateProduct(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {

    try {

        const product = await ProductService.deleteProduct(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deactivated successfully",
            data: product
        });

    } catch (error) {
        next(error);
    }
};