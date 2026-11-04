
import api from "./api";

// Build query parameters for product filtering and pagination
const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      query.append(key, value);
    }
  });

  return query.toString();
};

// Fetch products with optional filters, sorting and pagination
const getAllProducts = async (params = {}) => {
  const queryString = buildQueryString(params);

  const endpoint = queryString
    ? `/products?${queryString}`
    : "/products";

  return api.get(endpoint);
};

// Fetch a single product by ID
const getProductById = async (id) => {
  return api.get(`/products/${id}`);
};

// Fetch products belonging to a particular temple
const getProductsByTemple = async (templeId, params = {}) => {
  const queryString = buildQueryString(params);

  const endpoint = queryString
    ? `/products/temple/${templeId}?${queryString}`
    : `/products/temple/${templeId}`;

  return api.get(endpoint);
};

const productService = {
  getAllProducts,
  getProductById,
  getProductsByTemple,
};

export default productService;
