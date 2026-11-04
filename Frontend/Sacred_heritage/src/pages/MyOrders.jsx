
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchMyOrders } from "../redux/slices/ordersSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function MyOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return <Loader message="Loading your orders..." />;
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>My Orders</h1>
        <p>Track your temple product purchases.</p>
      </div>

      {error && <ErrorMessage message={error} />}

      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders found</h2>
          <p>You haven't placed any orders yet.</p>

          <Link to="/products" className="primary-button">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>
                Order Reference: {order.orderReference || order._id}
              </h3>

              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <p>
                <strong>Payment:</strong> {order.paymentStatus}
              </p>

              <p>
                <strong>Order Status:</strong> {order.orderStatus}
              </p>

              <Link
                to={`/my-orders/${order._id}`}
                className="secondary-button"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
