
import { Link } from "react-router-dom";

function TempleCard({ temple }) {
  if (!temple || !temple._id) {
    return null;
  }

  return (
    <div className="temple-card">

      <Link
        to={`/temples/${temple._id}`}
        className="temple-card-link"
      >

        <img
          src={temple.image || "/temple-placeholder.png"}
          alt={temple.name || "Temple"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/temple-placeholder.png";
          }}
        />

        <div className="temple-card-content">

          <h2>{temple.name || "Unnamed Temple"}</h2>

          <p>
            <strong>Location:</strong>{" "}
            {temple.location || "Not available"}
          </p>

          <p>
            <strong>Deity:</strong>{" "}
            {temple.deity || "Not specified"}
          </p>

          <p>
            {temple.description || "Explore this sacred temple."}
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
