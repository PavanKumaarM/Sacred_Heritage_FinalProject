
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/slices/authSlice";
import { fetchCart } from "../../redux/slices/cartSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { cart } = useSelector((state) => state.cart);

  // Fetch cart when user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cartCount = (cart?.items || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Get first letter of username
  const avatarLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  // Logout functionality
  function handleLogout() {
    dispatch(logout());
    setShowDropdown(false);
    navigate("/login");
  }

  // Navigate to profile
  function handleProfile() {
    setShowDropdown(false);
    navigate("/profile");
  }

  return (
    <nav className="navbar">

      {/* Logo */}
      <Link to="/" className="navbar-brand">
        Sacred Heritage
      </Link>

      {/* Main Navigation */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/temples">Temples</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
      </div>

      {/* Right Navigation */}
      <div className="navbar-actions">

        <Link to="/favorites">Favorites</Link>

        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/my-bookings">My Bookings</Link>
            <Link to="/my-orders">My Orders</Link>

            {user?.role === "admin" && (
              <Link to="/admin">Admin</Link>
            )}

            {/* Avatar Dropdown */}
            <div className="avatar-dropdown" ref={dropdownRef}>

              <button
                type="button"
                className="avatar-button"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Open account menu"
                aria-expanded={showDropdown}
              >
                {avatarLetter}
              </button>

              {showDropdown && (
                <div className="avatar-menu">

                  {/* Static Username */}
                  <div className="avatar-user-info">
                    <div className="avatar-menu-letter">
                      {avatarLetter}
                    </div>

                    <div className="avatar-user-details">
                      <p className="avatar-user-name">
                        {user?.name || "User"}
                      </p>

                      <span>
                        {user?.email || ""}
                      </span>
                    </div>
                  </div>

                  <div className="avatar-menu-divider"></div>

                  {/* Profile */}
                  <button
                    type="button"
                    className="avatar-menu-item"
                    onClick={handleProfile}
                  >
                    <span>👤</span>
                    My Profile
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    className="avatar-menu-item logout-menu-item"
                    onClick={handleLogout}
                  >
                    <span>↪</span>
                    Logout
                  </button>

                </div>
              )}
            </div>
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
