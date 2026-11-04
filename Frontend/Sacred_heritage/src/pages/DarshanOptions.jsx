
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchDarshanTypes } from "../redux/slices/bookingSlice";
import { fetchTempleById } from "../redux/slices/templesSlice";

import DarshanTypeCard from "../components/booking/DarshanTypeCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

function DarshanOptions() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedTemple } = useSelector((state) => state.temples);

  const { darshanTypes, loading, error } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(fetchTempleById(id));
    dispatch(fetchDarshanTypes(id));
  }, [dispatch, id]);

  return (
    <div className="page-container">
      <Link to={`/temples/${id}`} className="back-link">
        ← Back to Temple
      </Link>

      <div className="page-heading">
        <h1>Darshan Options</h1>

        <p>
          {selectedTemple?.name || "Choose your preferred darshan"}
        </p>
      </div>

      {loading && <Loader message="Loading darshan options..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <div className="darshan-grid">
          {darshanTypes.length > 0 ? (
            darshanTypes.map((type) => (
              <DarshanTypeCard
                key={type._id}
                type={type}
                templeId={id}
              />
            ))
          ) : (
            <p>No darshan options available for this temple.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DarshanOptions;
