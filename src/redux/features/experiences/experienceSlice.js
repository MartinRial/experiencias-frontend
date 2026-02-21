import { createSlice } from "@reduxjs/toolkit";
import {
  getExperienciasThunk,
  getExperienciasByUserThunk,
  addExperienciaThunk,
  updateExperienciaThunk,
  deleteExperienciaThunk,
} from "./experienceThunk";

const normalizeExp = (exp) => {  
  const normalized = {
    ...exp,
    id: exp.id ?? exp._id,
    images: Array.isArray(exp.images) ? exp.images : [],
  };
  
  
  
  return normalized;
};

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const experienciasSlice = createSlice({
  name: "experienciasSlice",
  initialState,
  reducers: {
    resetExperiencias: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ===== GET ALL =====
    builder
      .addCase(getExperienciasThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExperienciasThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = (action.payload || []).map(normalizeExp);
      })
      .addCase(getExperienciasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar experiencias";
      });

    // ===== GET BY USER =====
    builder
      .addCase(getExperienciasByUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExperienciasByUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = (action.payload || []).map(normalizeExp);
      })
      .addCase(getExperienciasByUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar tus experiencias";
      });

    // ===== ADD =====
    builder
      .addCase(addExperienciaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExperienciaThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        const newExp = normalizeExp(action.payload);
        
        state.list.unshift(newExp);
      })
      .addCase(addExperienciaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al agregar experiencia";
      });

    // ===== UPDATE =====
    builder
      .addCase(updateExperienciaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExperienciaThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        
        const updated = normalizeExp(action.payload);
        
        const idx = state.list.findIndex((e) => e.id === updated.id);
        
        if (idx !== -1) {
          state.list[idx] = updated;
        } 
        
      })
      .addCase(updateExperienciaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al actualizar experiencia";
      });

    // ===== DELETE =====
    builder
      .addCase(deleteExperienciaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExperienciaThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        const deletedId = action.payload;
        
        // 👇 CORRECCIÓN: Solo filtrar por 'id' ya que normalizamos
        const lengthBefore = state.list.length;
        state.list = state.list.filter((e) => {
          const keep = e.id !== deletedId;
          if (!keep) {
          }
          return keep;
        });
        
        const lengthAfter = state.list.length;
        
        if (lengthBefore === lengthAfter) {
        }
      })
      .addCase(deleteExperienciaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al eliminar experiencia";
      });
  },
});

export const { resetExperiencias } = experienciasSlice.actions;
export default experienciasSlice.reducer;
