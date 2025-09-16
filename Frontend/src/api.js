// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ backend base URL
});

// 🔐 Attach token automatically for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token saved after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
