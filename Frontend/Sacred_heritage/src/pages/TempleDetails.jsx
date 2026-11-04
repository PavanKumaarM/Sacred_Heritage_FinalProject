
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchTempleById,
  clearSelectedTemple
} from "../redux/slices/templesSlice";

import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function TempleDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedTemple, loading, error } = useSelector(
    (state) => state.temples
  );

  useEffect(() => {
    dispatch(fetchTempleById(id));

    return () => {
      dispatch(clearSelectedTemple());
    };
  }, [dispatch, id]);

  if (loading) {
    return <Loader message="Loading temple details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!selectedTemple) {
    return <p className="page-container">Temple not found.</p>;
  }

  return (
    <div className="page-container temple-details">
      <img
        src={selectedTemple.image || "/placeholder-temple.jpg"}
        alt={selectedTemple.name}
        className="temple-details-image"
      />

      <div className="temple-details-content">
        <h1>{selectedTemple.name}</h1>

        <p>
          <strong>Location:</strong> {selectedTemple.location}
        </p>

        <p>
          <strong>Deity:</strong> {selectedTemple.deity}
        </p>

        <p>{selectedTemple.description}</p>

        <h3>History</h3>
        <p>{selectedTemple.history}</p>

        <h3>Temple Timings</h3>
        <p>
          {selectedTemple.openingTime} - {selectedTemple.closingTime}
        </p>

        <div className="temple-action-buttons">
          <Link
            to={`/temples/${id}/products`}
            className="primary-button"
          >
            Explore Products
          </Link>

          <Link
            to={`/temples/${id}/darshan`}
            className="secondary-button"
          >
            Book Darshan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TempleDetails;
