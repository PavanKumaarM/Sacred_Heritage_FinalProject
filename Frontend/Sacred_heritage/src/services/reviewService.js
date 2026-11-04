
import api from "./api";

// Get all reviews for a product
const getProductReviews = async (productId) => {
  return api.get(`/reviews/product/${productId}`);
};

// Add a review for a product
const createReview = async (productId, reviewData) => {
  return api.post(`/reviews/product/${productId}`, reviewData);
};

// Update an existing review
const updateReview = async (reviewId, reviewData) => {
  return api.patch(`/reviews/${reviewId}`, reviewData);
};

// Delete an existing review
const deleteReview = async (reviewId) => {
  return api.delete(`/reviews/${reviewId}`);
};

const reviewService = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};

export default reviewService;
