
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import templesReducer from "./slices/templesSlice";
import categoriesReducer from "./slices/categoriesSlice";
import productsReducer from "./slices/productsSlice";
import reviewsReducer from "./slices/reviewsSlice";
import cartReducer from "./slices/cartSlice";
import favoritesReducer from "./slices/favoritesSlice";
import bookingReducer from "./slices/bookingSlice";
import ordersReducer from "./slices/ordersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    temples: templesReducer,
    categories: categoriesReducer,
    products: productsReducer,
    reviews: reviewsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    booking: bookingReducer,
    orders: ordersReducer
  }
});

export default store;
