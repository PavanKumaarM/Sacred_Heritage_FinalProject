
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "../../services/reviewService";

// Fetch reviews for a product
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await reviewService.getProductReviews(productId);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new product review
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(
        productId,
        reviewData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewService.updateReview(
        reviewId,
        reviewData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a review
export const removeReview = createAsyncThunk(
  "reviews/removeReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",

  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })

      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add review
      .addCase(addReview.fulfilled, (state, action) => {
        if (action.payload) {
          state.reviews.push(action.payload);
        }
      })

      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update review
      .addCase(updateReview.fulfilled, (state, action) => {
        const updatedReview = action.payload;

        if (updatedReview?._id) {
          state.reviews = state.reviews.map((review) =>
            review._id === updatedReview._id
              ? updatedReview
              : review
          );
        }
      })

      .addCase(updateReview.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete review
      .addCase(removeReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      })

      .addCase(removeReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;

export default reviewsSlice.reducer;
