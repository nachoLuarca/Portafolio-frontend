import { WifiOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConnectionStatus } from "../hooks/useConnectionStatus.js";

export default function ConnectionBanner() {
  const { user, logout } = useAuth();

  const { online } = useConnectionStatus({
    onProlongedDisconnect: () => {
      if (user) {
        logout("Tu sesión se cerró por inactividad del servicio.");
      }
    },
  });

  if (online) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-warning px-4 py-2 text-center font-mono text-xs text-warning-foreground"
    >
      <WifiOff className="size-3.5 shrink-0" />
      <span>Sin conexión. Intentando reconectar…</span>
    </div>
  );
}
