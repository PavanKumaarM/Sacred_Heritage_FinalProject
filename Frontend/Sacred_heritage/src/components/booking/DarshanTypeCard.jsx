
import { Link } from "react-router-dom";

function DarshanTypeCard({ type, templeId }) {
  return (
    <div className="darshan-type-card">
      <h3>{type.name}</h3>

      <p>{type.description}</p>

      <p>
        <strong>Price:</strong> ₹{type.price}
      </p>

      <p>
        <strong>Duration:</strong> {type.durationMinutes} minutes
      </p>

      <Link
        to={`/darshan/${templeId}/book/${type._id}`}
        className="primary-button"
      >
        Book Darshan
      </Link>
    </div>
  );
}

export default DarshanTypeCard;
