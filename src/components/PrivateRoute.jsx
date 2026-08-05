import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "./Container.jsx";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Container className="py-20 text-muted-foreground">Cargando…</Container>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
