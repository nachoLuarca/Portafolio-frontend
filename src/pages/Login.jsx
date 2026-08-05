import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Container from "../components/Container.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ya autenticado (ej. volvió al sitio público y usó el link "admin"):
  // directo al panel, sin pasar de nuevo por el formulario.
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="max-w-[400px] py-20">
      <h1 className="mb-1.5 text-[28px]">Acceso admin</h1>
      <p className="mb-7 text-sm">Iniciá sesión para gestionar el contenido del sitio.</p>

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-invalid={!!error}
              required
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-invalid={!!error}
              required
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <CircleAlert className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="mt-5 w-full" disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </Container>
  );
}
