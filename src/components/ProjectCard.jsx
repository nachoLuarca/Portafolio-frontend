import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/proyectos/${project.slug}`}
      className="grid grid-cols-1 gap-1 border-b border-border py-4 transition-colors hover:bg-accent sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-4"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="truncate text-base font-medium text-foreground">{project.title}</h3>
          {project.featured && <span className="font-mono text-xs text-flag">destacado</span>}
        </div>
        {project.summary && <p className="mt-0.5 truncate text-sm text-muted-foreground">{project.summary}</p>}
      </div>
      <div className="font-mono text-xs text-muted-foreground">
        {(project.tech_stack || []).join(" · ")}
      </div>
      <div className="font-mono text-xs text-muted-foreground sm:text-right">
        {new Date(project.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "short" })}
      </div>
    </Link>
  );
}
