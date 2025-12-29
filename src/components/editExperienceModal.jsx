import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateExperienciaThunk } from "../redux/features/experiences/experienceThunk";
import "../styles/EditExperienceModal.css";

const EditExperienceModal = ({ experience, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.experienciasSlice);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    capacity: "",
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || "",
        description: experience.description || "",
        location: experience.location || "",
        price: experience.price || "",
        capacity: experience.capacity || "",
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.warn("⚠️ El título es obligatorio");
      return;
    }

    if (!formData.description.trim()) {
      toast.warn("⚠️ La descripción es obligatoria");
      return;
    }

    // ✅ Solo enviar campos que el backend permite editar (SIN date)
    const datosActualizados = {
      id: experience._id || experience.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
    };

    console.log("📤 MODAL - Datos a enviar (SIN date):", JSON.stringify(datosActualizados, null, 2));

    const result = await dispatch(updateExperienciaThunk(datosActualizados));

    if (updateExperienciaThunk.fulfilled.match(result)) {
      toast.success("✅ Experiencia actualizada correctamente");
      onClose();
    } else {
      console.error("❌ MODAL - Error recibido:", result.payload);
      toast.error(result.payload || "❌ Error al actualizar la experiencia");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">✏️ Editar Experiencia</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Aventura en la playa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe la experiencia..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Ubicación *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: Punta del Este"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Precio (USD) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacidad *</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Número de personas"
              min="1"
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Guardando..." : "💾 Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExperienceModal;