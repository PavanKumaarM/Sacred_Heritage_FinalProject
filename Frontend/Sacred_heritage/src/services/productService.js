
import api from "./api";

const getAllProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (params[key] !== "" && params[key] !== null &&
        params[key] !== undefined) {
      query.append(key, params[key]);
    }
  });

  const queryString = query.toString();

  const endpoint = queryString
    ? `/products?${queryString}`
    : "/products";

  return await api.get(endpoint);
};

const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};

const getProductsByTemple = async (templeId) => {
  return await api.get(`/products/temple/${templeId}`);
};

const productService = {
  getAllProducts,
  getProductById,
  getProductsByTemple,
};

export default productService;
