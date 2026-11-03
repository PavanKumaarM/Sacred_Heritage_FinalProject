const ReviewService = require("../services/reviewService");

exports.createReview = async (req, res, next) => {

    try {

        const review = await ReviewService.createReview(
            req.params.productId,
            req.user._id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            data: review
        });

    } catch (error) {
        next(error);
    }
};

exports.getProductReviews = async (req, res, next) => {

    try {

        const reviews = await ReviewService.getProductReviews(
            req.params.productId
        );

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });

    } catch (error) {
        next(error);
    }
};

exports.updateReview = async (req, res, next) => {

    try {

        const review = await ReviewService.updateReview(
            req.params.reviewId,
            req.user._id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteReview = async (req, res, next) => {

    try {

        const result = await ReviewService.deleteReview(
            req.params.reviewId,
            req.user._id
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};