import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getExperienciasService,
  getExperienciasByUserService,
  addExperienciaService,
  updateExperienciaService,
  deleteExperienciaService,
} from "../../../services/experienceServices";

// ===== GET TODAS =====
export const getExperienciasThunk = createAsyncThunk(
  "experiencias/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getExperienciasService();
      console.log("📥 Respuesta GET todas:", response.data);
      return response.data?.experiences || response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Error al obtener experiencias"
      );
    }
  }
);

// ===== GET POR USUARIO =====
export const getExperienciasByUserThunk = createAsyncThunk(
  "experiencias/getByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getExperienciasByUserService();
      console.log("📥 Respuesta GET by user:", response.data);
      return response.data?.experiences || response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Error al obtener mis experiencias"
      );
    }
  }
);

// ===== POST (CREATOR) =====
export const addExperienciaThunk = createAsyncThunk(
  "experiencias/add",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("🚀 THUNK - Payload recibido:", payload);
      console.log("🖼️ THUNK - Imágenes en payload:", payload.images);
      
      const response = await addExperienciaService(payload);
      
      console.log("📥 THUNK - Respuesta del servicio:", response.data);
      
      const experience = response.data?.data || response.data?.experience || response.data;
      
      console.log("✅ THUNK - Experiencia procesada:", experience);
      console.log("🖼️ THUNK - Imágenes procesadas:", experience.images);
      
      return experience;
    } catch (error) {
      console.error("❌ THUNK - Error:", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Error al crear experiencia"
      );
    }
  }
);

// ===== PUT (CREATOR) =====
export const updateExperienciaThunk = createAsyncThunk(
  "experiencias/update",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("📤 THUNK UPDATE - Payload completo:", payload);

      const { id, ...dataToUpdate } = payload;

      if (!id) {
        throw new Error("ID de experiencia requerido");
      }

      console.log("📤 THUNK UPDATE - ID:", id);
      console.log("📤 THUNK UPDATE - Data:", dataToUpdate);

      const response = await updateExperienciaService(id, dataToUpdate);
      
      console.log("✅ THUNK UPDATE - Respuesta:", response.data);

      return response.data?.data || response.data?.experience || response.data;
    } catch (error) {
      console.error("❌ Error en updateExperienciaThunk:", error);
      console.error("❌ Error response:", error.response?.data);
      
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Error al actualizar experiencia"
      );
    }
  }
);

// ===== DELETE (CREATOR) =====
export const deleteExperienciaThunk = createAsyncThunk(
  "experiencias/delete",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) throw new Error("ID de experiencia requerido");
      
      console.log("🗑️ THUNK DELETE - ID:", id);
      
      const response = await deleteExperienciaService(id);
      console.log("🗑️ THUNK DELETE - Respuesta:", response.data);

      if (response.data?.success) {
        return id;
      } else {
        throw new Error(response.data?.message || "Error al eliminar");
      }
    } catch (error) {
      console.error("❌ Error en deleteExperienciaThunk:", error);
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Error al eliminar experiencia"
      );
    }
  }
);