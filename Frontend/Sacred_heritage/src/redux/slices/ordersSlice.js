
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../../services/orderService";

// Create an order from the cart
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const response = await orderService.getMyOrders();
      return response.orders || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch a single order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, thunkAPI) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: "",
  },

  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },

    clearOrderMessage: (state) => {
      state.successMessage = "";
    },

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Create order
      .addCase(createOrder.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = "";
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedOrder = action.payload;

        if (action.payload) {
          state.orders.unshift(action.payload);
        }

        state.successMessage = "Order placed successfully!";
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Fetch all orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch individual order
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearOrderError,
  clearOrderMessage,
  clearSelectedOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
