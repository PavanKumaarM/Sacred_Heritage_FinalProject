
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchTemples } from "../redux/slices/templesSlice";
import TempleCard from "../components/temple/TempleCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function Home() {
  const dispatch = useDispatch();

  const { temples, loading, error } = useSelector(
    (state) => state.temples
  );

  useEffect(() => {
    dispatch(fetchTemples());
  }, [dispatch]);

  // Make sure temples is a valid array
  const validTemples = Array.isArray(temples)
    ? temples.filter(
        (temple) =>
          temple &&
          typeof temple === "object" &&
          temple._id
      )
    : [];

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">

          <p className="hero-subtitle">
            Discover India's Spiritual Heritage
          </p>

          <h1>
            Explore the Divine Beauty of India's Temples
          </h1>

          <p>
            Discover sacred destinations, explore their history,
            shop traditional products and book your darshan.
          </p>

          <Link to="/temples" className="hero-button">
            Explore Temples
          </Link>

        </div>
      </section>

      {/* Featured Temples */}
      <section className="featured-section">

        <div className="section-heading">
          <div>
            <p>DISCOVER SACRED PLACES</p>
            <h2>Featured Temples</h2>
          </div>

          <Link to="/temples">
            View All Temples →
          </Link>
        </div>

        {loading && (
          <Loader message="Loading featured temples..." />
        )}

        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(fetchTemples())}
          />
        )}

        {!loading && !error && validTemples.length === 0 && (
          <p className="empty-message">
            No temples are available right now.
          </p>
        )}

        {!loading && !error && validTemples.length > 0 && (
          <div className="temple-grid">

            {validTemples.slice(0, 3).map((temple) => (
              <TempleCard
                key={temple._id}
                temple={temple}
              />
            ))}

          </div>
        )}

      </section>

      {/* Information Section */}
      <section className="home-info-section">

        <h2>Experience India's Spiritual Heritage</h2>

        <div className="info-grid">

          <div className="info-card">
            <h3>Discover Temples</h3>
            <p>
              Explore temples, their history, architecture
              and spiritual significance.
            </p>
          </div>

          <div className="info-card">
            <h3>Temple Products</h3>
            <p>
              Explore traditional products and prasadam
              associated with sacred destinations.
            </p>
          </div>

          <div className="info-card">
            <h3>Book Darshan</h3>
            <p>
              Explore darshan options and plan your
              temple visits.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;
