
const mongoose = require("mongoose");

const Product = require("../models/Product");
const Temple = require("../models/Temple");
const Category = require("../models/Category");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

class ProductService {

    static validateId(id, field = "product") {
        if (!mongoose.isValidObjectId(id)) {
            throw createError(`Invalid ${field} ID`, 400);
        }
    }

    static async validateReferences(data) {
        if (data.temple) {
            this.validateId(data.temple, "temple");

            const temple = await Temple.findOne({
                _id: data.temple,
                isActive: true
            });

            if (!temple) {
                throw createError("Temple not found", 404);
            }
        }

        if (data.category) {
            this.validateId(data.category, "category");

            const category = await Category.findOne({
                _id: data.category,
                isActive: true
            });

            if (!category) {
                throw createError("Category not found", 404);
            }
        }
    }

    static async createProduct(data) {
        await this.validateReferences(data);

        return await Product.create(data);
    }

    static async getAllProducts(query = {}) {

        const {
            search,
            temple,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12
        } = query;

        const filter = {
            isActive: true
        };

        if (temple) {
            this.validateId(temple, "temple");
            filter.temple = temple;
        }

        if (category) {
            this.validateId(category, "category");
            filter.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {

            const min = minPrice === undefined ? undefined : Number(minPrice);
            const max = maxPrice === undefined ? undefined : Number(maxPrice);

            if (
                (min !== undefined && (!Number.isFinite(min) || min < 0)) ||
                (max !== undefined && (!Number.isFinite(max) || max < 0))
            ) {
                throw createError("Invalid price filter", 400);
            }

            if (min !== undefined && max !== undefined && min > max) {
                throw createError("Minimum price cannot exceed maximum price", 400);
            }

            filter.price = {};

            if (min !== undefined) filter.price.$gte = min;
            if (max !== undefined) filter.price.$lte = max;
        }

        if (search && search.trim()) {
            const escapedSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.name = {
                $regex: escapedSearch,
                $options: "i"
            };
        }

        const sortOptions = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            rating: { averageRating: -1 },
            newest: { createdAt: -1 }
        };

        const sortBy = sortOptions[sort] || { createdAt: -1 };

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.min(100, Math.max(1, Number(limit) || 12));

        const skip = (pageNumber - 1) * limitNumber;

        const [products, total] = await Promise.all([

            Product.find(filter)
                .populate("temple", "name location image")
                .populate("category", "name description image")
                .sort(sortBy)
                .skip(skip)
                .limit(limitNumber),

            Product.countDocuments(filter)

        ]);

        return {
            products,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber)
            }
        };
    }

    static async getProductById(id) {

        this.validateId(id);

        const product = await Product.findOne({
            _id: id,
            isActive: true
        })
        .populate(
            "temple",
            "name location description history deity openingTime closingTime image"
        )
        .populate("category", "name description image");

        if (!product) {
            throw createError("Product not found", 404);
        }

        return product;
    }

    static async getProductsByTemple(templeId, query = {}) {

        this.validateId(templeId, "temple");

        const temple = await Temple.findOne({
            _id: templeId,
            isActive: true
        });

        if (!temple) {
            throw createError("Temple not found", 404);
        }

        return await this.getAllProducts({
            ...query,
            temple: templeId
        });
    }

    static async updateProduct(id, data) {

        this.validateId(id);

        await this.validateReferences(data);

        const allowedFields = [
            "temple",
            "category",
            "name",
            "description",
            "price",
            "stock",
            "image",
            "isActive"
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        });

        const product = await Product.findByIdAndUpdate(
            id,
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        )
        .populate("temple", "name location image")
        .populate("category", "name description image");

        if (!product) {
            throw createError("Product not found", 404);
        }

        return product;
    }

    static async deleteProduct(id) {

        this.validateId(id);

        const product = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            throw createError("Product not found", 404);
        }

        return product;
    }
}

module.exports = ProductService;
