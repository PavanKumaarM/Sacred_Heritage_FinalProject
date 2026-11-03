
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Temporary product data for frontend development.
// Replace this mock data with the backend API later.
const mockProducts = [
  {
    id: "101",
    name: "Tirupati Balaji Laddu",
    templeId: "1",
    category: "Prasadam",
    price: 150,
    description: "Traditional temple-style laddu prasadam.",
    image: "",
    stock: 50,
  },
  {
    id: "102",
    name: "Brass Diya",
    templeId: "1",
    category: "Pooja Items",
    price: 250,
    description: "Traditional brass oil lamp for daily worship.",
    image: "",
    stock: 30,
  },
  {
    id: "103",
    name: "Rudraksha Mala",
    templeId: "2",
    category: "Spiritual Items",
    price: 350,
    description: "A traditional rudraksha prayer mala.",
    image: "",
    stock: 20,
  },
  {
    id: "104",
    name: "Temple Kumkum",
    templeId: "3",
    category: "Pooja Items",
    price: 80,
    description: "Kumkum powder for traditional worship.",
    image: "",
    stock: 100,
  },
];

// Fetch products (currently using mock data).
// Pass a templeId to get products belonging to that temple.
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (templeId) => {
    if (!templeId) {
      return mockProducts;
    }

    return mockProducts.filter(
      (product) => product.templeId === String(templeId)
    );
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    clearProducts: (state) => {
      state.products = [];
    },

    clearProductError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load products";
      });
  },
});

export const {
  setSelectedProduct,
  clearSelectedProduct,
  clearProducts,
  clearProductError,
} = productsSlice.actions;

export default productsSlice.reducer;
