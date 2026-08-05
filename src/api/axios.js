import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({ baseURL });

const TOKEN_KEY = "portfolio_token";
const REFRESH_KEY = "portfolio_refresh_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ token, refreshToken } = {}) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cliente aparte para /auth/refresh: si usáramos `api`, el propio
// interceptor de request le agregaría el access token vencido y el de
// response volvería a interceptar su 401, entrando en loop.
const refreshClient = axios.create({ baseURL });

let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      refreshPromise = Promise.reject(new Error("No hay refresh token"));
    } else {
      refreshPromise = refreshClient
        .post("/auth/refresh", { refreshToken })
        .then((res) => {
          setTokens({ token: res.data.token });
          return res.data.token;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
  }
  return refreshPromise;
}

// Si una llamada autenticada vuelve 401, el access token expiró o fue
// revocado. Antes de rendirnos intentamos refrescarlo una única vez y
// reintentar la petición original; solo si eso también falla (o la API
// contesta 403) avisamos al AuthContext para que cierre la sesión, en
// vez de dejar la UI mostrando una sesión que el backend ya rechaza.
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err;
    const hadToken = Boolean(config?.headers?.Authorization);

    if (!hadToken || !response) {
      return Promise.reject(err);
    }

    if (response.status === 401 && !config._retried) {
      config._retried = true;
      try {
        const token = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      } catch {
        window.dispatchEvent(new Event("auth:unauthorized"));
        return Promise.reject(err);
      }
    }

    if (response.status === 401 || response.status === 403) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(err);
  }
);

export default api;
