
import api from "./api";

// Fetch all active product categories
const getAllCategories = async () => {
  return api.get("/categories");
};

const categoryService = {
  getAllCategories,
};

export default categoryService;
