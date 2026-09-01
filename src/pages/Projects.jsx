import { useEffect, useState } from "react";
import api from "../api/axios";
import ProjectCard from "../components/ProjectCard.jsx";
import Container from "../components/Container.jsx";
import LoadingState from "../components/LoadingState.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-14 pb-22">
      <h1 className="mb-8 text-[28px] font-semibold">Proyectos</h1>

      {loading && <LoadingState rows={4} />}
      {!loading && projects.length === 0 && (
        <EmptyState title="Todavía no hay proyectos publicados" description="Volvé a pasar más adelante." />
      )}
      {projects.length > 0 && (
        <div className="hidden border-b border-border pb-1.5 font-mono text-xs text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] sm:gap-4">
          <span>proyecto</span>
          <span>stack</span>
          <span className="text-right">actualizado</span>
        </div>
      )}
      {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
    </Container>
  );
}
