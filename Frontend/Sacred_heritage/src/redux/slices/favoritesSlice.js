
import { createSlice } from "@reduxjs/toolkit";

const savedFavorites = localStorage.getItem("favorites");

const initialFavorites = savedFavorites
  ? JSON.parse(savedFavorites)
  : [];

const favoritesSlice = createSlice({
  name: "favorites",

  initialState: {
    favorites: initialFavorites,
  },

  reducers: {
    addFavorite: (state, action) => {
      const product = action.payload;

      const exists = state.favorites.find(
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

    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (item) => item._id !== action.payload
      );

      localStorage.setItem(
        "favorites",
        JSON.stringify(state.favorites)
      );
    },

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
