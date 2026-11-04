
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { addToCart } from "../../redux/slices/cartSlice";

import {
  addFavorite,
  removeFavorite
} from "../../redux/slices/favoritesSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { actionLoading } = useSelector(
    (state) => state.cart
  );

  const favorites = useSelector(
    (state) => state.favorites.favorites
  );

  // Check whether this product is already in favorites
  const isFavorite = favorites.some(
    (item) => item._id === product._id
  );

  // Add or remove favorite
  function handleFavorite() {
    if (isFavorite) {
      dispatch(removeFavorite(product._id));
    } else {
      dispatch(addFavorite(product));
    }
  }

  // Add product to cart
  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1
      })
    );
  }

  // Product image fallback
  const productImage =
    product.image || "/placeholder-product.jpg";

  return (
    <div className="product-card">

      {/* Product Image */}
      <Link
        to={`/products/${product._id}`}
        className="product-card-image-link"
      >
        <div className="product-card-image-container">
          <img
            src={productImage}
            alt={product.name}
            className="product-card-image"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                "/placeholder-product.jpg";
            }}
          />
        </div>
      </Link>

      {/* Product Information */}
      <div className="product-card-content">

        <p className="product-temple-name">
          {product.temple?.name || "Sacred Heritage"}
        </p>

        <Link
          to={`/products/${product._id}`}
          className="product-card-title"
        >
          {product.name}
        </Link>

        <p className="product-card-description">
          {product.description || "Explore this sacred product."}
        </p>

        {/* Rating */}
        <div className="product-rating">
          <span>★</span>
          <strong>
            {Number(product.averageRating || 0).toFixed(1)}
          </strong>
          <span className="review-count">
            ({product.totalReviews || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="product-price">
          ₹{product.price}
        </div>

        {/* Actions */}
        <div className="product-card-actions">

          <button
            type="button"
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={actionLoading || product.stock === 0}
          >
            {product.stock === 0
              ? "Out of Stock"
              : actionLoading
                ? "Adding..."
                : "Add to Cart"}
          </button>

          <button
            type="button"
            className={
              isFavorite
                ? "favorite-button active"
                : "favorite-button"
            }
            onClick={handleFavorite}
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            title={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isFavorite ? "♥" : "♡"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;
