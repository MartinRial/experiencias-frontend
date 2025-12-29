// src/services/bookingServices.js
import axios from "axios";
import { API_URL } from "../config/api";

// 🟢 Crear nueva reserva
export const createBookingService = async (reserva) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/bookings`, reserva, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🟢 Obtener reservas del usuario logueado
export const getMyBookingsService = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/bookings/my-bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
