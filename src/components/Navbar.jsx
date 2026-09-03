import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import Container from "./Container.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { Button } from "@/components/ui/button";

const sections = [
  { href: "/#perfil", label: "perfil", id: "perfil" },
  { href: "/#proyectos", label: "proyectos", id: "proyectos" },
  { href: "/#experiencia", label: "experiencia", id: "experiencia" },
  { href: "/#educacion", label: "educación", id: "educacion" },
  { href: "/#certificaciones", label: "certificaciones", id: "certificaciones" },
  { href: "/#contacto", label: "contacto", id: "contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Resalta el link de la sección visible mientras se hace scroll por el
  // Home. Se restringe explícitamente a "/" (en vez de solo buscar los ids
  // en el DOM) porque, durante la transición de página de AnimatePresence,
  // el Home saliente todavía sigue montado un instante en otras rutas.
  //
  // Se calcula directamente contra una línea de referencia cerca del top
  // (en vez de IntersectionObserver con una banda angosta en el centro):
  // con scroll rápido o secciones cortas, una banda angosta puede no llegar
  // a intersectar nunca una sección entre dos frames, y el indicador queda
  // pegado en la sección anterior.
  //
  // Los elementos se buscan en cada evento, no una sola vez al montar:
  // varias secciones (educación, certificaciones, contacto) dependen de
  // datos que llegan de la API y todavía no existen en el DOM en el momento
  // en que este efecto corre por primera vez — capturarlos una sola vez
  // dejaba el indicador sin poder llegar nunca a esas secciones.
  useEffect(() => {
    setActive(null);

    if (location.pathname !== "/") return;

    const REFERENCE_OFFSET = 120; // px desde el top, debajo del navbar sticky

    const updateActive = () => {
      const elements = sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean);
      if (elements.length === 0) return;

      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= REFERENCE_OFFSET) {
          current = el.id;
        } else {
          break;
        }
      }
      setActive(current);
    };

    const onScroll = () => updateActive();

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-(--nav-bg) backdrop-blur-sm">
      <div className="h-[3px] bg-(--hero-accent)/20">
        <motion.div className="h-full origin-left bg-(--hero-accent)" style={{ scaleX: progress }} />
      </div>
      <Container as="nav" className="flex h-16 items-center justify-end gap-2">
        <div className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="relative rounded-full px-3 py-1.5 text-sm whitespace-nowrap text-muted-foreground hover:text-primary"
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </a>
          ))}
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
                className={`rounded-md px-2 py-2.5 text-sm hover:bg-secondary hover:text-primary ${active === s.id ? "font-medium text-primary" : "text-muted-foreground"}`}
              >
                {s.label}
              </a>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
