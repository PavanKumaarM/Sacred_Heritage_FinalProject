
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

// Fetch logged-in user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(
        productId,
        quantity
      );

      return response.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(
        itemId,
        quantity
      );

      return response.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove individual cart item
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeCartItem(itemId);
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear entire cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cart: { items: [] },
  loading: false,
  error: null,
  actionLoading: false,
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload || { items: [] };
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add item
      .addCase(addToCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload || { items: [] };
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Update item
      .addCase(updateCartItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload || { items: [] };
      })

      .addCase(updateCartItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Remove item
      .addCase(removeCartItem.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload || { items: [] };
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(clearCart.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.cart = action.payload || { items: [] };
      })

      .addCase(clearCart.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
