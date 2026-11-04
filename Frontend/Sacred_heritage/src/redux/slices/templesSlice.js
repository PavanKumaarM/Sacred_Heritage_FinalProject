
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import templeService from "../../services/templeService";

// Fetch all temples
export const fetchTemples = createAsyncThunk(
  "temples/fetchTemples",
  async (_, { rejectWithValue }) => {
    try {
      const response = await templeService.getAllTemples();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single temple by ID
export const fetchTempleById = createAsyncThunk(
  "temples/fetchTempleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await templeService.getTempleById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch temple details along with associated products
export const fetchTempleDetails = createAsyncThunk(
  "temples/fetchTempleDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await templeService.getTempleDetails(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const templesSlice = createSlice({
  name: "temples",

  initialState: {
    temples: [],
    selectedTemple: null,
    selectedTempleDetails: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedTemple: (state) => {
      state.selectedTemple = null;
      state.selectedTempleDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch all temples
      .addCase(fetchTemples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemples.fulfilled, (state, action) => {
        state.loading = false;
        state.temples = action.payload || [];
      })
      .addCase(fetchTemples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch individual temple
      .addCase(fetchTempleById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTemple = null;
      })
      .addCase(fetchTempleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTemple = action.payload;
      })
      .addCase(fetchTempleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch temple with its products
      .addCase(fetchTempleDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTempleDetails = null;
      })
      .addCase(fetchTempleDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTempleDetails = action.payload;
      })
      .addCase(fetchTempleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedTemple } = templesSlice.actions;

export default templesSlice.reducer;
