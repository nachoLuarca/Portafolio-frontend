import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Container from "../components/Container.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/projects/${slug}`)
      .then((res) => setProject(res.data))
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <Container className="py-22">
        <EmptyState title="No se encontró este proyecto" description="Puede que haya sido movido o eliminado." />
        <Button asChild variant="outline" className="mt-4">
          <Link to="/proyectos">← volver</Link>
        </Button>
      </Container>
    );
  }

  if (!project) {
    return <Container className="py-22"><LoadingState rows={4} /></Container>;
  }

  return (
    <Container className="max-w-190 py-14 pb-22">
      <Link to="/proyectos" className="text-sm text-muted-foreground hover:text-primary">← proyectos</Link>

      <h1 className="my-4 text-3xl font-bold">{project.title}</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {(project.tech_stack || []).map((t) => (
          <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
        ))}
      </div>

      {project.cover_image_url && (
        <img src={project.cover_image_url} alt={project.title} className="mb-7 w-full rounded-2xl border border-border" />
      )}

      <p className="mb-8 text-base leading-relaxed whitespace-pre-wrap text-muted-foreground">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-3">
        {project.repo_url && (
          <Button asChild variant="outline">
            <a href={project.repo_url} target="_blank" rel="noreferrer">Ver repositorio</a>
          </Button>
        )}
        {project.demo_url && (
          <Button asChild>
            <a href={project.demo_url} target="_blank" rel="noreferrer">Ver demo</a>
          </Button>
        )}
      </div>
    </Container>
  );
}
