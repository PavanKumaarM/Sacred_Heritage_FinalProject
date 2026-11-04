
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ favoritesCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="navbar-container">

        {/* Website Logo */}
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon">ॐ</span>

          <span className="brand-name">
            Sacred Heritage
            <small>Temples of India</small>
          </span>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation Links */}
        <nav className={`navigation ${menuOpen ? "navigation-open" : ""}`}>

          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/temples" onClick={closeMenu}>
            Explore Temples
          </NavLink>

          <NavLink to="/favorites" onClick={closeMenu}>
            Favorites
            {favoritesCount > 0 && (
              <span className="favorite-count">
                {favoritesCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

        </nav>
      </div>
    </header>
  );
}
