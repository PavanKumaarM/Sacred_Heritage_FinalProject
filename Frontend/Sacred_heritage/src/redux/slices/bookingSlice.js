
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingService from "../../services/bookingService";

// Fetch darshan types
export const fetchDarshanTypes = createAsyncThunk(
  "booking/fetchDarshanTypes",
  async (templeId, thunkAPI) => {
    try {
      const response = await bookingService.getDarshanTypes(templeId);
      return response.types || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch available slots
export const fetchAvailableSlots = createAsyncThunk(
  "booking/fetchAvailableSlots",
  async ({ templeId, darshanTypeId, date }, thunkAPI) => {
    try {
      const response = await bookingService.getAvailableSlots(
        templeId,
        darshanTypeId,
        date
      );

      return response.slots || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create booking
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, thunkAPI) => {
    try {
      const response = await bookingService.createBooking(bookingData);
      return response.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch booking history
export const fetchHistory = createAsyncThunk(
  "booking/fetchHistory",
  async (_, thunkAPI) => {
    try {
      const response = await bookingService.getHistory();

      return {
        bookings: response.history?.bookings || [],
        orders: response.history?.orders || []
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Cancel booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, thunkAPI) => {
    try {
      const response = await bookingService.cancelBooking(bookingId);
      return response.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",

  initialState: {
    darshanTypes: [],
    slots: [],
    bookings: [],
    orders: [],
    selectedBooking: null,
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: ""
  },

  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },

    clearBookingMessage: (state) => {
      state.successMessage = "";
    },

    clearSlots: (state) => {
      state.slots = [];
    }
  },

  extraReducers: (builder) => {
    builder

      // Darshan types
      .addCase(fetchDarshanTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDarshanTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.darshanTypes = action.payload;
      })
      .addCase(fetchDarshanTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Available slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.slots = [];
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedBooking = action.payload;
        state.successMessage = "Darshan booking created successfully!";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Booking history
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.orders = action.payload.orders;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload._id ? action.payload : booking
        );

        state.successMessage = "Booking cancelled successfully!";
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearBookingError,
  clearBookingMessage,
  clearSlots
} = bookingSlice.actions;

export default bookingSlice.reducer;
