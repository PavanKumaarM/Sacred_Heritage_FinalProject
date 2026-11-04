const Review = require("../models/Review");
const Product = require("../models/Product");

class ReviewService {

    static async updateProductRating(productId) {

        const result = await Review.aggregate([

            {
                $match: {
                    product: productId
                }
            },

            {
                $group: {
                    _id: "$product",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }

        ]);

        const rating = result.length > 0
            ? result[0].averageRating
            : 0;

        const total = result.length > 0
            ? result[0].totalReviews
            : 0;

        await Product.findByIdAndUpdate(productId, {
            averageRating: Number(rating.toFixed(1)),
            totalReviews: total
        });
    }

    static async createReview(productId, userId, data) {

        const product = await Product.findOne({
            _id: productId,
            isActive: true
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const review = await Review.create({

            product: productId,
            user: userId,
            rating: data.rating,
            comment: data.comment

        });

        await this.updateProductRating(productId);

        return review;
    }

    static async getProductReviews(productId) {

        return await Review.find({
            product: productId
        })
        .populate("user", "name")
        .sort({ createdAt: -1 });
    }

    static async updateReview(reviewId, userId, data) {

        const review = await Review.findById(reviewId);

        if (!review) {
            throw new Error("Review not found");
        }

        if (review.user.toString() !== userId.toString()) {
            throw new Error("You can update only your own review");
        }

        if (data.rating !== undefined) review.rating = data.rating;
        if (data.comment !== undefined) review.comment = data.comment;

        await review.save();

        await this.updateProductRating(review.product);

        return review;
    }

    static async deleteReview(reviewId, userId) {

        const review = await Review.findById(reviewId);

        if (!review) {
            throw new Error("Review not found");
        }

        if (review.user.toString() !== userId.toString()) {
            throw new Error("You can delete only your own review");
        }

        const productId = review.product;

        await review.deleteOne();

        await this.updateProductRating(productId);

        return { message: "Review deleted successfully" };
    }
}

module.exports = ReviewService;