
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { createOrder } from "../redux/slices/ordersSlice";
import { fetchCart } from "../redux/slices/cartSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const { actionLoading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: ""
  });

  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("DEMO");

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleAddressChange(event) {
    const { name, value } = event.target;

    setShippingAddress((previousAddress) => ({
      ...previousAddress,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const result = await dispatch(
      createOrder({
        shippingAddress,
        couponCode: couponCode.trim(),
        paymentMethod
      })
    );

    if (createOrder.fulfilled.match(result)) {
      dispatch(fetchCart());
      navigate("/my-orders");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="page-container empty-state">
        <h2>Please log in to continue</h2>
        <Link to="/login" className="primary-button">
          Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container empty-state">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="primary-button">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Checkout</h1>
        <p>Enter your delivery details and place your order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Address</h2>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleAddressChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={shippingAddress.phone}
            onChange={handleAddressChange}
            required
          />

          <label>Address</label>
          <textarea
            name="addressLine"
            value={shippingAddress.addressLine}
            onChange={handleAddressChange}
            rows="3"
            required
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            required
          />

          <label>State</label>
          <input
            type="text"
            name="state"
            value={shippingAddress.state}
            onChange={handleAddressChange}
            required
          />

          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleAddressChange}
            required
          />

          <h2>Coupon Code</h2>

          <input
            type="text"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Enter coupon code (optional)"
          />

          <p className="form-hint">
            The backend will validate the coupon and calculate the discount
            when you place the order.
          </p>

          <h2>Payment Method</h2>

          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            required
          >
            <option value="DEMO">Demo Payment</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="RAZORPAY">Razorpay</option>
          </select>

          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            className="primary-button"
            disabled={actionLoading}
          >
            {actionLoading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {items.map((item) => (
            <div className="checkout-item" key={item._id}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <div className="checkout-total">
            <span>Cart Subtotal</span>
            <strong>₹{subtotal}</strong>
          </div>

          <p className="form-hint">
            Final discount and total will be calculated by the backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
