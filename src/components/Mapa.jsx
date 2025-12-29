import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "../assets/ubi.png";

// Componente para centrar el mapa
function MapCenter({ markersData }) {
  const map = useMap();

  useEffect(() => {
    if (markersData.length > 0) {
      const bounds = markersData.map(m => [m.lat, m.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markersData, map]);

  return null;
}

function Mapa({ markersData = [] }) {
  // Centro de Uruguay
  const uruguayCenter = [-32.5228, -55.7658];
  const zoom = 7;
  const size = { width: "100%", height: "100%" };
  const urlTileLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const customMarkerIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer 
      center={uruguayCenter} 
      zoom={zoom} 
      style={size}
      scrollWheelZoom={true}
    >
      <TileLayer 
        url={urlTileLayer}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {/* Centrar en los marcadores */}
      {markersData.length > 0 && <MapCenter markersData={markersData} />}

      {/* Marcadores */}
      {markersData.map((marker, index) => {
        const posMarker = [marker.lat, marker.lng];
        const keyMarker = `${marker.lat}-${marker.lng}-${index}`;
        
        return (
          <Marker
            key={keyMarker}
            position={posMarker}
            icon={customMarkerIcon}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#667eea',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {marker.titulo}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#666',
                  fontSize: '13px'
                }}>
                  {marker.contenido}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default Mapa;