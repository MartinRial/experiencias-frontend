import axios from "axios";
import { API_URL } from "../config/api";

// 🟢 GET - Todas las experiencias
export const getExperienciasService = async () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/experiences`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getExperienciasByUserService = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  if (!userId) {
    console.error("❌ No se encontró userId en localStorage:", user);
    throw new Error("Usuario no identificado. Vuelve a iniciar sesión.");
  }

  console.log("🔍 Cargando experiencias del usuario:", userId);

  return axios.get(`${API_URL}/experiences/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// 🟢 POST - Agregar nueva experiencia
export const addExperienciaService = async (experiencia) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/experiences`, experiencia, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🟢 PUT - Actualizar experiencia existente
export const updateExperienciaService = async (id, experiencia) => {
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/experiences/${id}`, experiencia, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🟢 DELETE - Eliminar experiencia por ID
export const deleteExperienciaService = async (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API_URL}/experiences/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
