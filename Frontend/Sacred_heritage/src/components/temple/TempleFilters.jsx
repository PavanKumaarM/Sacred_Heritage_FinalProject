
function TempleFilters({
  search,
  setSearch,
  selectedDeity,
  setSelectedDeity,
  temples,
}) {
  // Get unique deity names from temple data
  const deities = [
    ...new Set(
      temples
        .map((temple) => temple.deity)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="temple-filters">

      <input
        type="text"
        placeholder="Search temple name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={selectedDeity}
        onChange={(e) => setSelectedDeity(e.target.value)}
      >
        <option value="">All Deities</option>

        {deities.map((deity) => (
          <option key={deity} value={deity}>
            {deity}
          </option>
        ))}

      </select>

    </div>
  );
}

export default TempleFilters;
