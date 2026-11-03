
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Temporary demo data.
// Replace this with the backend API call when your backend is ready.
const mockTemples = [
  {
    id: "1",
    name: "Meenakshi Amman Temple",
    state_name: "Tamil Nadu",
    district_name: "Madurai",
    deity: "Goddess Meenakshi",
    architecture_style: "Dravidian",
    description:
      "A historic temple known for its magnificent gopurams and detailed sculptures.",
    cover_image_url: "",
  },
  {
    id: "2",
    name: "Brihadeeswarar Temple",
    state_name: "Tamil Nadu",
    district_name: "Thanjavur",
    deity: "Lord Shiva",
    architecture_style: "Dravidian",
    description:
      "A UNESCO World Heritage temple celebrated for its Chola architecture.",
    cover_image_url: "",
  },
  {
    id: "3",
    name: "Ramanathaswamy Temple",
    state_name: "Tamil Nadu",
    district_name: "Rameswaram",
    deity: "Lord Shiva",
    architecture_style: "Dravidian",
    description:
      "A famous pilgrimage temple known for its long corridors and sacred water tanks.",
    cover_image_url: "",
  },
];

// Fetch temples (currently using mock data)
export const fetchTemples = createAsyncThunk(
  "temples/fetchTemples",
  async () => {
    return mockTemples;
  }
);

const initialState = {
  temples: [],
  selectedTemple: null,
  loading: false,
  error: null,
};

const templesSlice = createSlice({
  name: "temples",
  initialState,
  reducers: {
    setSelectedTemple: (state, action) => {
      state.selectedTemple = action.payload;
    },

    clearSelectedTemple: (state) => {
      state.selectedTemple = null;
    },

    clearTempleError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTemples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTemples.fulfilled, (state, action) => {
        state.loading = false;
        state.temples = action.payload;
      })

      .addCase(fetchTemples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load temples";
      });
  },
});

export const {
  setSelectedTemple,
  clearSelectedTemple,
  clearTempleError,
} = templesSlice.actions;

export default templesSlice.reducer;
