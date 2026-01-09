import axios from "axios";

const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Siempre apuntamos a /api (en local y en prod)
const api = axios.create({
  baseURL: `${API_ORIGIN.replace(/\/$/, "")}/api`,
});

// 🔐 Interceptor para añadir token a TODAS las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
