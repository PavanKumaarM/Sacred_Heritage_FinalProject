const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

// Create review
router.post(
    "/product/:productId",
    authMiddleware,
    reviewController.createReview
);

// Get product reviews
router.get(
    "/product/:productId",
    reviewController.getProductReviews
);

// Update review
router.patch(
    "/:reviewId",
    authMiddleware,
    reviewController.updateReview
);

// Delete review
router.delete(
    "/:reviewId",
    authMiddleware,
    reviewController.deleteReview
);

module.exports = router;