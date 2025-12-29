// src/components/AddExperience.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExperienciaThunk,
  getExperienciasByUserThunk,
} from "../redux/features/experiences/experienceThunk";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "../config/api";
import { DEPARTAMENTOS_URUGUAY } from "../utils/deptos";
import SubirImagen from "./SubirImagen";
import "../styles/AddExperience.css";

const AddExperience = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.userSlice);
  const { list, loading } = useSelector((s) => s.experienciasSlice);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    capacity: 1,
    date: "",
    department: "",
    category: "",
  });

  const [imagesUrls, setImagesUrls] = useState([]);
  const uploaderRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const MAX_EXPERIENCIAS_PLUS = 10;
  const MAX_IMAGENES = 5;

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("❌ Error categorías:", err);
        toast.error("No se pudieron cargar las categorías");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Cargar experiencias del usuario
  useEffect(() => {
    if (user?.id || user?._id) {
      dispatch(getExperienciasByUserThunk());
    }
  }, [dispatch, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImgURL = (url) => {
    if (!url) return;
    setImagesUrls((prev) => {
      if (prev.includes(url)) return prev;
      if (prev.length >= MAX_IMAGENES) {
        toast.warn(`Máximo ${MAX_IMAGENES} imágenes por experiencia`);
        return prev;
      }
      return [...prev, url];
    });
  };

  const removeImage = (url) => {
    setImagesUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar límite de plan
    if (user?.plan === "plus" && list.length >= MAX_EXPERIENCIAS_PLUS) {
      toast.warning("Has alcanzado el límite de 10 experiencias con tu plan PLUS");
      return;
    }

    // Validar campos
    const { title, description, price, capacity, date, department, category } = form;
    if (!title || !description || !price || !capacity || !date || !department || !category) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      capacity: Number(capacity),
      date: new Date(date).toISOString(),
      location: department,
      category,
      images: imagesUrls,
    };

    console.log("📤 PAYLOAD A ENVIAR:", JSON.stringify(payload, null, 2));
    console.log("🖼️ IMÁGENES:", imagesUrls);

    const result = await dispatch(addExperienciaThunk(payload));

    console.log("📥 RESULTADO:", result);

    if (addExperienciaThunk.fulfilled.match(result)) {
      console.log("✅ Experiencia creada:", result.payload);
      toast.success("Experiencia creada exitosamente 🎉");
      
      // Reset
      setForm({
        title: "",
        description: "",
        price: "",
        capacity: 1,
        date: "",
        department: "",
        category: "",
      });
      setImagesUrls([]);
      uploaderRef.current?.reset?.();
    } else {
      console.error("❌ Error:", result.payload);
      toast.error(result.payload || "Error al crear la experiencia");
    }
  };

  const limiteAlcanzado = user?.plan === "plus" && list.length >= MAX_EXPERIENCIAS_PLUS;

  if (loading) return <Spinner />;

  return (
    <div className="add-experience-container">
      <h2 className="title">✨ Agregar Nueva Experiencia</h2>
      <p className="subtitle">Completa los detalles de tu experiencia</p>

      {limiteAlcanzado && (
        <div className="alert-warning">
          ⚠️ Has alcanzado el límite de 10 experiencias en tu plan PLUS. <br />
          <strong>Actualiza a PREMIUM</strong> para experiencias ilimitadas.
        </div>
      )}

      <form className="form-experience" onSubmit={handleSubmit}>
        <label>Título *</label>
        <input
          type="text"
          name="title"
          placeholder="Ej: Tour por Colonia del Sacramento"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Descripción *</label>
        <textarea
          name="description"
          placeholder="Describe la experiencia..."
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <div>
            <label>Departamento *</label>
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">-- Selecciona un departamento --</option>
              {DEPARTAMENTOS_URUGUAY.map((dep) => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Precio (USD) *</label>
            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Fecha y hora *</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Capacidad *</label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label>Categoría *</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Selecciona una categoría --</option>
          {loadingCategories ? (
            <option disabled>Cargando categorías...</option>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.icon && `${cat.icon} `}{cat.name}
              </option>
            ))
          ) : (
            <option disabled>No hay categorías disponibles</option>
          )}
        </select>

        <div className="image-uploader-block">
          <label>Imágenes (opcional)</label>
          <SubirImagen ref={uploaderRef} handleImgURL={handleImgURL} />

          {imagesUrls.length > 0 && (
            <div className="images-preview">
              {imagesUrls.map((url) => (
                <div key={url} className="img-mini">
                  <img src={url} alt="Preview" />
                  <button
                    type="button"
                    className="btn-remove-img"
                    onClick={() => removeImage(url)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={limiteAlcanzado || loading}>
          {limiteAlcanzado ? "🚫 Límite alcanzado" : "➕ Agregar Experiencia"}
        </button>
      </form>
    </div>
  );
};

export default AddExperience;