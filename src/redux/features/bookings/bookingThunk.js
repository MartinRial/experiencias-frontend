// src/redux/features/bookings/bookingThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createBookingService,
  getMyBookingsService,
} from "../../../services/bookingServices";

//  Crear reserva
export const createBookingThunk = createAsyncThunk(
  "bookings/create",
  async (reserva, { rejectWithValue }) => {
    try {
      const response = await createBookingService(reserva);
      return response.data.data; //  la reserva creada
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al crear la reserva"
      );
    }
  }
);

//  Obtener reservas del usuario
export const getMyBookingsThunk = createAsyncThunk(
  "bookings/getMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyBookingsService();
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al obtener reservas"
      );
    }
  }
);
