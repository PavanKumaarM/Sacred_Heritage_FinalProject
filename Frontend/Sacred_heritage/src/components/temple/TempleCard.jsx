
function TempleCard({ temple }) {
  return (
    <div className="temple-card">

      <img
        src={temple.image || "/temple-placeholder.png"}
        alt={temple.name}
      />

      <h2>{temple.name}</h2>

      <p>Location: {temple.location}</p>

      <p>Deity: {temple.deity}</p>

      <p>{temple.description}</p>

    </div>
  );
}

export default TempleCard;
