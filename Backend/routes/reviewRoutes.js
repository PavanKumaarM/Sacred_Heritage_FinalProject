const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

// Create review - Login required
router.post(
    "/product/:productId",
    protect,
    asyncHandler(reviewController.createReview)
);

// Get product reviews - Public
router.get(
    "/product/:productId",
    asyncHandler(reviewController.getProductReviews)
);

// Update review - Login required
router.patch(
    "/:reviewId",
    protect,
    asyncHandler(reviewController.updateReview)
);

// Delete review - Login required
router.delete(
    "/:reviewId",
    protect,
    asyncHandler(reviewController.deleteReview)
);

module.exports = router;