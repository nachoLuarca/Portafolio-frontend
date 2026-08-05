import { useEffect, useRef, useState } from "react";
import axios from "axios";

const HEALTH_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/health`;
const HEALTH_CHECK_INTERVAL_MS = 5000;
const FORCE_LOGOUT_AFTER_MS = 30000;

// Cliente sin interceptores: un health-check no debe llevar/renovar
// tokens ni disparar el flujo de auth si falla.
const healthClient = axios.create();

// navigator.onLine solo refleja si hay una interfaz de red activa, no si
// el backend responde — por eso, además de escuchar 'online'/'offline',
// hacemos polling a /api/health mientras estemos "caídos" para confirmar
// que el servicio realmente volvió antes de ocultar el banner.
export function useConnectionStatus({ onProlongedDisconnect } = {}) {
  const [online, setOnline] = useState(navigator.onLine);
  const disconnectedSinceRef = useRef(null);
  const forcedRef = useRef(false);
  const onProlongedDisconnectRef = useRef(onProlongedDisconnect);
  onProlongedDisconnectRef.current = onProlongedDisconnect;

  useEffect(() => {
    function handleOnline() {
      healthClient
        .get(HEALTH_URL, { timeout: 4000 })
        .then(() => setOnline(true))
        .catch(() => setOnline(false));
    }
    function handleOffline() {
      setOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (online) {
      disconnectedSinceRef.current = null;
      forcedRef.current = false;
      return;
    }

    disconnectedSinceRef.current = Date.now();

    const interval = setInterval(() => {
      healthClient
        .get(HEALTH_URL, { timeout: 4000 })
        .then(() => setOnline(true))
        .catch(() => {
          const elapsed = Date.now() - disconnectedSinceRef.current;
          if (elapsed >= FORCE_LOGOUT_AFTER_MS && !forcedRef.current) {
            forcedRef.current = true;
            onProlongedDisconnectRef.current?.();
          }
        });
    }, HEALTH_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [online]);

  return { online };
}
