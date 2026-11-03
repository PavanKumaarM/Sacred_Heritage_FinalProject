
import api from "./api";

const getProductReviews = async (productId) => {
  return await api.get(`/reviews/product/${productId}`);
};

const createReview = async (productId, reviewData) => {
  return await api.post(
    `/reviews/product/${productId}`,
    reviewData
  );
};

const updateReview = async (reviewId, reviewData) => {
  return await api.patch(`/reviews/${reviewId}`, reviewData);
};

const deleteReview = async (reviewId) => {
  return await api.delete(`/reviews/${reviewId}`);
};

const reviewService = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
};

export default reviewService;
