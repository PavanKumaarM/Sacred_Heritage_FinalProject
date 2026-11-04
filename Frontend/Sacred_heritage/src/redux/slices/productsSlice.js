
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "../../services/productService";

// Fetch products with search, filters, sorting and pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(params);

      return {
        products: response.products || [],
        pagination: response.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch products belonging to a particular temple
export const fetchProductsByTemple = createAsyncThunk(
  "products/fetchProductsByTemple",
  async ({ templeId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByTemple(
        templeId,
        params
      );

      return {
        products: response.products || [],
        pagination: response.pagination || null,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    selectedProduct: null,
    templeProducts: [],
    pagination: null,
    templePagination: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // All products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Single product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Products belonging to one temple
      .addCase(fetchProductsByTemple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProductsByTemple.fulfilled, (state, action) => {
        state.loading = false;
        state.templeProducts = action.payload.products;
        state.templePagination = action.payload.pagination;
      })

      .addCase(fetchProductsByTemple.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;

export default productsSlice.reducer;
