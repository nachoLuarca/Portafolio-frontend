import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearTokens, getRefreshToken, getToken, setTokens } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutReason, setLogoutReason] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setTokens({ token: res.data.token, refreshToken: res.data.refreshToken });
    setUser(res.data.user);
    setLogoutReason(null);
    return res.data.user;
  }

  // `reason` distingue un logout forzado (sesión vencida, desconexión
  // prolongada) de uno manual: solo el forzado redirige y muestra el
  // motivo en /admin/login, porque el manual ya lo maneja quien lo llama
  // (ej. UserMenu navega a "/").
  const logout = useCallback(
    (reason) => {
      const token = getToken();
      const refreshToken = getRefreshToken();
      // Header explícito en vez de depender del interceptor de request:
      // este corre en un microtask posterior a clearTokens(), así que
      // para cuando leyera localStorage el token ya habría desaparecido
      // y el logout llegaría sin Authorization (401 en el backend).
      if (token) {
        api
          .post("/auth/logout", refreshToken ? { refreshToken } : undefined, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() => {});
      }
      clearTokens();
      setUser(null);
      if (reason) {
        setLogoutReason(reason);
        navigate("/admin/login", { replace: true });
      }
    },
    [navigate]
  );

  const clearLogoutReason = useCallback(() => setLogoutReason(null), []);

  // El interceptor de axios dispara este evento cuando una llamada
  // autenticada vuelve 401 (tras fallar el refresh) o 403 — cerramos la
  // sesión en el estado de React y avisamos al usuario del motivo.
  useEffect(() => {
    function handleUnauthorized() {
      logout("Tu sesión expiró. Iniciá sesión nuevamente.");
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, logoutReason, clearLogoutReason }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
