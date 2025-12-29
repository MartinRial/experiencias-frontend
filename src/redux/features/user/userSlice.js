// src/redux/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  registerUserThunk,
  upgradePlanThunk,
} from "./userThunk";
// import { resetExperiencias } from "../experiences/experienceSlice"; // si lo usás

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: (() => {
      try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
      } catch {
        return null;
      }
    })(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("🚪 Sesión cerrada correctamente.");
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== LOGIN =====
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user  = action.payload.user;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })

      // ===== REGISTER =====
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user  = action.payload.user;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })

      // ===== UPGRADE PLAN =====
      .addCase(upgradePlanThunk.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(upgradePlanThunk.fulfilled, (state, action) => {
        state.loading = false;
        const nuevoPlan = action.payload?.plan; // ← tolerante
        if (state.user && nuevoPlan) {
          state.user.plan = nuevoPlan;
          localStorage.setItem("user", JSON.stringify(state.user));
          console.log("💎 Plan actualizado:", state.user.plan);
        }
      })
      .addCase(upgradePlanThunk.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
