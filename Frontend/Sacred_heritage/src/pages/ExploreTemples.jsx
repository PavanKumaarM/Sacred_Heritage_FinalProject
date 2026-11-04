
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTemples } from "../redux/slices/templesSlice";

import TempleCard from "../components/temple/TempleCard";
import TempleFilters from "../components/temple/TempleFilters";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function ExploreTemples() {
  const dispatch = useDispatch();

  const { temples, loading, error } = useSelector(
    (state) => state.temples
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDeity, setSelectedDeity] = useState("");

  // Fetch temples when the component loads
  useEffect(() => {
    dispatch(fetchTemples());
  }, [dispatch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Filter temples
  const filteredTemples = temples.filter((temple) => {
    const searchValue = debouncedSearch.toLowerCase();

    const matchesSearch =
      (temple.name || "").toLowerCase().includes(searchValue) ||
      (temple.location || "").toLowerCase().includes(searchValue);

    const matchesDeity =
      selectedDeity === "" || temple.deity === selectedDeity;

    return matchesSearch && matchesDeity;
  });

  return (
    <div className="explore-page">

      <div className="page-heading">
        <p>DISCOVER SACRED PLACES</p>
        <h1>Explore Temples of India</h1>
        <span>
          Discover the history, traditions and beauty of sacred temples.
        </span>
      </div>

      <TempleFilters
        search={search}
        setSearch={setSearch}
        selectedDeity={selectedDeity}
        setSelectedDeity={setSelectedDeity}
        temples={temples}
      />

      {loading && (
        <Loader message="Loading temples..." />
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchTemples())}
        />
      )}

      {!loading && !error && filteredTemples.length === 0 && (
        <div className="empty-message">
          <h3>No temples found</h3>
          <p>Try changing your search or deity filter.</p>
        </div>
      )}

      {!loading && !error && filteredTemples.length > 0 && (
        <>
          <p className="result-count">
            Showing {filteredTemples.length} temples
          </p>

          <div className="temple-grid">

            {filteredTemples.map((temple) => (
              <TempleCard
                key={temple._id}
                temple={temple}
              />
            ))}

          </div>
        </>
      )}

    </div>
  );
}

export default ExploreTemples;
