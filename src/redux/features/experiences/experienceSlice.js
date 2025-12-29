import { createSlice } from "@reduxjs/toolkit";
import {
  getExperienciasThunk,
  getExperienciasByUserThunk,
  addExperienciaThunk,
  updateExperienciaThunk,
  deleteExperienciaThunk,
} from "./experienceThunk";

const normalizeExp = (exp) => {
  console.log("🔄 SLICE - Normalizando experiencia:", exp);
  
  const normalized = {
    ...exp,
    id: exp.id ?? exp._id,
    images: Array.isArray(exp.images) ? exp.images : [],
  };
  
  console.log("✅ SLICE - Experiencia normalizada:", normalized);
  console.log("🖼️ SLICE - Imágenes normalizadas:", normalized.images);
  
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
        console.log("✅ SLICE - Experiencias cargadas (getAll):", state.list.length);
      })
      .addCase(getExperienciasThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar experiencias";
        console.error("❌ SLICE - Error getAll:", action.payload);
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
        console.log("✅ SLICE - Experiencias cargadas (byUser):", state.list.length);
      })
      .addCase(getExperienciasByUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al cargar tus experiencias";
        console.error("❌ SLICE - Error byUser:", action.payload);
      });

    // ===== ADD =====
    builder
      .addCase(addExperienciaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExperienciaThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log("📥 SLICE - Payload recibido (ADD):", action.payload);
        
        const newExp = normalizeExp(action.payload);
        console.log("✅ SLICE - Nueva experiencia normalizada:", newExp);
        
        state.list.unshift(newExp);
        console.log("📦 SLICE - Total experiencias:", state.list.length);
      })
      .addCase(addExperienciaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al agregar experiencia";
        console.error("❌ SLICE - Error ADD:", action.payload);
      });

    // ===== UPDATE =====
    builder
      .addCase(updateExperienciaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExperienciaThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        console.log("📥 SLICE - Payload UPDATE:", action.payload);
        
        const updated = normalizeExp(action.payload);
        console.log("🔍 SLICE - Buscando experiencia con ID:", updated.id);
        
        const idx = state.list.findIndex((e) => e.id === updated.id);
        
        if (idx !== -1) {
          console.log(`✅ SLICE - Experiencia encontrada en índice ${idx}, actualizando...`);
          state.list[idx] = updated;
        } else {
          console.warn("⚠️ SLICE - Experiencia NO encontrada para actualizar:", updated.id);
        }
        
        console.log("📦 SLICE - Lista después de UPDATE:", state.list.length);
      })
      .addCase(updateExperienciaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al actualizar experiencia";
        console.error("❌ SLICE - Error UPDATE:", action.payload);
      });

    // ===== DELETE =====
    builder
      .addCase(deleteExperienciaThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("⏳ SLICE - Iniciando eliminación...");
      })
      .addCase(deleteExperienciaThunk.fulfilled, (state, action) => {
        state.loading = false;
        
        const deletedId = action.payload;
        console.log("🗑️ SLICE - ID a eliminar:", deletedId);
        console.log("📦 SLICE - Lista ANTES:", state.list.length, "experiencias");
        
        // 👇 CORRECCIÓN: Solo filtrar por 'id' ya que normalizamos
        const lengthBefore = state.list.length;
        state.list = state.list.filter((e) => {
          const keep = e.id !== deletedId;
          if (!keep) {
            console.log("🗑️ SLICE - Eliminando experiencia:", e.title);
          }
          return keep;
        });
        
        const lengthAfter = state.list.length;
        console.log("📦 SLICE - Lista DESPUÉS:", lengthAfter, "experiencias");
        console.log(`✅ SLICE - Eliminadas: ${lengthBefore - lengthAfter} experiencia(s)`);
        
        if (lengthBefore === lengthAfter) {
          console.warn("⚠️ SLICE - NO se eliminó ninguna experiencia. Verificar ID:", deletedId);
        }
      })
      .addCase(deleteExperienciaThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al eliminar experiencia";
        console.error("❌ SLICE - Error DELETE:", action.payload);
      });
  },
});

export const { resetExperiencias } = experienciasSlice.actions;
export default experienciasSlice.reducer;