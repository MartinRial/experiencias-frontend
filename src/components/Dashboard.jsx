import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddExperience from "./AddExperience";
import ExperienceList from "./ExperienceList";
import Grafica from "./Grafica";
import UpgradePlan from "./UpgradePlan";
import Mapa from "./Mapa";
import { getExperienciasByUserThunk } from "../redux/features/experiences/experienceThunk";
import { logout } from "../redux/features/user/userSlice";
import { toast } from "react-toastify";
import "../styles/Dashboard.css";

const Dashboard = () => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.userSlice);
  const { list } = useSelector((s) => s.experienciasSlice);
  
  const [filtroFecha, setFiltroFecha] = useState("all");
  const [experienciasFiltradas, setExperienciasFiltradas] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [labelsCategorias, setLabelsCategorias] = useState([]);
  const [datosCategorias, setDatosCategorias] = useState([]);
  const [labelsMeses, setLabelsMeses] = useState([]);
  const [datosIngresos, setDatosIngresos] = useState([]);
  const [markersData, setMarkersData] = useState([]);

  useEffect(() => {
    if (user?.role === "creator") {
      dispatch(getExperienciasByUserThunk());
    }
  }, [dispatch, user, refreshKey]);

  // 🗺️ Generar marcadores para el mapa
  useEffect(() => {
    if (!list?.length) {
      setMarkersData([]);
      return;
    }

    const markers = list
      .filter(exp => exp.latitude && exp.longitude) // Solo experiencias con coordenadas
      .map(exp => ({
        lat: exp.latitude,
        lng: exp.longitude,
        titulo: exp.title,
        contenido: `${exp.category?.name || 'Sin categoría'} • USD ${exp.price}`,
      }));

    console.log("🗺️ Marcadores generados:", markers.length);
    setMarkersData(markers);
  }, [list]);

  // Filtrado
  useEffect(() => {
    if (!list?.length) {
      setExperienciasFiltradas([]);
      return;
    }

    const now = new Date();
    let filtered = [...list];

    if (filtroFecha === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filtered = list.filter((exp) => new Date(exp.createdAt || exp.date) >= weekAgo);
    } 
    else if (filtroFecha === "month") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filtered = list.filter((exp) => new Date(exp.createdAt || exp.date) >= monthAgo);
    }
    
    setExperienciasFiltradas(filtered);
  }, [list, filtroFecha]);

  // Gráficas
  useEffect(() => {
    if (!list?.length) return;

    const groupedByCategory = list.reduce((acc, exp) => {
      const categoryName = exp.category?.name || "Sin categoría";
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});

    setLabelsCategorias(Object.keys(groupedByCategory));
    setDatosCategorias(Object.values(groupedByCategory));

    const groupedByMonth = list.reduce((acc, exp) => {
      const date = new Date(exp.createdAt || exp.date);
      const monthYear = date.toLocaleDateString("es-UY", { 
        month: "short", 
        year: "numeric" 
      });
      
      acc[monthYear] = (acc[monthYear] || 0) + (exp.price || 0);
      return acc;
    }, {});

    const sortedMonths = Object.entries(groupedByMonth)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]));

    setLabelsMeses(sortedMonths.map(([month]) => month));
    setDatosIngresos(sortedMonths.map(([, total]) => total));
  }, [list]);

  const handleExperienceAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info("👋 Sesión cerrada correctamente");
    navigate("/login");
  };

  const totalExperiencias = list?.length || 0;
  const experienciasEstaSemana = list?.filter((exp) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(exp.createdAt || exp.date) >= weekAgo;
  }).length || 0;
  
  const ingresoTotal = list?.reduce((sum, exp) => sum + (exp.price || 0), 0) || 0;

  if (user?.role !== "creator") {
    return (
      <div className="dashboard-container">
        <div className="alert-warning">
          ⚠️ Solo los creadores pueden acceder al dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>📊 Dashboard de Experiencias</h1>
            <p>Gestiona tus experiencias desde un solo lugar</p>
          </div>
          
          <div className="header-actions">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <div className="user-details">
                <p className="user-name">{user?.name || user?.email}</p>
                <p className="user-role">
                  {user?.plan === "premium" ? "⭐ Premium" : "🆓 Free"}
                </p>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{totalExperiencias}</h3>
            <p>Total Experiencias</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{experienciasEstaSemana}</h3>
            <p>Esta Semana</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>USD {ingresoTotal}</h3>
            <p>Ingresos Potenciales</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>{markersData.length}</h3>
            <p>Con Ubicación</p>
          </div>
        </div>
      </div>

      {/* 🗺️ MAPA DE URUGUAY */}
      {markersData.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>🗺️ Mapa de Experiencias</h2>
            <p className="section-subtitle">
              Ubicación geográfica de tus {markersData.length} experiencias
            </p>
          </div>
          
          <div className="map-container">
            <Mapa markersData={markersData} />
          </div>
        </div>
      )}

      {/* GRÁFICAS */}
      {totalExperiencias > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>📈 Estadísticas Visuales</h2>
            <p className="section-subtitle">Análisis de tus experiencias</p>
          </div>
          
          <div className="charts-grid">
            <div className="chart-container">
              <h3 className="chart-title">🍽️ Distribución por Categoría</h3>
              <Grafica 
                etiquetas={labelsCategorias} 
                datos={datosCategorias}
              />
            </div>
            
            <div className="chart-container">
              <h3 className="chart-title">💰 Ingresos Mensuales</h3>
              <Grafica 
                etiquetas={labelsMeses} 
                datos={datosIngresos}
              />
            </div>
          </div>
        </div>
      )}

      {/* LAYOUT DE 2 COLUMNAS */}
      <div className="dashboard-two-columns">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>➕ Agregar Nueva Experiencia</h2>
            <p className="section-subtitle">
              Plan actual: hasta {user?.plan === "premium" ? "10" : "5"} experiencias
            </p>
          </div>
          
          <AddExperience onSuccess={handleExperienceAdded} />
        </div>

        <div className="dashboard-section-sticky">
          <UpgradePlan />
        </div>
      </div>

      {/* LISTADO CON FILTROS */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>📋 Mis Experiencias</h2>
          
          <div className="filter-controls">
            <label>🔍 Filtrar por:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filtroFecha === "week" ? "active" : ""}`}
                onClick={() => setFiltroFecha("week")}
              >
                📅 Última Semana
              </button>
              <button
                className={`filter-btn ${filtroFecha === "month" ? "active" : ""}`}
                onClick={() => setFiltroFecha("month")}
              >
                📆 Último Mes
              </button>
              <button
                className={`filter-btn ${filtroFecha === "all" ? "active" : ""}`}
                onClick={() => setFiltroFecha("all")}
              >
                📊 Todo el Histórico
              </button>
            </div>
            
            <div className="filter-result-count">
              Mostrando <strong>{experienciasFiltradas.length}</strong> de <strong>{totalExperiencias}</strong> experiencias
            </div>
          </div>
        </div>

        {experienciasFiltradas.length > 0 ? (
          <ExperienceList 
            showAll={false} 
            mine={true}
            experiences={experienciasFiltradas}
          />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No hay experiencias para mostrar</h3>
            <p>
              {filtroFecha === "all" 
                ? "No tienes experiencias creadas aún"
                : `No hay experiencias creadas en ${filtroFecha === "week" ? "la última semana" : "el último mes"}`
              }
            </p>
            {filtroFecha !== "all" && (
              <button 
                className="btn-reset-filter"
                onClick={() => setFiltroFecha("all")}
              >
                📊 Ver todas mis experiencias
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;