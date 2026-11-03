
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchOrderById,
  clearSelectedOrder
} from "../redux/slices/ordersSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedOrder, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchOrderById(id));

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, id]);

  if (loading) {
    return <Loader message="Loading order details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedOrder) {
    return <p className="page-container">Order not found.</p>;
  }

  return (
    <div className="page-container">
      <Link to="/my-orders" className="back-link">
        ← Back to My Orders
      </Link>

      <div className="page-heading">
        <h1>Order Details</h1>
        <p>
          Reference: {selectedOrder.orderReference || selectedOrder._id}
        </p>
      </div>

      <div className="order-detail-card">
        <h2>Products</h2>

        {(selectedOrder.items || []).map((item, index) => (
          <div className="checkout-item" key={item._id || index}>
            <span>
              {item.name} × {item.quantity}
            </span>

            <strong>
              ₹{item.price * item.quantity}
            </strong>
          </div>
        ))}

        <hr />

        <p>Subtotal: ₹{selectedOrder.subtotal}</p>
        <p>Discount: ₹{selectedOrder.discount}</p>

        <h3>Total: ₹{selectedOrder.totalAmount}</h3>

        <p>Payment Status: {selectedOrder.paymentStatus}</p>
        <p>Order Status: {selectedOrder.orderStatus}</p>

        <h2>Shipping Address</h2>

        <p>
          {typeof selectedOrder.shippingAddress === "object"
            ? Object.values(selectedOrder.shippingAddress).filter(Boolean).join(", ")
            : selectedOrder.shippingAddress}
        </p>
      </div>
    </div>
  );
}

export default OrderDetails;
