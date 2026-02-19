import { createSlice } from "@reduxjs/toolkit";
import { getCategoriesThunk, getCategoryByIdThunk } from "./categoryThunk";

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: {
    list: [],
    currentCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        console.log("Categorías cargadas en Redux:", action.payload);
      })
      .addCase(getCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error(" Error al cargar categorías:", action.payload);
      })

      // GET BY ID
      .addCase(getCategoryByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(getCategoryByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
