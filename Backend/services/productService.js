const Product = require("../models/Product");
const Temple = require("../models/Temple");
const Category = require("../models/Category");

class ProductService {

    static async createProduct(data) {

        const temple = await Temple.findOne({
            _id: data.temple,
            isActive: true
        });

        if (!temple) {
            throw new Error("Temple not found");
        }

        const category = await Category.findOne({
            _id: data.category,
            isActive: true
        });

        if (!category) {
            throw new Error("Category not found");
        }

        return await Product.create(data);
    }

    static async getAllProducts(query) {

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
            filter.temple = temple;
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {

            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        if (search) {
            filter.name = {
                $regex: search,
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
                .populate("temple", "name location")
                .populate("category", "name")
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

        const product = await Product.findOne({
            _id: id,
            isActive: true
        })
        .populate("temple", "name location")
        .populate("category", "name");

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }

    static async getProductsByTemple(templeId, query = {}) {

        const temple = await Temple.findOne({
            _id: templeId,
            isActive: true
        });

        if (!temple) {
            throw new Error("Temple not found");
        }

        return await this.getAllProducts({
            ...query,
            temple: templeId
        });
    }

    static async updateProduct(id, data) {

        if (data.temple) {
            const temple = await Temple.findOne({
                _id: data.temple,
                isActive: true
            });

            if (!temple) {
                throw new Error("Temple not found");
            }
        }

        if (data.category) {
            const category = await Category.findOne({
                _id: data.category,
                isActive: true
            });

            if (!category) {
                throw new Error("Category not found");
            }
        }

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
        );

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }

    static async deleteProduct(id) {

        const product = await Product.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }
}

module.exports = ProductService;