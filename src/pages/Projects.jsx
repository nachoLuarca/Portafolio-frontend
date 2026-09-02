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
      <h1 className="mb-8 text-[32px] font-bold">Proyectos</h1>

      {loading && <LoadingState rows={4} />}
      {!loading && projects.length === 0 && (
        <EmptyState title="Todavía no hay proyectos publicados" description="Volvé a pasar más adelante." />
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </Container>
  );
}
