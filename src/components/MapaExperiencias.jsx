import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getExperienciasThunk } from "../redux/features/experiences/experienceThunk";
import { getCoordsFromDepartamento } from "../utils/deptosCoordenadas";
import Mapa from "./Mapa";
import "../styles/MapaExperiencias.css";

const MapaExperiencias = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.experienciasSlice);
  const [markersData, setMarkersData] = useState([]);
  const [filtroDepto, setFiltroDepto] = useState("all");
  const [departamentos, setDepartamentos] = useState([]);

  // Cargar todas las experiencias
  useEffect(() => {
    dispatch(getExperienciasThunk());
  }, [dispatch]);

  // Generar marcadores
  useEffect(() => {
    if (!list?.length) {
      setMarkersData([]);
      setDepartamentos([]);
      return;
    }

    const markers = list
      .map(exp => {
        let lat = exp.latitude;
        let lng = exp.longitude;
        
        // Generar coordenadas si no existen
        if ((!lat || !lng) && exp.location) {
          const coords = getCoordsFromDepartamento(exp.location);
          lat = coords.lat;
          lng = coords.lng;
        }
        
        if (!lat || !lng) return null;
        
        return {
          lat,
          lng,
          titulo: exp.title,
          departamento: exp.location,
          contenido: `${exp.category?.name || 'Sin categoría'} • USD ${exp.price}`,
          capacity: exp.capacity,
          price: exp.price,
          creator: exp.creator?.name || "Creador",
        };
      })
      .filter(Boolean);

    setMarkersData(markers);

    // Extraer departamentos únicos para filtro
    const uniqueDeptos = [...new Set(markers.map(m => m.departamento))].filter(Boolean).sort();
    setDepartamentos(uniqueDeptos);
  }, [list]);

  // Filtrar por departamento
  const markersFiltrados = filtroDepto === "all" 
    ? markersData 
    : markersData.filter(m => m.departamento === filtroDepto);

  if (loading) {
    return (
      <div className="mapa-experiencias-container">
        <div className="loading-spinner">🔄 Cargando experiencias...</div>
      </div>
    );
  }

  return (
    <div className="mapa-experiencias-container">
      <div className="mapa-header">
        <div className="header-content">
          <h1>🗺️ Mapa de Experiencias en Uruguay</h1>
          <p>Descubre experiencias únicas en cada departamento</p>
        </div>

        {/* Filtro por departamento */}
        {departamentos.length > 0 && (
          <div className="filter-depto">
            <label>📍 Filtrar por departamento:</label>
            <select 
              value={filtroDepto} 
              onChange={(e) => setFiltroDepto(e.target.value)}
              className="select-depto"
            >
              <option value="all">🇺🇾 Todo Uruguay ({markersData.length})</option>
              {departamentos.map(depto => {
                const count = markersData.filter(m => m.departamento === depto).length;
                return (
                  <option key={depto} value={depto}>
                    📍 {depto} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">📝</span>
          <div>
            <strong>{markersFiltrados.length}</strong>
            <p>{filtroDepto === "all" ? "Experiencias totales" : `En ${filtroDepto}`}</p>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">📍</span>
          <div>
            <strong>{departamentos.length}</strong>
            <p>Departamentos</p>
          </div>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">💰</span>
          <div>
            <strong>USD {markersFiltrados.reduce((sum, m) => sum + (m.price || 0), 0)}</strong>
            <p>Valor total</p>
          </div>
        </div>
      </div>

      {/* Mapa */}
      {markersFiltrados.length > 0 ? (
        <div className="map-wrapper">
          <Mapa markersData={markersFiltrados} showStats={true} />
        </div>
      ) : (
        <div className="empty-map">
          <div className="empty-icon">🗺️</div>
          <h3>No hay experiencias disponibles</h3>
          <p>
            {filtroDepto === "all" 
              ? "No se encontraron experiencias con ubicación"
              : `No hay experiencias en ${filtroDepto}`
            }
          </p>
          {filtroDepto !== "all" && (
            <button 
              className="btn-reset"
              onClick={() => setFiltroDepto("all")}
            >
              🇺🇾 Ver todo Uruguay
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MapaExperiencias;