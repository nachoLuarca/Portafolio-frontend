import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si una llamada autenticada vuelve 401, el token dejó de ser válido
// (expiró o fue revocado) — no es una navegación normal, es una sesión
// realmente muerta. Avisamos al AuthContext para que limpie el estado
// en vez de dejar la UI mostrando una sesión que el backend ya rechaza.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const hadToken = Boolean(err.config?.headers?.Authorization);
    if (hadToken && err.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(err);
  }
);

export default api;
