
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">
          <h2>Sacred Heritage</h2>

          <p>
            Discover the spiritual beauty, history and traditions
            of India's sacred temples.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/temples">Explore Temples</Link>
          <Link to="/about">About Us</Link>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>

          <Link to="/products">Temple Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Sacred Heritage.
          All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;
