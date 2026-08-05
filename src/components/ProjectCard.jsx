import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/proyectos/${project.slug}`}
      className="mb-3.5 block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary"
    >
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        {project.featured && (
          <Badge variant="outline" className="border-primary font-mono font-normal text-primary">
            destacado
          </Badge>
        )}
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {new Date(project.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "short" })}
        </span>
      </div>
      <h3 className="mb-1.5 text-xl">{project.title}</h3>
      <p className="mb-3 text-sm">{project.summary}</p>
      <div className="flex flex-wrap gap-2">
        {(project.tech_stack || []).map((t) => (
          <Badge key={t} variant="outline" className="font-mono font-normal text-muted-foreground">
            {t}
          </Badge>
        ))}
      </div>
    </Link>
  );
}
