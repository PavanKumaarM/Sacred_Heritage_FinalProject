
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductById,
  clearSelectedProduct,
} from "../redux/slices/productsSlice";

import {
  fetchReviews,
  addReview,
} from "../redux/slices/reviewsSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const {
    reviews,
    loading: reviewLoading,
    error: reviewError,
  } = useSelector((state) => state.reviews);

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchReviews(id));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    setReviewMessage("");

    if (!comment.trim()) {
      setReviewMessage("Please enter your review.");
      return;
    }

    try {
      await dispatch(
        addReview({
          productId: id,
          reviewData: {
            rating: Number(rating),
            comment: comment.trim(),
          },
        })
      ).unwrap();

      setComment("");
      setRating(5);
      setReviewMessage("Review submitted successfully!");

      // Reload reviews and updated product rating
      dispatch(fetchReviews(id));
      dispatch(fetchProductById(id));

    } catch (error) {
      setReviewMessage(error || "Unable to submit review.");
    }
  };

  if (loading) {
    return <Loader message="Loading product details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchProductById(id))}
      />
    );
  }

  if (!selectedProduct) {
    return (
      <div className="empty-message">
        Product details are not available.
      </div>
    );
  }

  const product = selectedProduct;

  return (
    <div className="product-details-page">

      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-details-container">

        <div className="product-details-image">
          <img
            src={product.image || "/product-placeholder.png"}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/product-placeholder.png";
            }}
          />
        </div>

        <div className="product-details-info">

          <p className="details-subtitle">
            SACRED HERITAGE COLLECTION
          </p>

          <h1>{product.name}</h1>

          <p className="product-rating">
            ⭐ {product.averageRating || 0}
            ({product.totalReviews || 0} reviews)
          </p>

          <h2 className="product-details-price">
            ₹{product.price}
          </h2>

          <p>{product.description}</p>

          <p>
            <strong>Temple:</strong>{" "}
            {product.temple?.name || "Not specified"}
          </p>

          <p>
            <strong>Category:</strong>{" "}
            {product.category?.name || "Not specified"}
          </p>

          <p>
            <strong>Availability:</strong>{" "}
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>

          {product.temple?._id && (
            <Link
              to={`/temples/${product.temple._id}`}
              className="temple-product-link"
            >
              View Temple
            </Link>
          )}

        </div>

      </div>

      {/* Reviews section */}
      <section className="reviews-section">

        <h2>Customer Reviews</h2>

        {reviewLoading && (
          <Loader message="Loading reviews..." />
        )}

        {!reviewLoading && reviewError && (
          <ErrorMessage
            message={reviewError}
            onRetry={() => dispatch(fetchReviews(id))}
          />
        )}

        {!reviewLoading && !reviewError && reviews.length === 0 && (
          <p>No reviews yet. Be the first to review this product.</p>
        )}

        {!reviewLoading && !reviewError && reviews.length > 0 && (
          <div className="reviews-list">

            {reviews.map((review) => (
              <div className="review-card" key={review._id}>

                <h4>
                  {review.user?.name || "Customer"}
                </h4>

                <p className="review-rating">
                  {"⭐".repeat(review.rating)}
                </p>

                <p>{review.comment}</p>

              </div>
            ))}

          </div>
        )}

        {/* Review form */}
        {isAuthenticated ? (
          <form
            className="review-form"
            onSubmit={handleReviewSubmit}
          >

            <h3>Write a Review</h3>

            <label>Rating</label>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Average</option>
              <option value="1">1 - Poor</option>
            </select>

            <label>Your Review</label>

            <textarea
              rows="4"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button type="submit">
              Submit Review
            </button>

            {reviewMessage && (
              <p>{reviewMessage}</p>
            )}

          </form>
        ) : (
          <p>
            Please <Link to="/login">login</Link> to write a review.
          </p>
        )}

      </section>

    </div>
  );
}

export default ProductDetails;
