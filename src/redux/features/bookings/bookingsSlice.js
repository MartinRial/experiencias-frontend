// src/redux/features/bookings/bookingsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createBookingThunk, getMyBookingsThunk } from "./bookingThunk";

const bookingsSlice = createSlice({
  name: "bookingsSlice",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Crear reserva ===
      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Obtener reservas ===
      .addCase(getMyBookingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getMyBookingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingsSlice.reducer;
