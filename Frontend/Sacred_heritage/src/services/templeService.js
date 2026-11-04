
import api from "./api";

// Fetch all active temples
const getAllTemples = async () => {
  return api.get("/temples");
};

// Fetch a single temple by ID
const getTempleById = async (id) => {
  return api.get(`/temples/${id}`);
};

// Fetch temple details along with its products
const getTempleDetails = async (id) => {
  return api.get(`/temples/${id}/details`);
};

const templeService = {
  getAllTemples,
  getTempleById,
  getTempleDetails,
};

export default templeService;
