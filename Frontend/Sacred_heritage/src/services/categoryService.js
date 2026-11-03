
import api from "./api";

const getAllCategories = async () => {
  return await api.get("/categories");
};

const categoryService = {
  getAllCategories,
};

export default categoryService;
