import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import {
  getExperienciasThunk,
  getExperienciasByUserThunk,
  updateExperienciaThunk,
  deleteExperienciaThunk,
} from "../redux/features/experiences/experienceThunk";
import { createBookingThunk } from "../redux/features/bookings/bookingThunk";
import "../styles/ExperienceList.css";

const ExperienceList = ({ showAll, mine, experiences }) => {
  const dispatch = useDispatch();
  const { list: reduxList, loading, error } = useSelector((s) => s.experienciasSlice);
  const { user } = useSelector((s) => s.userSlice);
  const { loading: bookingLoading } = useSelector((s) => s.bookingsSlice);
  
  const list = experiences || reduxList;
  
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [bookingExperienceId, setBookingExperienceId] = useState(null);

  useEffect(() => {
    if (!experiences) {
      console.log("🔄 Cargando experiencias desde Redux...", { showAll, mine });
      if (mine) {
        dispatch(getExperienciasByUserThunk());
      } else {
        dispatch(getExperienciasThunk());
      }
    } else {
      console.log("📦 Usando experiencias filtradas (prop):", experiences.length);
    }
  }, [dispatch, mine, showAll, experiences]);

  const handleEditClick = (exp) => {
    console.log("✏️ Editando experiencia:", exp);
    setEditingId(exp.id || exp._id);
    setEditPrice(exp.price);
  };

  const handleSaveEdit = async (exp) => {
    const expId = exp.id || exp._id;
    
    if (!editPrice || editPrice <= 0) {
      toast.warning("⚠️ El precio debe ser mayor a 0");
      return;
    }

    console.log("💾 Guardando cambios:", { id: expId, price: editPrice });

    try {
      await dispatch(
        updateExperienciaThunk({
          id: expId,
          price: Number(editPrice),
        })
      ).unwrap();

      toast.success("✅ Precio actualizado correctamente");
      setEditingId(null);
      setEditPrice("");
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      toast.error(`❌ Error: ${error}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditPrice("");
  };

  const handleDelete = (exp) => {
    const expId = exp.id || exp._id;

    toast.warn(
      ({ closeToast }) => (
        <div style={{ padding: '10px' }}>
          <p style={{ marginBottom: '15px', fontWeight: '600' }}>
            ¿Eliminar "{exp.title}"?
          </p>
          <p style={{ marginBottom: '15px', fontSize: '13px', color: '#666' }}>
            Esta acción no se puede deshacer
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                closeToast();
              }}
              style={{
                padding: '8px 16px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                closeToast();
                console.log("🗑️ Eliminando experiencia:", expId);

                try {
                  await dispatch(deleteExperienciaThunk(expId)).unwrap();
                  toast.success("✅ Experiencia eliminada correctamente");
                } catch (error) {
                  console.error("❌ Error al eliminar:", error);
                  toast.error(`❌ Error: ${error}`);
                }
              }}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  // 🆕 FUNCIÓN PARA RESERVAR
  const handleBook = async (exp) => {
    const expId = exp.id || exp._id;

    if (!user) {
      toast.error("❌ Debes iniciar sesión para reservar");
      return;
    }

    if (exp.capacity <= 0) {
      toast.error("❌ No hay cupos disponibles");
      return;
    }

    console.log("🎯 Creando reserva para experiencia:", expId);
    setBookingExperienceId(expId);

    try {
      const bookingData = {
        experienceId: expId,
        participants: 1,
        date: new Date().toISOString(),
      };

      console.log("📤 Enviando datos de reserva:", bookingData);

      await dispatch(createBookingThunk(bookingData)).unwrap();

      toast.success("🎉 ¡Reserva realizada con éxito!");
      
      // Recargar experiencias para actualizar capacidad
      if (mine) {
        dispatch(getExperienciasByUserThunk());
      } else {
        dispatch(getExperienciasThunk());
      }
    } catch (error) {
      console.error("❌ Error al reservar:", error);
      toast.error(`❌ ${error}`);
    } finally {
      setBookingExperienceId(null);
    }
  };

  if (loading && !experiences) return <Spinner />;
  
  if (error) return <div className="alert-error">⚠️ {error}</div>;
  
  if (!list?.length) {
    return (
      <div className="empty-state">
        <p>📭 No hay experiencias para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="experience-list-container">
      {!experiences && (
        <>
          <h2 className="list-title">
            {mine ? "📋 Mis Experiencias" : "🌟 Descubre Experiencias Únicas"}
          </h2>
          <p className="list-subtitle">
            {mine 
              ? "Gestiona tus experiencias publicadas"
              : "Encuentra tu próxima aventura en Uruguay"}
          </p>
        </>
      )}

      <div className="experience-grid">
        {list.map((exp) => {
          const expId = exp.id || exp._id;
          const hasImages = exp.images && Array.isArray(exp.images) && exp.images.length > 0;
          const isEditing = editingId === expId;
          const isBooking = bookingExperienceId === expId;
          const hasCapacity = exp.capacity > 0;

          return (
            <div key={expId} className="experience-card">
              {/* IMAGEN */}
              <div className="exp-image">
                {hasImages ? (
                  <>
                    <img
                      src={exp.images[0]}
                      alt={exp.title}
                      onError={(e) => {
                        console.error("❌ Error cargando imagen:", exp.images[0]);
                        e.target.src = "https://via.placeholder.com/400x250/667eea/ffffff?text=Sin+Imagen";
                      }}
                    />
                    {exp.images.length > 1 && (
                      <span className="img-count">📷 {exp.images.length}</span>
                    )}
                  </>
                ) : (
                  <div className="exp-no-image">
                    <span>🖼️</span>
                    <p>Sin imagen</p>
                  </div>
                )}

                {/* BADGE DE DISPONIBILIDAD */}
                {!hasCapacity && (
                  <div className="sold-out-badge">
                    ❌ SIN CUPOS
                  </div>
                )}
              </div>

              {/* CONTENIDO */}
              <div className="exp-content">
                {exp.category && (
                  <span className="category-badge">
                    {exp.category.icon} {exp.category.name}
                  </span>
                )}

                <h3 className="exp-title">{exp.title}</h3>
                
                <p className="exp-description">
                  {exp.description?.length > 100
                    ? `${exp.description.substring(0, 100)}...`
                    : exp.description}
                </p>

                {/* DETALLES */}
                <div className="exp-details">
                  <div className="exp-detail">
                    <span className="icon">📍</span>
                    <span>{exp.location}</span>
                  </div>
                  
                  <div className="exp-detail">
                    <span className="icon">💰</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="price-input-inline"
                        min="0"
                        step="50"
                      />
                    ) : (
                      <span>USD {exp.price}</span>
                    )}
                  </div>

                  <div className="exp-detail">
                    <span className="icon">👥</span>
                    <span className={!hasCapacity ? "text-danger" : ""}>
                      {exp.capacity} {hasCapacity ? "cupos" : "SIN CUPOS"}
                    </span>
                  </div>
                  
                  <div className="exp-detail">
                    <span className="icon">📅</span>
                    <span>
                      {new Date(exp.date).toLocaleDateString("es-UY", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="exp-actions">
                  {/* 🆕 BOTÓN RESERVAR PARA USUARIOS */}
                  {user?.role === "user" && showAll && (
                    <button 
                      className={`btn-primary ${!hasCapacity ? "btn-disabled" : ""}`}
                      onClick={() => handleBook(exp)}
                      disabled={!hasCapacity || isBooking}
                    >
                      {isBooking ? (
                        <>
                          <span className="spinner-small"></span>
                          Reservando...
                        </>
                      ) : !hasCapacity ? (
                        "❌ Sin cupos"
                      ) : (
                        "🎫 Reservar Ahora"
                      )}
                    </button>
                  )}
                  
                  {/* BOTONES PARA CREADORES */}
                  {user?.role === "creator" && mine && (
                    <>
                      {isEditing ? (
                        <>
                          <button 
                            className="btn-save"
                            onClick={() => handleSaveEdit(exp)}
                          >
                            ✅ Guardar
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={handleCancelEdit}
                          >
                            ❌ Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditClick(exp)}
                          >
                            ✏️ Editar
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(exp)}
                          >
                            🗑️ Eliminar
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceList;