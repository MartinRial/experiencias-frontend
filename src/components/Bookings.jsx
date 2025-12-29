// src/components/Bookings.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyBookingsThunk } from "../redux/features/bookings/bookingThunk";
import Spinner from "./Spinner";
import "../styles/Bookings.css";

const Bookings = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.bookingsSlice);

  useEffect(() => {
    dispatch(getMyBookingsThunk());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <p className="error">❌ {error}</p>;

  return (
    <div className="bookings-container">
      <h2>📅 Mis Reservas</h2>

      {list.length === 0 ? (
        <p>No tienes reservas realizadas aún.</p>
      ) : (
        <ul className="bookings-list">
          {list.map((reserva) => (
            <li key={reserva._id} className="booking-card">
              <h3>{reserva.experience?.title || "Experiencia sin título"}</h3>
              <p>👥 Participantes: {reserva.numberOfParticipants}</p>
              <p>💰 Total: ${reserva.totalPrice}</p>
              <p>📍 Lugar: {reserva.experience?.location}</p>
              <p>
                📆 Fecha:{" "}
                {new Date(reserva.createdAt).toLocaleDateString("es-UY")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;
