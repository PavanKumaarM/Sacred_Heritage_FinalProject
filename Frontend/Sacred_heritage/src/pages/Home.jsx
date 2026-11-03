
import { Link } from "react-router-dom";

function TempleCard({ temple }) {
  return (
    <div className="temple-card">

      <Link to={`/temples/${temple._id}`} className="temple-card-link">

        <img
          src={temple.image || "/temple-placeholder.png"}
          alt={temple.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/temple-placeholder.png";
          }}
        />

        <div className="temple-card-content">

          <h2>{temple.name}</h2>

          <p>
            <strong>Location:</strong> {temple.location}
          </p>

          <p>
            <strong>Deity:</strong> {temple.deity || "Not specified"}
          </p>

          <p>
            {temple.description}
          </p>

          <span className="temple-card-button">
            Explore Temple →
          </span>

        </div>

      </Link>

    </div>
  );
}

export default TempleCard;
