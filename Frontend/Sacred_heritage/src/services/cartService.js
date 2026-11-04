
import api from "./api";

// Fetch the logged-in user's cart
const getCart = async () => {
  return api.get("/cart");
};

// Add a product to the cart
const addToCart = async (productId, quantity = 1) => {
  return api.post("/cart/items", {
    productId,
    quantity,
  });
};

// Update the quantity of a cart item
const updateCartItem = async (itemId, quantity) => {
  return api.patch(`/cart/items/${itemId}`, {
    quantity,
  });
};

// Remove an individual cart item
const removeCartItem = async (itemId) => {
  return api.delete(`/cart/items/${itemId}`);
};

// Remove all items from the cart
const clearCart = async () => {
  return api.delete("/cart");
};

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

export default cartService;
