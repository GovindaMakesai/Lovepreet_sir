import axios from "axios";

const runtimeBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "/api"
    : "https://lovepreet-sir.onrender.com/api");

const api = axios.create({
  baseURL: runtimeBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
