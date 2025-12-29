// src/redux/features/user/userThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, registerService } from "../../../services/userServices";
import { getExperienciasByUserThunk } from "../experiences/experienceThunk";
import { resetExperiencias } from "../experiences/experienceSlice";
import { upgradePlanService } from "../../../services/userServices";

// ===== LOGIN =====
export const loginUserThunk = createAsyncThunk(
  "user/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    const controller = new AbortController();
    try {
      const { data } = await loginService(credentials, controller);
      const { token, user } = data || {};
      if (!token || !user) throw new Error("Respuesta inválida del servidor");

      // Si el backend no envía role, usar clientRole guardado (fallback UI)
      const clientRole = localStorage.getItem("clientRole");
      const finalUser = user.role ? user : { ...user, role: clientRole || user.role };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(finalUser));

      dispatch(resetExperiencias());
      if (finalUser.role === "creator") {
        dispatch(getExperienciasByUserThunk());
      }

      return { token, user: finalUser };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Error de autenticación. Verifica tus credenciales."
      );
    } finally {
      controller.abort();
    }
  }
);

// ===== REGISTER =====
export const registerUserThunk = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    const controller = new AbortController();
    try {
      // Normalizar role que envías
      const chosenRole = userData.role === "creator" ? "creator" : "user";
      localStorage.setItem("clientRole", chosenRole);

      const { data } = await registerService({ ...userData, role: chosenRole }, controller);
      const { token, user } = data || {};
      if (!token || !user) throw new Error("Error inesperado en registro");

      // Usa el rol del backend si viene; si no, aplica el elegido como fallback
      const finalUser = user.role ? user : { ...user, role: chosenRole };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(finalUser));

      return { token, user: finalUser };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Error en el registro. Intenta nuevamente."
      );
    } finally {
      controller.abort();
    }
  }
);

export const upgradePlanThunk = createAsyncThunk(
  "user/upgradePlan",
  async (desiredPlan, { rejectWithValue }) => {
    try {
      const res = await upgradePlanService();
      // Intenta deducir el plan desde la respuesta; si no hay body, usa el desiredPlan o 'premium'
      const plan =
        res.data?.data?.plan ||
        res.data?.plan ||
        res.data?.user?.plan ||
        desiredPlan ||
        "premium";

      return { plan };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "No se pudo actualizar el plan"
      );
    }
  }
);
