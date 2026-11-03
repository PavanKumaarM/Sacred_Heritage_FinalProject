
import api from "./api";

const orderService = {
  // Create an order from the user's cart
  createOrder: async (orderData) => {
    return await api.post("/orders", orderData);
  },

  // Get the logged-in user's orders
  getMyOrders: async () => {
    return await api.get("/orders/my-orders");
  },

  // Get one order by ID
  getOrderById: async (orderId) => {
    return await api.get(`/orders/${orderId}`);
  }
};

export default orderService;
