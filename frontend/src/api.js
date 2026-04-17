import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// In production, avoid accidentally calling frontend-domain /api routes on Vercel.
const runtimeBaseUrl =
  !isLocalhost && (!configuredBaseUrl || configuredBaseUrl.startsWith("/"))
    ? "https://lovepreet-sir.onrender.com/api"
    : configuredBaseUrl || "/api";

const api = axios.create({
  baseURL: runtimeBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
