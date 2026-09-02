import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Container from "./Container.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";

const sections = [
  { href: "/#perfil", label: "perfil" },
  { href: "/#proyectos", label: "proyectos" },
  { href: "/#experiencia", label: "experiencia" },
  { href: "/#educacion", label: "educación" },
  { href: "/#certificaciones", label: "certificaciones" },
  { href: "/#contacto", label: "contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const adminTo = user ? "/admin" : "/admin/login";
  const adminLabel = user ? "panel" : "admin";

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-(--nav-bg) backdrop-blur-sm">
      <div className="h-[3px] bg-(--hero-accent)" />
      <Container as="nav" className="flex h-16 items-center justify-end gap-2">
        <div className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a key={s.href} href={s.href} className="rounded-full px-3 py-1.5 text-sm whitespace-nowrap text-muted-foreground hover:bg-accent hover:text-primary">
              {s.label}
            </a>
          ))}
          <Button asChild size="sm" className="ml-3 shrink-0">
            <Link to={adminTo}>{adminLabel}</Link>
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </Container>

      {open && (
        <div id="mobile-nav" className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-primary"
              >
                {s.label}
              </a>
            ))}
            <Button asChild size="sm" className="mt-1">
              <Link to={adminTo} onClick={() => setOpen(false)}>{adminLabel}</Link>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
