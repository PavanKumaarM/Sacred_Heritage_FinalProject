
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Admin() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name || "Admin"}.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Temples</h2>
          <p>Manage temple information.</p>
          <Link to="/temples" className="secondary-button">
            View Temples
          </Link>
        </div>

        <div className="admin-card">
          <h2>Products</h2>
          <p>View the products available on the platform.</p>
          <Link to="/products" className="secondary-button">
            View Products
          </Link>
        </div>

        <div className="admin-card">
          <h2>Categories</h2>
          <p>Explore product categories.</p>
          <Link to="/products" className="secondary-button">
            View Categories
          </Link>
        </div>

        <div className="admin-card">
          <h2>Bookings</h2>
          <p>View your account's darshan bookings.</p>
          <Link to="/my-bookings" className="secondary-button">
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Admin;
