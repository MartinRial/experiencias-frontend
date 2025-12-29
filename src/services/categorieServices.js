import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://experiencias-uy.vercel.app";

// 🔹 GET todas las categorías
export const getCategoriesService = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/categories`);
    console.log("📥 Categorías obtenidas:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    throw error;
  }
};

// 🔹 GET categoría por ID (opcional)
export const getCategoryByIdService = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/categories/${id}`);
    return response;
  } catch (error) {
    console.error(`❌ Error al obtener categoría ${id}:`, error);
    throw error;
  }
};