
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../redux/slices/cartSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading, error, actionLoading } = useSelector(
    (state) => state.cart
  );

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const items = cart?.items || [];

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleQuantityChange = (item, quantity) => {
    if (quantity >= 1) {
      dispatch(
        updateCartItem({
          itemId: item._id,
          quantity,
        })
      );
    }
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  if (!isAuthenticated) {
    return (
      <div className="empty-message">
        <h2>Please login to view your cart</h2>

        <Link to="/login">Login Now</Link>
      </div>
    );
  }

  if (loading) {
    return <Loader message="Loading your cart..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchCart())}
      />
    );
  }

  return (
    <div className="cart-page">

      <div className="page-heading">
        <p>YOUR SHOPPING BAG</p>
        <h1>Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="empty-message">
          <h2>Your cart is empty</h2>

          <p>Explore our sacred products and add something special.</p>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">

          <div className="cart-items">

            {items.map((item) => (
              <div className="cart-item" key={item._id}>

                <img
                  src={
                    item.image ||
                    item.productId?.image ||
                    "/product-placeholder.png"
                  }
                  alt={item.name}
                />

                <div className="cart-item-details">

                  <h3>
                    {item.name || item.productId?.name}
                  </h3>

                  <p>₹{item.price}</p>

                  <div className="quantity-control">

                    <button
                      disabled={actionLoading || item.quantity <= 1}
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      disabled={actionLoading}
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove-button"
                    disabled={actionLoading}
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>

                </div>

                <p className="cart-item-total">
                  ₹{item.price * item.quantity}
                </p>

              </div>
            ))}

            <button
              className="clear-cart-button"
              disabled={actionLoading}
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>

          </div>

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <span>
                {items.reduce(
                  (total, item) => total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{subtotal}</strong>
            </div>        
            <Link to="/checkout" className="primary-button">
            Proceed to Checkout
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;
