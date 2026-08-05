import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserMenu from "./UserMenu.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import TopBar from "./TopBar.jsx";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Proyectos", match: (p) => p === "/admin" || p.startsWith("/admin/proyectos") },
  { to: "/admin/experiencia", label: "Experiencia", match: (p) => p.startsWith("/admin/experiencia") },
  { to: "/admin/educacion", label: "Educación", match: (p) => p.startsWith("/admin/educacion") },
  { to: "/admin/certificaciones", label: "Certificaciones", match: (p) => p.startsWith("/admin/certificaciones") },
  { to: "/admin/mensajes", label: "Mensajes", match: (p) => p.startsWith("/admin/mensajes") },
  { to: "/admin/perfil", label: "Perfil", match: (p) => p.startsWith("/admin/perfil") },
];

const homeLinkClass = "flex items-center gap-2 rounded-md px-2 py-2 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground";

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border p-4 md:hidden">
        <div className="font-mono text-xs text-success">● {user?.name}</div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="admin-mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>
      {open && (
        <div id="admin-mobile-nav" className="border-b border-border p-4 md:hidden">
          <nav className="flex flex-col gap-0.5">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-2 py-2.5 font-mono text-[13px]",
                  l.match(pathname) ? "bg-secondary text-foreground" : "text-muted-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className={homeLinkClass}>
              <Home className="size-3.5" />
              Volver al inicio
            </Link>
            <UserMenu />
          </div>
        </div>
      )}

      {/* Desktop sidebar: nav arriba, bloque de usuario pegado abajo via flex */}
      <aside className="hidden w-55 shrink-0 border-r border-border md:sticky md:top-0 md:flex md:h-screen md:flex-col md:p-6">
        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "block rounded-md px-2 py-2.5 font-mono text-[13px]",
                l.match(pathname) ? "bg-secondary text-foreground" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 shrink-0">
          <Separator className="mb-4" />
          <div className="space-y-2">
            <UserMenu />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <TopBar />
        {children}
      </main>
    </div>
  );
}
