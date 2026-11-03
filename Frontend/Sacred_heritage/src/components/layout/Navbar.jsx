
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/slices/authSlice";
import { fetchCart } from "../../redux/slices/cartSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const cartCount = (cart?.items || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Sacred Heritage
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/temples">Temples</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="navbar-actions">
        <Link to="/favorites">Favorites</Link>

        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/profile">
              {user?.name || "My Account"}
            </Link>

            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/my-orders">My Orders</Link>

            {user?.role === "admin" && (
              <Link to="/admin">Admin</Link>
            )}

            <button
              onClick={handleLogout}
              className="navbar-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
