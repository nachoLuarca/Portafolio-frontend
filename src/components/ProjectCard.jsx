import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useMotionTemplate, useSpring, useReducedMotion } from "framer-motion";
import { Code2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProjectCard({ project }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 30 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(240px circle at ${glowX}% ${glowY}%, rgba(47,93,255,0.16), transparent 70%)`;

  function handleMouseMove(e) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rawRotateY.set((px - 0.5) * 8);
    rawRotateX.set((0.5 - py) * 8);
    glowX.set(px * 100);
    glowY.set(py * 100);
  }

  function handleMouseLeave() {
    rawRotateX.set(0);
    rawRotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={`/proyectos/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-200 hover:shadow-xl"
      >
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glow }}
          />
        )}

        {project.cover_image_url && (
          <div className="h-40 w-full shrink-0">
            <img src={project.cover_image_url} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-1.5 flex flex-wrap items-baseline gap-2">
            <h3 className="font-heading text-lg font-semibold">{project.title}</h3>
            {project.featured && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-primary">destacado</span>
            )}
          </div>
          <p className="mb-3 text-sm text-muted-foreground">{project.summary}</p>
          <div className="flex flex-wrap gap-1.5">
            {(project.tech_stack || []).map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
            ))}
          </div>

          {(project.repo_url || project.demo_url) && (
            <div className="mt-4 flex gap-3 border-t border-border pt-4">
              {project.demo_url && <Globe className="size-4 text-muted-foreground" aria-label="Demo disponible" />}
              {project.repo_url && <Code2 className="size-4 text-muted-foreground" aria-label="Repositorio disponible" />}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
