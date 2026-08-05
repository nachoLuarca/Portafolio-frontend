import { Link } from "react-router-dom";
import Container from "../components/Container.jsx";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="mb-3 font-mono text-destructive">error 404</p>
      <h1 className="mb-5 text-3xl">Esta ruta no existe.</h1>
      <Button asChild>
        <Link to="/">Volver al inicio</Link>
      </Button>
    </Container>
  );
}
