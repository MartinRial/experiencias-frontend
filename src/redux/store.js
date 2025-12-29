// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import experienciasReducer from "./features/experiences/experienceSlice";
import userReducer from "./features/user/userSlice";
import bookingsReducer from "./features/bookings/bookingsSlice";
import categoryReducer from "./features/categories/categorySlice";

const store = configureStore({
  reducer: {
    experienciasSlice: experienciasReducer,
    userSlice: userReducer,
    bookingsSlice: bookingsReducer,
    categorySlice: categoryReducer,
  },
});

export default store;
