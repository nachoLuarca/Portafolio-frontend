import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle.jsx";

export default function TopBar() {
  return (
    <div className="sticky top-0 z-10 hidden h-16 items-center justify-end gap-2 border-b border-border bg-background px-8 md:flex">
      <Button asChild variant="outline" size="icon" className="shrink-0 bg-card">
        <Link to="/" aria-label="Volver al perfil" title="Volver al perfil">
          <Home className="size-4" />
        </Link>
      </Button>
      <ThemeToggle />
    </div>
  );
}
