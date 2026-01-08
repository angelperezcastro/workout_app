import axios from "axios";

// En prod pon VITE_API_URL = "https://TU-BACKEND.onrender.com"
// (sin /api). Este archivo se encarga de añadir /api.
const raw = import.meta.env.VITE_API_URL;

const baseURL = raw
  ? `${raw.replace(/\/$/, "")}/api`
  : "http://localhost:5000/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
