import api from "./api";

const orderService = {
  // Create an order from the user's cart
  createOrder: async (orderData) => {
    return api.post("/orders", orderData);
  },

  // Get the logged-in user's orders
  getMyOrders: async () => {
    return api.get("/orders/my-orders");
  },

  // Get a single order by ID
  getOrderById: async (orderId) => {
    return api.get(`/orders/${orderId}`);
  },
};

export default orderService;
