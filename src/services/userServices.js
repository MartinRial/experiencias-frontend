// src/services/userServices.js
import axios from "axios";
import { API_URL } from "../config/api";

export const loginService = (credenciales, controller) => {
  return axios.post(`${API_URL}/login`, credenciales, {
    signal: controller.signal,
    headers: { "Content-Type": "application/json" },
    timeout: 8000,
  });
};

export const registerService = (datos, controller) => {
  return axios.post(`${API_URL}/signup`, datos, {
    signal: controller.signal,
    headers: { "Content-Type": "application/json" },
    timeout: 8000,
  });
};


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// PATCH: upgrade de plan (plus -> premium). El backend puede NO devolver body.
export const upgradePlanService = async () => {
  return axios.patch(`${API_URL}/users/update-plan`, {}, { headers: getAuthHeaders() });
};