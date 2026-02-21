import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoriesService, getCategoryByIdService } from "../../../services/categorieServices";

// ===== GET TODAS LAS CATEGORÍAS =====
export const getCategoriesThunk = createAsyncThunk(
  "categories/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoriesService();
      // El backend puede devolver { success: true, categories: [...] } o directamente [...]
      return response.data.categories || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Error al obtener categorías"
      );
    }
  }
);

// ===== GET CATEGORÍA POR ID =====
export const getCategoryByIdThunk = createAsyncThunk(
  "categories/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCategoryByIdService(id);
      return response.data.category || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Error al obtener categoría"
      );
    }
  }
);
