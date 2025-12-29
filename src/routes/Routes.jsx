import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";
import Home from "../components/Home";
import Bookings from "../components/Bookings";

const PrivateRoute = ({ children, allowedRole }) => {
  const { user } = useSelector((s) => s.userSlice);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "creator" ? "/dashboard" : "/home"} replace />;
  }
  
  return children;
};

const Rutas = () => {
  const { user } = useSelector((s) => s.userSlice);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === "creator" ? "/dashboard" : "/home"} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === "creator" ? "/dashboard" : "/home"} />} />
        
        {/* Rutas privadas para creators */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRole="creator">
            <Dashboard />
          </PrivateRoute>
        } />
        
        {/* Rutas privadas para users */}
        <Route path="/home" element={
          <PrivateRoute allowedRole="user">
            <Home />
          </PrivateRoute>
        } />
        
        {/* 🔴 NUEVA RUTA: Mis Reservas */}
        <Route path="/mis-reservas" element={
          <PrivateRoute allowedRole="user">
            <Bookings />
          </PrivateRoute>
        } />
        
        {/* Ruta raíz */}
        <Route path="/" element={
          user ? (
            <Navigate to={user.role === "creator" ? "/dashboard" : "/home"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;