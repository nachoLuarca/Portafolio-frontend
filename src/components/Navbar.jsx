import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Container from "./Container.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";

const sections = [
  { href: "/#experiencia", label: "experiencia" },
  { href: "/#proyectos", label: "proyectos" },
  { href: "/#educacion", label: "educación" },
  { href: "/#contacto", label: "contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const adminTo = user ? "/admin" : "/admin/login";
  const adminLabel = user ? "panel →" : "admin →";

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-[var(--nav-bg)] backdrop-blur-sm">
      <Container as="nav" className="flex h-16 items-center justify-end gap-4">
        <div className="hidden items-center gap-5 md:flex">
          {sections.map((s) => (
            <a key={s.href} href={s.href} className="font-mono text-[13px] whitespace-nowrap text-muted-foreground hover:text-foreground">
              {s.label}
            </a>
          ))}
          <Button asChild variant="outline" size="sm" className="shrink-0 font-mono">
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
                className="rounded-md px-2 py-2.5 font-mono text-[13px] text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
            <Button asChild variant="outline" size="sm" className="mt-1 font-mono">
              <Link to={adminTo} onClick={() => setOpen(false)}>{adminLabel}</Link>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
