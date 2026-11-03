
import api from "./api";

const getAllTemples = async () => {
  return await api.get("/temples");
};

const getTempleById = async (id) => {
  return await api.get(`/temples/${id}`);
};

const templeService = {
  getAllTemples,
  getTempleById,
};

export default templeService;
