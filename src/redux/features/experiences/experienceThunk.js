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
      const response = await addExperienciaService(payload);
      
      
      const experience = response.data?.data || response.data?.experience || response.data;
      
      
      return experience;
    } catch (error) {
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

      const { id, ...dataToUpdate } = payload;

      if (!id) {
        throw new Error("ID de experiencia requerido");
      }
      const response = await updateExperienciaService(id, dataToUpdate);
      return response.data?.data || response.data?.experience || response.data;
    } catch (error) {
      
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
      
      
      const response = await deleteExperienciaService(id);

      if (response.data?.success) {
        return id;
      } else {
        throw new Error(response.data?.message || "Error al eliminar");
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Error al eliminar experiencia"
      );
    }
  }
);
