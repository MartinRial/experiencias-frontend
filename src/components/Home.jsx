import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ExperienceList from "./ExperienceList";
import { getExperienciasThunk } from "../redux/features/experiences/experienceThunk";
import { logout } from "../redux/features/user/userSlice";
import { toast } from "react-toastify";
import "../styles/Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.userSlice);
  const { list } = useSelector((s) => s.experienciasSlice);

  useEffect(() => {
    // Cargar todas las experiencias disponibles
    dispatch(getExperienciasThunk());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("👋 Sesión cerrada correctamente");
    navigate("/login");
  };

  // Calcular estadísticas del usuario
  const totalExperiencias = list?.length || 0;
  const experienciasDisponibles = list?.filter(exp => exp.capacity > 0).length || 0;

  return (
    <div className="home-container">
      {/* HEADER */}
      <div className="home-header">
        <div className="header-content">
          <div className="header-text">
            <h1>🌟 Descubre Experiencias Únicas</h1>
            <p>Encuentra y reserva las mejores experiencias en Uruguay</p>
          </div>
          
          <div className="header-actions">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <div className="user-details">
                <p className="user-name">{user?.name || user?.email}</p>
                <p className="user-role">👥 Usuario</p>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{totalExperiencias}</h3>
            <p>Experiencias Totales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{experienciasDisponibles}</h3>
            <p>Disponibles Ahora</p>
          </div>
        </div>
        
       
        
      
      </div>

      {/* NAVEGACIÓN */}
      <div className="home-navigation">
        <button className="nav-btn active">
          🌟 Explorar Experiencias
        </button>
        <button className="nav-btn" onClick={() => navigate("/mis-reservas")}>
          📋 Mis Reservas
        </button>
      </div>

      {/* LISTADO DE EXPERIENCIAS */}
      <div className="home-section">
        <ExperienceList showAll={true} mine={false} />
      </div>
    </div>
  );
};

export default Home;