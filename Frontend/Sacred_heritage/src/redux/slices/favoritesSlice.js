
import { createSlice } from "@reduxjs/toolkit";

// Load saved favorites safely
const getSavedFavorites = () => {
  try {
    const savedFavorites = localStorage.getItem("favorites");

    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error("Unable to load favorites:", error);
    return [];
  }
};

const initialState = {
  favorites: getSavedFavorites(),
};

const favoritesSlice = createSlice({
  name: "favorites",

  initialState,

  reducers: {
    // Add product to favorites
    addFavorite: (state, action) => {
      const product = action.payload;

      const exists = state.favorites.some(
        (item) => item._id === product._id
      );

      if (!exists) {
        state.favorites.push(product);

        localStorage.setItem(
          "favorites",
          JSON.stringify(state.favorites)
        );
      }
    },

    // Remove product from favorites
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (item) => item._id !== action.payload
      );

      localStorage.setItem(
        "favorites",
        JSON.stringify(state.favorites)
      );
    },

    // Clear all favorites
    clearFavorites: (state) => {
      state.favorites = [];

      localStorage.removeItem("favorites");
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
